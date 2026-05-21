from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
from database.base import get_db
from database import models
from models import schemas
from services.ml_service import predict_crop, predict_disease, detect_weather_anomaly
from services.weather_service import fetch_weather, check_severe_weather
from services.gemini_service import generate_farming_plan, chat_with_assistant, validate_crops_for_location
from services.maharashtra_crop_service import get_regional_crops, get_regional_context, merge_recommendations
from services.sms_service import send_weather_alert_sms
import datetime

router = APIRouter()


@router.post("/input", response_model=schemas.UserInputResponse)
def create_input(user_input: schemas.UserInputCreate, db: Session = Depends(get_db)):
    db_input = models.UserInput(**user_input.dict())
    db.add(db_input)
    db.commit()
    db.refresh(db_input)
    return db_input


@router.get("/recommend", response_model=schemas.CropRecommendResponse)
def recommend_crop(input_id: int, db: Session = Depends(get_db)):
    db_input = db.query(models.UserInput).filter(models.UserInput.id == input_id).first()
    if not db_input:
        raise HTTPException(status_code=404, detail="Input not found")

    # Real weather for the user's location
    weather = fetch_weather(db_input.location)

    # ML crop prediction
    ml_result = predict_crop(
        n=db_input.N, p=db_input.P, k=db_input.K, ph=db_input.pH,
        temp=weather["temperature"], rainfall=weather["rainfall"]
    )

    # Groq-powered geographic validation — correct ML predictions for the actual location
    soil = {"N": db_input.N, "P": db_input.P, "K": db_input.K, "pH": db_input.pH}
    validation = validate_crops_for_location(
        ml_crops=ml_result["top_crops"],
        location=db_input.location,
        soil=soil,
        weather=weather
    )
    if validation.get("corrections_made") and validation.get("validated_crops"):
        # Replace ML crops with geographically validated crops
        validated = validation["validated_crops"][:3]
        # Keep original scores structure, pad if needed
        scores = ml_result["scores"][:len(validated)]
        while len(scores) < len(validated):
            scores.append(round(scores[-1] - 0.05, 2) if scores else 0.75)
        ml_result = {"top_crops": validated, "scores": scores}

    # Maharashtra regional intelligence
    regional_data = get_regional_crops(db_input.location)
    enriched = merge_recommendations(ml_result, regional_data)

    # Attach validation notes if corrections were made
    if validation.get("corrections_made"):
        enriched["location_notes"] = validation.get("location_notes", "")

    return enriched


@router.get("/weather")
def get_current_weather(location: str):
    """Get real-time weather for any location."""
    weather = fetch_weather(location)
    severity = check_severe_weather(weather)
    return {**weather, **severity}


@router.post("/generate-plan")
def generate_plan(input_id: int, top_crops: list[str], db: Session = Depends(get_db)):
    db_input = db.query(models.UserInput).filter(models.UserInput.id == input_id).first()
    if not db_input:
        raise HTTPException(status_code=404, detail="Input not found")

    weather = fetch_weather(db_input.location)
    soil = {"N": db_input.N, "P": db_input.P, "K": db_input.K, "pH": db_input.pH}

    # Get Maharashtra regional context for the top crop
    regional_context = get_regional_context(db_input.location, top_crops[0] if top_crops else "")

    plan_data = generate_farming_plan(
        location_info={"location": db_input.location},
        weather_data=weather,
        soil_data=soil,
        top_crops=top_crops,
        regional_context=regional_context
    )

    # Save plan to DB
    db_plan = models.FarmingPlan(crop=plan_data["crop"], user_input_id=input_id)
    db.add(db_plan)
    db.commit()
    db.refresh(db_plan)

    # Save tasks — phases -> days -> tasks list
    for phase_data in plan_data.get("phases", []):
        phase_name = phase_data.get("phase", "")
        week_range = phase_data.get("week_range", "")
        for day_data in phase_data.get("days", []):
            day_num = day_data.get("day", 0)
            priority = day_data.get("priority", "medium")
            tasks_list = day_data.get("tasks", [])
            task_name = " | ".join(tasks_list)
            db_task = models.Task(
                plan_id=db_plan.id,
                phase=f"{phase_name} ({week_range})" if week_range else phase_name,
                task_name=task_name,
                day_offset=day_num,
                priority=priority
            )
            db.add(db_task)

    # Save alerts
    for a in plan_data.get("alerts", []):
        db_alert = models.Alert(message=a, alert_type="AI_Plan", severity="Normal")
        db.add(db_alert)

    db.commit()
    return plan_data


@router.get("/tasks")
def get_tasks(db: Session = Depends(get_db)):
    return db.query(models.Task).all()


@router.post("/disease-detect", response_model=schemas.DiseaseDetectionResponse)
async def disease_detect(file: UploadFile = File(...)):
    contents = await file.read()
    result = predict_disease(contents)
    return result


@router.get("/alerts")
def get_alerts(db: Session = Depends(get_db)):
    return db.query(models.Alert).order_by(models.Alert.created_at.desc()).all()


