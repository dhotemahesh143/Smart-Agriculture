# 🌾 BalirajaSahayak - Complete Project Technical Documentation

## 📖 Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Crop Recommendation System](#crop-recommendation-system)
4. [Fertilizer Recommendation System](#fertilizer-recommendation-system)
5. [Disease Detection System](#disease-detection-system)
6. [Weather Alert System](#weather-alert-system)
7. [Voice Assistant System](#voice-assistant-system)
8. [AI Chatbot System](#ai-chatbot-system)
9. [News Feed System](#news-feed-system)
10. [Database Architecture](#database-architecture)
11. [API Endpoints](#api-endpoints)
12. [Frontend Architecture](#frontend-architecture)
13. [Deployment Guide](#deployment-guide)

---

## 1. Project Overview

### 🎯 Purpose
BalirajaSahayak (कृषी सहायक) is an intelligent, full-stack AI-powered farming assistant platform designed specifically for Indian farmers. It combines Machine Learning, Generative AI, real-time weather monitoring, multilingual voice assistance, and automated alert systems to help farmers make data-driven decisions and maximize crop yields.

### 🏆 Key Features
- **AI-Powered Crop Recommendations** using Random Forest ML + Geographic Validation
- **Fertilizer Recommendations** using Artificial Neural Networks (ANN)
- **Plant Disease Detection** using Convolutional Neural Networks (CNN)
- **Real-Time Weather Monitoring** with automatic severe weather alerts
- **Email & SMS Alert System** for weather notifications
- **Multilingual Voice Assistant** (English, Hindi, Marathi)
- **AI Chatbot** powered by Google Gemini for farming queries
- **Farming News Feed** with curated agricultural news
- **Regional Intelligence** for Maharashtra's 22 districts

### 🛠️ Technology Stack

**Backend:**
- Python 3.11
- FastAPI (REST API framework)
- TensorFlow/Keras (Deep Learning)
- Scikit-learn (Machine Learning)
- SQLAlchemy (ORM)
- SQLite (Database)
- APScheduler (Background tasks)

**Frontend:**
- React 19.2
- Vite 8.0 (Build tool)
- Material-UI (Components)
- Lucide React (Icons)
- Web Speech API (Voice recognition)

**AI/ML Services:**
- Google Gemini 1.5 Flash (Chatbot & validation)
- Groq LLaMA 3.3 70B (Farming plans)
- TensorFlow CNN (Disease detection)
- TensorFlow ANN (Fertilizer recommendations)
- Random Forest (Crop predictions)

**External APIs:**
- OpenWeatherMap (Weather data)
- NewsAPI (Farming news)
- Twilio (SMS alerts)
- Gmail SMTP (Email alerts)

---

## 2. System Architecture

### 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        USER INTERFACE                        │
│                     (React Frontend)                         │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │  Input   │ │  Crop    │ │ Disease  │ │ Weather  │      │
│  │  Page    │ │  Recom.  │ │ Detection│ │  Alerts  │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │  Voice   │ │ Chatbot  │ │  News    │ │Fertilizer│      │
│  │Assistant │ │          │ │  Feed    │ │          │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                      BACKEND SERVER                          │
│                     (FastAPI Python)                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              API Routes Layer                         │  │
│  │  /input  /recommend  /disease  /weather  /alerts     │  │
│  │  /chat   /fertilizer  /news    /register-email       │  │
│  └──────────────────────────────────────────────────────┘  │
│                            ↕                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Business Logic Layer                     │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐       │  │
│  │  │ ML Service │ │  Weather   │ │   Gemini   │       │  │
│  │  │            │ │  Service   │ │  Service   │       │  │
│  │  └────────────┘ └────────────┘ └────────────┘       │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐       │  │
│  │  │    SMS     │ │   Email    │ │    News    │       │  │
│  │  │  Service   │ │  Service   │ │  Service   │       │  │
│  │  └────────────┘ └────────────┘ └────────────┘       │  │
│  └──────────────────────────────────────────────────────┘  │
│                            ↕                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Data Access Layer                        │  │
│  │  ┌────────────┐ ┌────────────┐ ┌────────────┐       │  │
│  │  │  Database  │ │ ML Models  │ │ Scheduler  │       │  │
│  │  │  (SQLite)  │ │ (TF/Keras) │ │(APScheduler)│      │  │
│  │  └────────────┘ └────────────┘ └────────────┘       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                          │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐             │
│  │   Google   │ │   Twilio   │ │OpenWeather │             │
│  │   Gemini   │ │    SMS     │ │    API     │             │
│  └────────────┘ └────────────┘ └────────────┘             │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐             │
│  │    Groq    │ │   Gmail    │ │  NewsAPI   │             │
│  │   LLaMA    │ │    SMTP    │ │            │             │
│  └────────────┘ └────────────┘ └────────────┘             │
└─────────────────────────────────────────────────────────────┘
```

### 📂 Project Structure

```
Smart-Agriculture-main/
├── backend/
│   ├── main.py                    # FastAPI application entry point
│   ├── requirements.txt           # Python dependencies
│   ├── .env                       # Environment variables
│   ├── farming_assistant.db       # SQLite database
│   │
│   ├── database/
│   │   ├── base.py               # Database connection & session
│   │   └── models.py             # SQLAlchemy ORM models
│   │
│   ├── models/
│   │   ├── schemas.py            # Pydantic request/response models
│   │   ├── best_cnn_phase1.h5   # Disease detection CNN model
│   │   └── ann_fertilizer_model.h5 # Fertilizer ANN model
│   │
│   ├── routes/
│   │   └── api.py                # API endpoint definitions
│   │
│   ├── services/
│   │   ├── ml_service.py         # ML predictions (crop, disease, fertilizer)
│   │   ├── weather_service.py    # Weather API integration
│   │   ├── gemini_service.py     # Google Gemini AI integration
│   │   ├── sms_service.py        # Twilio SMS integration
│   │   ├── email_service.py      # Gmail SMTP integration
│   │   ├── news_service.py       # NewsAPI integration
│   │   └── maharashtra_crop_service.py # Regional crop intelligence
│   │
│   └── scheduler/
│       └── jobs.py               # Background tasks (weather monitoring)
│
├── frontend/
│   ├── package.json              # Node.js dependencies
│   ├── vite.config.js            # Vite configuration
│   ├── index.html                # HTML entry point
│   │
│   └── src/
│       ├── main.jsx              # React entry point
│       ├── App.jsx               # Main app component with routing
│       ├── App.css               # Global styles
│       │
│       ├── components/
│       │   ├── ChatBot.jsx       # AI chatbot component
│       │   ├── VoiceAssistant.jsx # Voice recognition component
│       │   ├── Toast.jsx         # Notification component
│       │   └── LoadingSkeleton.jsx # Loading placeholder
│       │
│       ├── pages/
│       │   ├── HomePage.jsx      # News feed page
│       │   ├── InputPage.jsx     # Soil data input page
│       │   ├── RecommendationPage.jsx # Crop recommendations
│       │   ├── Dashboard.jsx     # Farming plan dashboard
│       │   ├── DiseaseDetection.jsx # Disease detection page
│       │   ├── AlertsPage.jsx    # Weather alerts page
│       │   ├── VoiceAssistantPage.jsx # Voice conversation history
│       │   └── FertilizerPage.jsx # Fertilizer recommendations
│       │
│       ├── i18n/
│       │   ├── LanguageContext.jsx # Language context provider
│       │   └── translations.js   # Multilingual translations
│       │
│       └── theme/
│           └── modernTheme.js    # Material-UI theme
│
├── model/
│   ├── PEC_Project.ipynb         # Jupyter notebook for model training
│   ├── best_cnn_phase1.h5        # Trained CNN model
│   └── ann_fertilizer_model.h5   # Trained ANN model
│
└── Documentation/
    ├── README.md                  # Project overview
    ├── START_HERE.md              # Quick start guide
    ├── EMAIL_SETUP_GUIDE.md       # Email configuration
    ├── VOICE_ISSUE_EXPLAINED.md   # Voice troubleshooting
    └── [Other documentation files]
```

---


## 3. Crop Recommendation System

### 🌾 How It Works

The crop recommendation system uses a **multi-stage AI pipeline** combining Machine Learning and Generative AI to provide accurate, location-specific crop suggestions.

#### Stage 1: Data Collection
```
User Input:
├── Soil Parameters
│   ├── Nitrogen (N) content (kg/ha)
│   ├── Phosphorus (P) content (kg/ha)
│   ├── Potassium (K) content (kg/ha)
│   └── pH level (0-14)
└── Location (City/District name)
```

#### Stage 2: Real-Time Weather Fetching
```python
# services/weather_service.py
def fetch_weather(location):
    """Fetches real-time weather from OpenWeatherMap API"""
    api_key = os.getenv("OPENWEATHER_API_KEY")
    url = f"http://api.openweathermap.org/data/2.5/weather?q={location}&appid={api_key}"
    
    response = requests.get(url)
    data = response.json()
    
    return {
        "temperature": data["main"]["temp"] - 273.15,  # Convert Kelvin to Celsius
        "rainfall": data.get("rain", {}).get("1h", 0),  # mm/hr
        "humidity": data["main"]["humidity"],  # %
        "wind_speed": data["wind"]["speed"] * 3.6,  # m/s to km/h
        "condition": data["weather"][0]["description"]
    }
```

**Why Real-Time Weather?**
- Crops depend heavily on current climate conditions
- Temperature affects germination and growth rates
- Rainfall determines irrigation needs
- Humidity impacts disease susceptibility

#### Stage 3: ML-Based Crop Prediction
```python
# services/ml_service.py
def predict_crop(n, p, k, ph, temp, rainfall):
    """Uses Random Forest model to predict top 3 crops"""
    
    # Prepare input features
    features = np.array([[n, p, k, ph, temp, rainfall]])
    
    # Get predictions from Random Forest model
    probabilities = crop_model.predict_proba(features)[0]
    
    # Get top 3 crops with highest probability
    top_3_indices = np.argsort(probabilities)[-3:][::-1]
    top_3_crops = [crop_labels[i] for i in top_3_indices]
    top_3_scores = [round(probabilities[i] * 100, 2) for i in top_3_indices]
    
    return {
        "top_crops": top_3_crops,
        "scores": top_3_scores
    }
```

**Random Forest Model:**
- Trained on 2,200+ crop samples
- Features: N, P, K, pH, Temperature, Rainfall
- 22 crop classes (Rice, Wheat, Cotton, etc.)
- Accuracy: ~95%

#### Stage 4: Geographic Validation (AI-Powered)
```python
# services/gemini_service.py
def validate_crops_for_location(ml_crops, location, soil, weather):
    """Uses Groq LLaMA 3.3 70B to validate crops for actual location"""
    
    prompt = f"""
    You are an agricultural expert. A machine learning model predicted these crops:
    {ml_crops}
    
    Location: {location}
    Soil: N={soil['N']}, P={soil['P']}, K={soil['K']}, pH={soil['pH']}
    Weather: Temp={weather['temperature']}°C, Rainfall={weather['rainfall']}mm
    
    Task: Validate if these crops are suitable for {location}.
    If not, suggest 3 crops that actually grow well in {location}.
    
    Consider:
    1. Geographic suitability (climate zone, altitude)
    2. Traditional crops of the region
    3. Soil compatibility
    4. Water availability
    
    Return JSON: {{"validated_crops": [...], "corrections_made": true/false}}
    """
    
    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}]
    )
    
    return json.loads(response.choices[0].message.content)
```

**Why Geographic Validation?**
- ML models don't know geography (Kashmir vs Kerala)
- Prevents suggesting tropical crops for cold regions
- Ensures practical, implementable recommendations
- Considers local farming traditions

**Example:**
```
Input: Location = "Kashmir", ML suggests = ["Rice", "Cotton", "Banana"]
Problem: Cotton and Banana don't grow in Kashmir (cold climate)
AI Correction: ["Apple", "Saffron", "Walnut"] ✅
```

#### Stage 5: Regional Intelligence Layer
```python
# services/maharashtra_crop_service.py
def get_regional_crops(location):
    """Returns region-specific crop knowledge for Maharashtra"""
    
    # Built-in knowledge base for 22 Maharashtra districts
    regional_data = {
        "Pune": {
            "famous_crops": ["Grapes", "Pomegranate", "Sugarcane"],
            "gi_tagged": ["Poona Fig"],
            "seasonal": {
                "Kharif": ["Bajra", "Jowar", "Groundnut"],
                "Rabi": ["Wheat", "Gram"],
                "Summer": ["Vegetables", "Watermelon"]
            }
        },
        "Ratnagiri": {
            "famous_crops": ["Alphonso Mango", "Cashew", "Coconut"],
            "gi_tagged": ["Alphonso Mango"],
            "coastal": True
        },
        # ... 20 more districts
    }
    
    return regional_data.get(location, {})
```

**Regional Intelligence Features:**
- GI-tagged crops (Alphonso Mango, Nagpuri Orange, etc.)
- Seasonal recommendations (Kharif, Rabi, Summer)
- Local varieties and traditional crops
- District-specific badges in UI

#### Stage 6: Final Recommendation Merging
```python
def merge_recommendations(ml_result, regional_data):
    """Combines ML predictions with regional intelligence"""
    
    final_recommendations = {
        "top_crops": ml_result["top_crops"],
        "confidence_scores": ml_result["scores"],
        "regional_crops": regional_data.get("famous_crops", []),
        "gi_tagged": regional_data.get("gi_tagged", []),
        "seasonal_recommendations": regional_data.get("seasonal", {}),
        "badges": []
    }
    
    # Add badges for special crops
    for crop in final_recommendations["top_crops"]:
        if crop in regional_data.get("gi_tagged", []):
            final_recommendations["badges"].append({
                "crop": crop,
                "badge": "GI Tagged",
                "color": "gold"
            })
    
    return final_recommendations
```

### 📊 Complete Flow Diagram

```
User Input (N, P, K, pH, Location)
         ↓
Fetch Real-Time Weather (OpenWeatherMap)
         ↓
ML Prediction (Random Forest)
         ↓
Geographic Validation (Groq LLaMA 3.3)
         ↓
Regional Intelligence (Maharashtra DB)
         ↓
Merge & Display Top 3 Crops
         ↓
Generate Farming Plan (Gemini AI)
```

### 🎯 Example Workflow

**Input:**
```json
{
  "N": 90,
  "P": 42,
  "K": 43,
  "pH": 6.5,
  "location": "Nashik"
}
```

**Step 1 - Weather Fetch:**
```json
{
  "temperature": 28,
  "rainfall": 5,
  "humidity": 65,
  "wind_speed": 12
}
```

**Step 2 - ML Prediction:**
```json
{
  "top_crops": ["Grapes", "Pomegranate", "Cotton"],
  "scores": [92.5, 87.3, 78.1]
}
```

**Step 3 - Geographic Validation:**
```json
{
  "validated_crops": ["Grapes", "Pomegranate", "Onion"],
  "corrections_made": true,
  "reason": "Cotton replaced with Onion (Nashik is famous for onions)"
}
```

**Step 4 - Regional Intelligence:**
```json
{
  "famous_crops": ["Grapes", "Onion", "Tomato"],
  "gi_tagged": ["Nashik Onion"],
  "seasonal": {
    "Kharif": ["Onion", "Tomato"],
    "Rabi": ["Wheat", "Gram"]
  }
}
```

**Final Output:**
```json
{
  "top_crops": ["Grapes", "Pomegranate", "Onion"],
  "confidence_scores": [92.5, 87.3, 85.0],
  "regional_match": true,
  "badges": [
    {"crop": "Onion", "badge": "GI Tagged", "color": "gold"}
  ],
  "location_notes": "Nashik is ideal for grapes and onions"
}
```

---


## 4. Fertilizer Recommendation System

### 🧪 How It Works

The fertilizer recommendation system uses an **Artificial Neural Network (ANN)** trained on soil chemistry data to suggest optimal fertilizers.

#### Architecture

```
Input Layer (4 neurons)
    ↓
Hidden Layer 1 (64 neurons, ReLU)
    ↓
Dropout (0.3)
    ↓
Hidden Layer 2 (32 neurons, ReLU)
    ↓
Dropout (0.3)
    ↓
Output Layer (7 neurons, Softmax)
    ↓
Fertilizer Class
```

#### Model Details

```python
# Model Training (from PEC_Project.ipynb)
model = Sequential([
    Dense(64, activation='relu', input_shape=(4,)),
    Dropout(0.3),
    Dense(32, activation='relu'),
    Dropout(0.3),
    Dense(7, activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Training data: 1,000+ samples
# Features: N, P, K, pH
# Classes: 7 fertilizer types
# Accuracy: ~93%
```

#### Fertilizer Classes

```python
FERTILIZER_CLASSES = [
    "Urea",           # High Nitrogen
    "DAP",            # High Phosphorus
    "MOP",            # High Potassium
    "NPK 10-26-26",   # Balanced
    "NPK 20-20-20",   # Balanced
    "Organic Compost", # Organic
    "Vermicompost"    # Organic
]
```

#### Prediction Process

```python
# services/ml_service.py
def recommend_fertilizer(n, p, k, ph, crop):
    """Recommends fertilizer based on soil NPK and pH"""
    
    # Step 1: Normalize input
    features = np.array([[n, p, k, ph]])
    features_normalized = scaler.transform(features)
    
    # Step 2: Get ANN prediction
    prediction = fertilizer_model.predict(features_normalized)
    fertilizer_class = np.argmax(prediction[0])
    confidence = prediction[0][fertilizer_class] * 100
    
    # Step 3: Get fertilizer details
    fertilizer_name = FERTILIZER_CLASSES[fertilizer_class]
    
    # Step 4: Calculate deficiencies
    deficiencies = analyze_deficiencies(n, p, k, ph, crop)
    
    # Step 5: Generate recommendations
    recommendations = generate_fertilizer_plan(
        fertilizer_name, 
        deficiencies, 
        crop
    )
    
    return {
        "fertilizer": fertilizer_name,
        "confidence": round(confidence, 2),
        "deficiencies": deficiencies,
        "application_rate": recommendations["rate"],
        "application_method": recommendations["method"],
        "timing": recommendations["timing"],
        "precautions": recommendations["precautions"]
    }
```

#### Deficiency Analysis

```python
def analyze_deficiencies(n, p, k, ph, crop):
    """Analyzes nutrient deficiencies based on crop requirements"""
    
    # Optimal ranges for different crops
    optimal_ranges = {
        "Rice": {"N": (80, 120), "P": (40, 60), "K": (40, 60), "pH": (5.5, 7.0)},
        "Wheat": {"N": (100, 150), "P": (50, 70), "K": (50, 70), "pH": (6.0, 7.5)},
        "Cotton": {"N": (120, 180), "P": (60, 80), "K": (60, 80), "pH": (6.0, 7.5)},
        # ... more crops
    }
    
    crop_requirements = optimal_ranges.get(crop, {})
    deficiencies = []
    
    # Check Nitrogen
    if n < crop_requirements["N"][0]:
        deficiencies.append({
            "nutrient": "Nitrogen",
            "status": "Low",
            "current": n,
            "optimal": crop_requirements["N"],
            "symptoms": "Yellowing of older leaves, stunted growth",
            "solution": "Apply Urea or Ammonium Sulfate"
        })
    
    # Check Phosphorus
    if p < crop_requirements["P"][0]:
        deficiencies.append({
            "nutrient": "Phosphorus",
            "status": "Low",
            "current": p,
            "optimal": crop_requirements["P"],
            "symptoms": "Purple/dark green leaves, poor root development",
            "solution": "Apply DAP or Single Super Phosphate"
        })
    
    # Check Potassium
    if k < crop_requirements["K"][0]:
        deficiencies.append({
            "nutrient": "Potassium",
            "status": "Low",
            "current": k,
            "optimal": crop_requirements["K"],
            "symptoms": "Brown leaf edges, weak stems",
            "solution": "Apply MOP or Potassium Sulfate"
        })
    
    # Check pH
    if ph < crop_requirements["pH"][0]:
        deficiencies.append({
            "nutrient": "pH",
            "status": "Too Acidic",
            "current": ph,
            "optimal": crop_requirements["pH"],
            "symptoms": "Nutrient lockout, poor growth",
            "solution": "Apply Lime to increase pH"
        })
    elif ph > crop_requirements["pH"][1]:
        deficiencies.append({
            "nutrient": "pH",
            "status": "Too Alkaline",
            "current": ph,
            "optimal": crop_requirements["pH"],
            "symptoms": "Iron deficiency, yellowing",
            "solution": "Apply Sulfur to decrease pH"
        })
    
    return deficiencies
```

#### Application Recommendations

```python
def generate_fertilizer_plan(fertilizer_name, deficiencies, crop):
    """Generates detailed fertilizer application plan"""
    
    # Fertilizer database
    fertilizer_db = {
        "Urea": {
            "composition": "46% N",
            "rate": "100-150 kg/ha",
            "method": "Split application: 50% at sowing, 25% at tillering, 25% at flowering",
            "timing": "Apply during active growth stages",
            "precautions": [
                "Don't apply on dry soil",
                "Water immediately after application",
                "Avoid over-application (causes lodging)"
            ],
            "cost": "₹6-8 per kg"
        },
        "DAP": {
            "composition": "18% N, 46% P",
            "rate": "100-125 kg/ha",
            "method": "Basal application at sowing time",
            "timing": "Apply 1-2 weeks before sowing",
            "precautions": [
                "Mix with soil thoroughly",
                "Don't place in direct contact with seeds",
                "Store in dry place"
            ],
            "cost": "₹27-30 per kg"
        },
        # ... more fertilizers
    }
    
    fertilizer_info = fertilizer_db.get(fertilizer_name, {})
    
    return {
        "fertilizer": fertilizer_name,
        "composition": fertilizer_info["composition"],
        "rate": fertilizer_info["rate"],
        "method": fertilizer_info["method"],
        "timing": fertilizer_info["timing"],
        "precautions": fertilizer_info["precautions"],
        "estimated_cost": fertilizer_info["cost"],
        "deficiencies_addressed": [d["nutrient"] for d in deficiencies]
    }
```

### 📊 Example Workflow

**Input:**
```json
{
  "N": 45,
  "P": 25,
  "K": 30,
  "pH": 5.8,
  "crop": "Rice"
}
```

**Step 1 - ANN Prediction:**
```json
{
  "fertilizer": "Urea",
  "confidence": 89.5
}
```

**Step 2 - Deficiency Analysis:**
```json
{
  "deficiencies": [
    {
      "nutrient": "Nitrogen",
      "status": "Low",
      "current": 45,
      "optimal": [80, 120],
      "symptoms": "Yellowing of older leaves",
      "solution": "Apply Urea"
    },
    {
      "nutrient": "Phosphorus",
      "status": "Low",
      "current": 25,
      "optimal": [40, 60],
      "symptoms": "Purple leaves, poor roots",
      "solution": "Apply DAP"
    }
  ]
}
```

**Final Output:**
```json
{
  "primary_fertilizer": "Urea",
  "confidence": 89.5,
  "composition": "46% N",
  "application_rate": "100-150 kg/ha",
  "application_method": "Split: 50% sowing, 25% tillering, 25% flowering",
  "timing": "Apply during active growth",
  "secondary_fertilizer": "DAP (for Phosphorus deficiency)",
  "estimated_cost": "₹6-8 per kg (Urea) + ₹27-30 per kg (DAP)",
  "precautions": [
    "Water immediately after application",
    "Avoid over-application",
    "Mix DAP with soil thoroughly"
  ]
}
```

---


## 5. Disease Detection System

### 🔬 How It Works

The disease detection system uses a **Convolutional Neural Network (CNN)** trained on plant leaf images to identify diseases.

#### CNN Architecture

```
Input: 224x224x3 RGB Image
    ↓
Conv2D (32 filters, 3x3) + ReLU
    ↓
MaxPooling2D (2x2)
    ↓
Conv2D (64 filters, 3x3) + ReLU
    ↓
MaxPooling2D (2x2)
    ↓
Conv2D (128 filters, 3x3) + ReLU
    ↓
MaxPooling2D (2x2)
    ↓
Flatten
    ↓
Dense (256 neurons) + ReLU
    ↓
Dropout (0.5)
    ↓
Dense (38 neurons) + Softmax
    ↓
Disease Class
```

#### Model Training

```python
# From PEC_Project.ipynb
model = Sequential([
    Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
    MaxPooling2D(2, 2),
    
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D(2, 2),
    
    Conv2D(128, (3, 3), activation='relu'),
    MaxPooling2D(2, 2),
    
    Flatten(),
    Dense(256, activation='relu'),
    Dropout(0.5),
    Dense(38, activation='softmax')
])

model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Training data: 87,000+ images
# 38 disease classes across 14 plant species
# Accuracy: ~96%
```

#### Disease Classes (38 total)

```python
DISEASE_CLASSES = [
    # Apple
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
    
    # Tomato
    "Tomato___Bacterial_spot",
    "Tomato___Early_blight",
    "Tomato___Late_blight",
    "Tomato___Leaf_Mold",
    "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites",
    "Tomato___Target_Spot",
    "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus",
    "Tomato___healthy",
    
    # Potato
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
    
    # ... 21 more classes for other crops
]
```

#### Prediction Process

```python
# services/ml_service.py
def predict_disease(image_bytes):
    """Predicts plant disease from leaf image"""
    
    # Step 1: Load and preprocess image
    image = Image.open(io.BytesIO(image_bytes))
    image = image.resize((224, 224))
    image_array = np.array(image) / 255.0  # Normalize to [0, 1]
    image_array = np.expand_dims(image_array, axis=0)  # Add batch dimension
    
    # Step 2: Get CNN prediction
    predictions = disease_model.predict(image_array)
    disease_index = np.argmax(predictions[0])
    confidence = predictions[0][disease_index] * 100
    
    # Step 3: Parse disease name
    disease_full_name = DISEASE_CLASSES[disease_index]
    plant, disease = disease_full_name.split("___")
    
    # Step 4: Get disease information
    disease_info = get_disease_info(plant, disease)
    
    # Step 5: Get treatment recommendations
    treatment = get_treatment_plan(plant, disease)
    
    return {
        "plant": plant.replace("_", " "),
        "disease": disease.replace("_", " "),
        "confidence": round(confidence, 2),
        "severity": disease_info["severity"],
        "description": disease_info["description"],
        "symptoms": disease_info["symptoms"],
        "causes": disease_info["causes"],
        "treatment": treatment,
        "prevention": disease_info["prevention"]
    }
```

#### Disease Information Database

```python
def get_disease_info(plant, disease):
    """Returns detailed information about the disease"""
    
    disease_database = {
        "Tomato___Early_blight": {
            "severity": "Medium",
            "description": "Fungal disease caused by Alternaria solani",
            "symptoms": [
                "Dark brown spots with concentric rings on older leaves",
                "Yellowing around the spots",
                "Leaf drop in severe cases",
                "Stem lesions near soil line"
            ],
            "causes": [
                "High humidity (>90%)",
                "Warm temperatures (24-29°C)",
                "Poor air circulation",
                "Overhead irrigation",
                "Infected plant debris"
            ],
            "prevention": [
                "Crop rotation (3-4 years)",
                "Remove infected plant debris",
                "Avoid overhead watering",
                "Improve air circulation",
                "Use disease-resistant varieties"
            ]
        },
        "Tomato___Late_blight": {
            "severity": "High",
            "description": "Devastating fungal disease caused by Phytophthora infestans",
            "symptoms": [
                "Water-soaked spots on leaves",
                "White fuzzy growth on leaf undersides",
                "Brown lesions on stems",
                "Fruit rot with brown patches",
                "Rapid plant death"
            ],
            "causes": [
                "Cool, wet weather (10-25°C)",
                "High humidity (>90%)",
                "Rain or heavy dew",
                "Infected seed potatoes",
                "Wind-borne spores"
            ],
            "prevention": [
                "Plant resistant varieties",
                "Avoid overhead irrigation",
                "Ensure good drainage",
                "Remove volunteer plants",
                "Apply preventive fungicides"
            ]
        },
        # ... 36 more diseases
    }
    
    key = f"{plant}___{disease}"
    return disease_database.get(key, {})
```

#### Treatment Recommendations

```python
def get_treatment_plan(plant, disease):
    """Generates treatment plan for the disease"""
    
    treatment_database = {
        "Tomato___Early_blight": {
            "immediate_actions": [
                "Remove and destroy infected leaves",
                "Stop overhead watering",
                "Improve air circulation"
            ],
            "organic_treatment": [
                "Neem oil spray (5ml/L water)",
                "Copper-based fungicide",
                "Baking soda solution (1 tbsp/L water)",
                "Compost tea spray"
            ],
            "chemical_treatment": [
                "Mancozeb 75% WP (2g/L water)",
                "Chlorothalonil (2ml/L water)",
                "Azoxystrobin (1ml/L water)"
            ],
            "application_schedule": "Spray every 7-10 days, 3-4 times",
            "precautions": [
                "Wear protective gear",
                "Don't spray during flowering",
                "Follow label instructions",
                "Maintain 7-day harvest interval"
            ],
            "cost_estimate": "₹200-500 per acre"
        },
        # ... more treatments
    }
    
    key = f"{plant}___{disease}"
    return treatment_database.get(key, {})
```

### 📊 Complete Detection Flow

```
User uploads leaf image
         ↓
Image preprocessing (resize to 224x224, normalize)
         ↓
CNN prediction (38 disease classes)
         ↓
Get disease information from database
         ↓
Generate treatment plan
         ↓
Display results with confidence score
```

### 🎯 Example Workflow

**Input:**
- User uploads image of tomato leaf with brown spots

**Step 1 - Image Preprocessing:**
```python
Original: 1920x1080 pixels
Resized: 224x224 pixels
Normalized: [0, 1] range
Batch: (1, 224, 224, 3)
```

**Step 2 - CNN Prediction:**
```json
{
  "predictions": [
    {"class": "Tomato___Early_blight", "probability": 0.945},
    {"class": "Tomato___Late_blight", "probability": 0.032},
    {"class": "Tomato___Septoria_leaf_spot", "probability": 0.015}
  ],
  "top_prediction": "Tomato___Early_blight",
  "confidence": 94.5
}
```

**Step 3 - Disease Information:**
```json
{
  "plant": "Tomato",
  "disease": "Early blight",
  "confidence": 94.5,
  "severity": "Medium",
  "description": "Fungal disease caused by Alternaria solani",
  "symptoms": [
    "Dark brown spots with concentric rings",
    "Yellowing around spots",
    "Leaf drop in severe cases"
  ],
  "causes": [
    "High humidity (>90%)",
    "Warm temperatures (24-29°C)",
    "Poor air circulation"
  ]
}
```

**Step 4 - Treatment Plan:**
```json
{
  "immediate_actions": [
    "Remove infected leaves",
    "Stop overhead watering",
    "Improve air circulation"
  ],
  "organic_treatment": [
    "Neem oil spray (5ml/L)",
    "Copper fungicide",
    "Baking soda solution"
  ],
  "chemical_treatment": [
    "Mancozeb 75% WP (2g/L)",
    "Chlorothalonil (2ml/L)"
  ],
  "application_schedule": "Every 7-10 days, 3-4 times",
  "cost_estimate": "₹200-500 per acre"
}
```

**Final Output (UI):**
```
🔬 Disease Detected: Early Blight
🌿 Plant: Tomato
📊 Confidence: 94.5%
⚠️ Severity: Medium

📝 Description:
Fungal disease caused by Alternaria solani affecting tomato plants.

🔍 Symptoms:
• Dark brown spots with concentric rings on older leaves
• Yellowing around the spots
• Leaf drop in severe cases

💊 Treatment:
Immediate Actions:
1. Remove and destroy infected leaves
2. Stop overhead watering
3. Improve air circulation

Organic Treatment:
• Neem oil spray (5ml/L water)
• Copper-based fungicide
• Baking soda solution (1 tbsp/L water)

Chemical Treatment:
• Mancozeb 75% WP (2g/L water)
• Chlorothalonil (2ml/L water)

Application: Spray every 7-10 days, 3-4 times
Cost: ₹200-500 per acre

🛡️ Prevention:
• Crop rotation (3-4 years)
• Remove infected plant debris
• Avoid overhead watering
• Use disease-resistant varieties
```

---