@router.post("/register-phone")
def register_phone(phone: str, location: str = "Pune", db: Session = Depends(get_db)):
    """
    Register a phone number to receive SMS weather alerts.
    Sends immediate SMS with current weather for the specified location.
    """
    import os
    from services.sms_service import send_weather_alert_sms
    
    # Add phone to environment variable
    existing = os.getenv("ALERT_PHONE_NUMBERS", "")
    numbers = [n.strip() for n in existing.split(",") if n.strip()]
    if phone not in numbers:
        numbers.append(phone)
        os.environ["ALERT_PHONE_NUMBERS"] = ",".join(numbers)
    
    # Fetch current weather for the location
    weather = fetch_weather(location)
    severity_info = check_severe_weather(weather)
    
    # Create welcome SMS with current weather
    welcome_message = f"""🌾 Welcome to BalirajaSahayak Weather Alerts!

📍 Location: {location}
🌡️ Temperature: {weather['temperature']}°C
🌧️ Rainfall: {weather['rainfall']}mm/hr
💧 Humidity: {weather['humidity']}%
💨 Wind Speed: {weather['wind_speed']}km/h
☁️ Condition: {weather['condition']}

"""
    
    # Add severity warning if applicable
    if severity_info['is_severe']:
        welcome_message += f"""⚠️ ALERT: {severity_info['anomaly']}
Severity: {severity_info['severity']}

"""
    else:
        welcome_message += "✅ Weather conditions are normal.\n\n"
    
    welcome_message += f"""You will receive automatic alerts for:
• Thunderstorms
• Heavy rainfall (>10mm/hr)
• Extreme heat (>42°C)
• Strong winds (>50km/h)
• High humidity (>90%)

Stay safe and farm smart! 🌾"""
    
    # Send welcome SMS
    sms_result = send_weather_alert_sms(welcome_message, location=location)
    
    return {
        "message": f"Phone {phone} registered for weather alerts.",
        "total_registered": len(numbers),
        "sms_sent": sms_result["sent"] > 0,
        "current_weather": {
            "location": location,
            "temperature": weather['temperature'],
            "rainfall": weather['rainfall'],
            "humidity": weather['humidity'],
            "wind_speed": weather['wind_speed'],
            "condition": weather['condition'],
            "is_severe": severity_info['is_severe'],
            "severity": severity_info['severity'],
            "anomaly": severity_info['anomaly']
        }
    }


@router.post("/register-email")
def register_email(email: str, location: str = "Pune", db: Session = Depends(get_db)):
    """
    Register an email address to receive weather alerts.
    Sends immediate welcome email with current weather for the specified location.
    Works in India without any restrictions! 🎉
    """
    import os
    from services.email_service import send_welcome_email
    
    # Validate email format
    import re
    email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.match(email_pattern, email):
        raise HTTPException(status_code=400, detail="Invalid email format")
    
    # Add email to environment variable
    existing = os.getenv("ALERT_EMAILS", "")
    emails = [e.strip() for e in existing.split(",") if e.strip()]
    if email not in emails:
        emails.append(email)
        os.environ["ALERT_EMAILS"] = ",".join(emails)
    
    # Fetch current weather for the location
    weather = fetch_weather(location)
    severity_info = check_severe_weather(weather)
    
    # Send welcome email
    email_result = send_welcome_email(email, location, weather, severity_info)
    
    if not email_result.get("success"):
        raise HTTPException(
            status_code=500, 
            detail=f"Failed to send email: {email_result.get('error', 'Unknown error')}"
        )
    
    return {
        "message": f"Email {email} registered for weather alerts.",
        "total_registered": len(emails),
        "email_sent": email_result["success"],
        "current_weather": {
            "location": location,
            "temperature": weather['temperature'],
            "rainfall": weather['rainfall'],
            "humidity": weather['humidity'],
            "wind_speed": weather['wind_speed'],
            "condition": weather['condition'],
            "is_severe": severity_info['is_severe'],
            "severity": severity_info['severity'],
            "anomaly": severity_info['anomaly']
        }
    }


@router.post("/chat")
def chat(request: schemas.ChatRequest):
    """Farming assistant chatbot powered by Gemini with language detection and action plans."""
    from services.gemini_service import chat_with_assistant_multilingual
    
    result = chat_with_assistant_multilingual(
        message=request.message,
        history=request.history,
        context=request.context
    )
    return result


@router.post("/fertilizer-recommend")
def fertilizer_recommend(request: schemas.FertilizerRequest, db: Session = Depends(get_db)):
    """Get detailed fertilizer recommendations based on soil NPK and pH values."""
    from services.ml_service import recommend_fertilizer
    
    result = recommend_fertilizer(
        n=request.n,
        p=request.p,
        k=request.k,
        ph=request.ph,
        crop=request.crop
    )
    
    # Save to database for tracking
    db_input = models.UserInput(
        N=request.n,
        P=request.p,
        K=request.k,
        pH=request.ph,
        location=request.location or "Unknown"
    )
    db.add(db_input)
    db.commit()
    
    return result


@router.get("/news")
def get_agriculture_news(category: str = None, limit: int = 12):
    """
    Get latest agriculture and farming news.
    
    Query Parameters:
    - category: Filter by category (Government Schemes, AgriTech, Sustainable Farming, etc.)
    - limit: Number of articles to return (default: 12)
    """
    from services.news_service import fetch_agriculture_news, get_news_by_category
    
    if category:
        news = get_news_by_category(category)
    else:
        news = fetch_agriculture_news(page_size=limit)
    
    return {"news": news, "total": len(news)}


@router.get("/news/trending")
def get_trending_news(limit: int = 6):
    """Get top trending agriculture news."""
    from services.news_service import get_trending_news
    
    news = get_trending_news(limit=limit)
    return {"news": news, "total": len(news)}
