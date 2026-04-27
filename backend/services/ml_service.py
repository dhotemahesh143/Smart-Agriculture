import os
import pickle
import numpy as np
from pathlib import Path

# ── Paths ────────────────────────────────────────────────────────────────────
MODELS_DIR = Path(__file__).resolve().parent.parent / "models"

# ── Load Crop Recommendation Model (Random Forest + LabelEncoder) ─────────────
try:
    with open(MODELS_DIR / "crop_rf_model.pkl", "rb") as f:
        crop_model = pickle.load(f)
    with open(MODELS_DIR / "Label_rf_model.pkl", "rb") as f:
        crop_label_encoder = pickle.load(f)
    CROP_MODEL_LOADED = True
    print("✅ Crop RF model loaded")
except Exception as e:
    CROP_MODEL_LOADED = False
    print(f"⚠️  Crop model not loaded: {e}")

# ── Load Disease Detection Model (CNN / Keras) ────────────────────────────────
try:
    from tensorflow.keras.models import load_model
    from tensorflow.keras.preprocessing import image as keras_image
    import io
    from PIL import Image

    disease_model = load_model(MODELS_DIR / "best_cnn_phase1.h5")
    DISEASE_MODEL_LOADED = True
    print("✅ Disease CNN model loaded")
except Exception as e:
    DISEASE_MODEL_LOADED = False
    print(f"⚠️  Disease model not loaded: {e}")

# ── Load Fertilizer Recommendation Model (ANN / Keras) ───────────────────────
try:
    from tensorflow.keras.models import load_model as load_keras_model
    fertilizer_model = load_keras_model(MODELS_DIR / "ann_fertilizer_model.h5")
    FERTILIZER_MODEL_LOADED = True
    print("✅ Fertilizer ANN model loaded")
except Exception as e:
    FERTILIZER_MODEL_LOADED = False
    print(f"⚠️  Fertilizer model not loaded: {e}")


# ── Crop Recommendation ───────────────────────────────────────────────────────
def predict_crop(n: float, p: float, k: float, ph: float, temp: float, rainfall: float):
    """
    Predict top 3 recommended crops using the trained Random Forest model.
    Input order matches training: [N, P, K, temperature, humidity, ph, rainfall]
    (humidity is not collected in our form, so we pass a neutral default of 50)
    """
    if not CROP_MODEL_LOADED:
        # Fallback mock
        crops = ["Wheat", "Rice", "Maize", "Cotton", "Sugarcane"]
        return {"top_crops": crops[:3], "scores": [0.88, 0.83, 0.79]}

    # Feature vector — adjust column order if your training used a different order
    features = np.array([[n, p, k, temp, 50.0, ph, rainfall]])

    # predict_proba gives confidence per class
    if hasattr(crop_model, "predict_proba"):
        proba = crop_model.predict_proba(features)[0]
        top3_idx = np.argsort(proba)[::-1][:3]
        top3_scores = proba[top3_idx].tolist()
        top3_labels = crop_label_encoder.inverse_transform(
            crop_model.classes_[top3_idx]
        ).tolist()
    else:
        # Model without predict_proba — just return single prediction
        pred = crop_model.predict(features)
        top3_labels = crop_label_encoder.inverse_transform(pred).tolist()
        top3_scores = [1.0]

    return {"top_crops": top3_labels, "scores": top3_scores}


# ── Disease Detection ─────────────────────────────────────────────────────────
# Class names from PlantVillage dataset (38 classes used in training)
DISEASE_CLASSES = {
    0:  "Apple___Apple_scab",
    1:  "Apple___Black_rot",
    2:  "Apple___Cedar_apple_rust",
    3:  "Apple___healthy",
    4:  "Blueberry___healthy",
    5:  "Cherry_(including_sour)___Powdery_mildew",
    6:  "Cherry_(including_sour)___healthy",
    7:  "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
    8:  "Corn_(maize)___Common_rust_",
    9:  "Corn_(maize)___Northern_Leaf_Blight",
    10: "Corn_(maize)___healthy",
    11: "Grape___Black_rot",
    12: "Grape___Esca_(Black_Measles)",
    13: "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    14: "Grape___healthy",
    15: "Orange___Haunglongbing_(Citrus_greening)",
    16: "Peach___Bacterial_spot",
    17: "Peach___healthy",
    18: "Pepper,_bell___Bacterial_spot",
    19: "Pepper,_bell___healthy",
    20: "Potato___Early_blight",
    21: "Potato___Late_blight",
    22: "Potato___healthy",
    23: "Raspberry___healthy",
    24: "Soybean___healthy",
    25: "Squash___Powdery_mildew",
    26: "Strawberry___Leaf_scorch",
    27: "Strawberry___healthy",
    28: "Tomato___Bacterial_spot",
    29: "Tomato___Early_blight",
    30: "Tomato___Late_blight",
    31: "Tomato___Leaf_Mold",
    32: "Tomato___Septoria_leaf_spot",
    33: "Tomato___Spider_mites Two-spotted_spider_mite",
    34: "Tomato___Target_Spot",
    35: "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    36: "Tomato___Tomato_mosaic_virus",
    37: "Tomato___healthy",
}

# Treatment suggestions per disease
TREATMENTS = {
    "healthy": "No treatment needed. Plant looks healthy!",
    "Apple_scab": "Apply fungicide (captan or myclobutanil). Remove infected leaves.",
    "Black_rot": "Prune infected areas. Apply copper-based fungicide.",
    "Cedar_apple_rust": "Apply fungicide at bud break. Remove nearby cedar trees if possible.",
    "Powdery_mildew": "Apply sulfur-based fungicide. Improve air circulation.",
    "Cercospora_leaf_spot": "Apply fungicide (azoxystrobin). Rotate crops.",
    "Common_rust_": "Apply fungicide early. Use resistant varieties.",
    "Northern_Leaf_Blight": "Apply fungicide. Use resistant hybrids.",
    "Esca_(Black_Measles)": "No cure. Remove and destroy infected vines.",
    "Leaf_blight_(Isariopsis_Leaf_Spot)": "Apply copper fungicide. Remove infected leaves.",
    "Haunglongbing_(Citrus_greening)": "No cure. Remove infected trees. Control psyllid insects.",
    "Bacterial_spot": "Apply copper-based bactericide. Avoid overhead irrigation.",
    "Early_blight": "Apply fungicide (chlorothalonil). Remove lower infected leaves.",
    "Late_blight": "Apply fungicide immediately (mancozeb). Destroy infected plants.",
    "Leaf_scorch": "Improve drainage. Apply fungicide if severe.",
    "Septoria_leaf_spot": "Apply fungicide. Remove infected leaves. Avoid wetting foliage.",
    "Spider_mites": "Apply miticide or neem oil. Increase humidity.",
    "Target_Spot": "Apply fungicide. Improve air circulation.",
    "Tomato_Yellow_Leaf_Curl_Virus": "Control whitefly vectors. Remove infected plants.",
    "Tomato_mosaic_virus": "No cure. Remove infected plants. Disinfect tools.",
}

def _get_treatment(class_name: str) -> str:
    """Map class name to a treatment string."""
    if "healthy" in class_name.lower():
        return TREATMENTS["healthy"]
    # Try to match the disease part after '___'
    parts = class_name.split("___")
    disease_key = parts[-1] if len(parts) > 1 else class_name
    for key, treatment in TREATMENTS.items():
        if key.lower() in disease_key.lower():
            return treatment
    return "Consult a local agricultural expert for treatment advice."


def predict_disease(image_bytes: bytes):
    """
    Run the CNN model on the uploaded leaf image and return disease + confidence.
    """
    if not DISEASE_MODEL_LOADED:
        return {
            "disease": "Model not available",
            "confidence": 0.0,
            "treatment": "Please ensure disease model is loaded."
        }

    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        img = img.resize((128, 128))
        img_array = np.array(img) / 255.0
        img_array = np.expand_dims(img_array, axis=0)  # (1, 128, 128, 3)

        predictions = disease_model.predict(img_array, verbose=0)[0]
        pred_idx = int(np.argmax(predictions))
        confidence = float(predictions[pred_idx])

        class_name = DISEASE_CLASSES.get(pred_idx, f"Unknown class {pred_idx}")
        # Make it human-readable: "Tomato___Early_blight" → "Tomato - Early blight"
        display_name = class_name.replace("___", " - ").replace("_", " ")

        return {
            "disease": display_name,
            "confidence": round(confidence, 4),
            "treatment": _get_treatment(class_name)
        }
    except Exception as e:
        return {
            "disease": "Prediction error",
            "confidence": 0.0,
            "treatment": str(e)
        }


# ── Weather Anomaly Detection (rule-based, no model needed) ──────────────────
def detect_weather_anomaly(weather_data: list):
    if not weather_data:
        return {"anomaly": "None", "severity": "None"}

    latest = weather_data[-1]
    temp = latest.get("temperature", 25)
    rainfall = latest.get("rainfall", 0)
    humidity = latest.get("humidity", 50)

    if rainfall > 80:
        return {"anomaly": "Extremely Heavy Rainfall", "severity": "High"}
    elif rainfall > 50:
        return {"anomaly": "Heavy Rainfall", "severity": "Medium"}
    elif temp > 42:
        return {"anomaly": "Extreme Heat", "severity": "High"}
    elif temp > 38:
        return {"anomaly": "Heat Stress", "severity": "Medium"}
    elif humidity > 90:
        return {"anomaly": "High Humidity - Disease Risk", "severity": "Medium"}

    return {"anomaly": "None", "severity": "Low"}


# ── Fertilizer Recommendation ────────────────────────────────────────────────

# Fertilizer types and their characteristics
FERTILIZER_DATABASE = {
    "Urea": {
        "type": "Chemical",
        "npk": "46-0-0",
        "nitrogen": 46,
        "cost_per_kg": 6,
        "application": "Split application - 50% at sowing, 25% at tillering, 25% at flowering",
        "benefits": "High nitrogen content, quick release, water soluble"
    },
    "DAP": {
        "type": "Chemical",
        "npk": "18-46-0",
        "phosphorus": 46,
        "cost_per_kg": 27,
        "application": "Apply at sowing time as basal dose",
        "benefits": "High phosphorus, promotes root development"
    },
    "MOP": {
        "type": "Chemical",
        "npk": "0-0-60",
        "potassium": 60,
        "cost_per_kg": 17,
        "application": "Apply before flowering stage",
        "benefits": "High potassium, improves crop quality and disease resistance"
    },
    "NPK 19:19:19": {
        "type": "Chemical",
        "npk": "19-19-19",
        "balanced": True,
        "cost_per_kg": 25,
        "application": "Apply as per soil test, suitable for all crops",
        "benefits": "Balanced nutrition, suitable for all growth stages"
    },
    "Compost": {
        "type": "Organic",
        "npk": "1-1-1",
        "cost_per_kg": 2,
        "application": "Apply 2-3 weeks before sowing, mix with soil",
        "benefits": "Improves soil structure, slow release, eco-friendly"
    },
    "Vermicompost": {
        "type": "Organic",
        "npk": "2-1-1",
        "cost_per_kg": 5,
        "application": "Apply at sowing, can be used throughout crop cycle",
        "benefits": "Rich in micronutrients, improves soil health"
    },
    "Neem Cake": {
        "type": "Organic",
        "npk": "5-1-1",
        "cost_per_kg": 20,
        "application": "Apply 2-3 weeks before sowing",
        "benefits": "Pest repellent, slow nitrogen release"
    },
    "Bone Meal": {
        "type": "Organic",
        "npk": "3-15-0",
        "cost_per_kg": 30,
        "application": "Apply at sowing for root crops",
        "benefits": "Slow release phosphorus, promotes root growth"
    }
}


def recommend_fertilizer(n: float, p: float, k: float, ph: float, crop: str = None):
    """
    Recommend fertilizer based on soil NPK values and pH.
    Returns detailed fertilizer recommendations with quantities and timing.
    """
    
    recommendations = []
    
    # Optimal NPK ranges for general crops
    optimal_n = 40  # mg/kg
    optimal_p = 30  # mg/kg
    optimal_k = 40  # mg/kg
    optimal_ph_min = 6.0
    optimal_ph_max = 7.5
    
    # Calculate deficiencies
    n_deficit = max(0, optimal_n - n)
    p_deficit = max(0, optimal_p - p)
    k_deficit = max(0, optimal_k - k)
    
    # Nitrogen recommendation
    if n < 20:
        # Severe nitrogen deficiency
        recommendations.append({
            "nutrient": "Nitrogen (N)",
            "status": "Severely Deficient",
            "current_value": n,
            "optimal_range": "40-60 mg/kg",
            "primary_fertilizer": {
                "name": "Urea",
                "quantity_per_acre": "50 kg",
                "cost_estimate": 300,
                "type": "Chemical",
                **FERTILIZER_DATABASE["Urea"]
            },
            "organic_alternative": {
                "name": "Neem Cake",
                "quantity_per_acre": "200 kg",
                "cost_estimate": 4000,
                "type": "Organic",
                **FERTILIZER_DATABASE["Neem Cake"]
            },
            "priority": "High"
        })
    elif n < 35:
        # Moderate nitrogen deficiency
        recommendations.append({
            "nutrient": "Nitrogen (N)",
            "status": "Moderately Deficient",
            "current_value": n,
            "optimal_range": "40-60 mg/kg",
            "primary_fertilizer": {
                "name": "Urea",
                "quantity_per_acre": "30 kg",
                "cost_estimate": 180,
                "type": "Chemical",
                **FERTILIZER_DATABASE["Urea"]
            },
            "organic_alternative": {
                "name": "Vermicompost",
                "quantity_per_acre": "500 kg",
                "cost_estimate": 2500,
                "type": "Organic",
                **FERTILIZER_DATABASE["Vermicompost"]
            },
            "priority": "Medium"
        })
    
    # Phosphorus recommendation
    if p < 15:
        # Severe phosphorus deficiency
        recommendations.append({
            "nutrient": "Phosphorus (P)",
            "status": "Severely Deficient",
            "current_value": p,
            "optimal_range": "30-50 mg/kg",
            "primary_fertilizer": {
                "name": "DAP (Di-Ammonium Phosphate)",
                "quantity_per_acre": "40 kg",
                "cost_estimate": 1080,
                "type": "Chemical",
                **FERTILIZER_DATABASE["DAP"]
            },
            "organic_alternative": {
                "name": "Bone Meal",
                "quantity_per_acre": "100 kg",
                "cost_estimate": 3000,
                "type": "Organic",
                **FERTILIZER_DATABASE["Bone Meal"]
            },
            "priority": "High"
        })
    elif p < 25:
        # Moderate phosphorus deficiency
        recommendations.append({
            "nutrient": "Phosphorus (P)",
            "status": "Moderately Deficient",
            "current_value": p,
            "optimal_range": "30-50 mg/kg",
            "primary_fertilizer": {
                "name": "DAP (Di-Ammonium Phosphate)",
                "quantity_per_acre": "25 kg",
                "cost_estimate": 675,
                "type": "Chemical",
                **FERTILIZER_DATABASE["DAP"]
            },
            "organic_alternative": {
                "name": "Bone Meal",
                "quantity_per_acre": "60 kg",
                "cost_estimate": 1800,
                "type": "Organic",
                **FERTILIZER_DATABASE["Bone Meal"]
            },
            "priority": "Medium"
        })
    
    # Potassium recommendation
    if k < 20:
        # Severe potassium deficiency
        recommendations.append({
            "nutrient": "Potassium (K)",
            "status": "Severely Deficient",
            "current_value": k,
            "optimal_range": "40-60 mg/kg",
            "primary_fertilizer": {
                "name": "MOP (Muriate of Potash)",
                "quantity_per_acre": "35 kg",
                "cost_estimate": 595,
                "type": "Chemical",
                **FERTILIZER_DATABASE["MOP"]
            },
            "organic_alternative": {
                "name": "Compost",
                "quantity_per_acre": "1000 kg",
                "cost_estimate": 2000,
                "type": "Organic",
                **FERTILIZER_DATABASE["Compost"]
            },
            "priority": "High"
        })
    elif k < 35:
        # Moderate potassium deficiency
        recommendations.append({
            "nutrient": "Potassium (K)",
            "status": "Moderately Deficient",
            "current_value": k,
            "optimal_range": "40-60 mg/kg",
            "primary_fertilizer": {
                "name": "MOP (Muriate of Potash)",
                "quantity_per_acre": "20 kg",
                "cost_estimate": 340,
                "type": "Chemical",
                **FERTILIZER_DATABASE["MOP"]
            },
            "organic_alternative": {
                "name": "Compost",
                "quantity_per_acre": "600 kg",
                "cost_estimate": 1200,
                "type": "Organic",
                **FERTILIZER_DATABASE["Compost"]
            },
            "priority": "Medium"
        })
    
    # pH recommendation
    ph_recommendation = None
    if ph < optimal_ph_min:
        ph_recommendation = {
            "issue": "Acidic Soil",
            "current_ph": ph,
            "optimal_range": "6.0-7.5",
            "solution": "Apply Agricultural Lime",
            "quantity_per_acre": f"{int((optimal_ph_min - ph) * 200)} kg",
            "cost_estimate": int((optimal_ph_min - ph) * 200 * 3),
            "application": "Apply 2-3 months before sowing, mix thoroughly with soil",
            "benefits": "Raises pH, improves nutrient availability"
        }
    elif ph > optimal_ph_max:
        ph_recommendation = {
            "issue": "Alkaline Soil",
            "current_ph": ph,
            "optimal_range": "6.0-7.5",
            "solution": "Apply Gypsum or Sulfur",
            "quantity_per_acre": f"{int((ph - optimal_ph_max) * 150)} kg",
            "cost_estimate": int((ph - optimal_ph_max) * 150 * 8),
            "application": "Apply before sowing, irrigate after application",
            "benefits": "Lowers pH, improves soil structure"
        }
    
    # Calculate total cost
    total_chemical_cost = sum(r["primary_fertilizer"]["cost_estimate"] for r in recommendations)
    total_organic_cost = sum(r["organic_alternative"]["cost_estimate"] for r in recommendations)
    
    # General recommendations
    general_tips = [
        "Always conduct soil test before fertilizer application",
        "Split nitrogen application for better efficiency",
        "Apply phosphorus and potassium as basal dose",
        "Organic fertilizers improve long-term soil health",
        "Avoid over-fertilization to prevent nutrient runoff",
        "Consider crop-specific nutrient requirements"
    ]
    
    # If all nutrients are optimal
    if not recommendations:
        recommendations.append({
            "nutrient": "All Nutrients",
            "status": "Optimal",
            "message": "Your soil has balanced NPK levels. Maintain with regular organic matter addition.",
            "maintenance_fertilizer": {
                "name": "NPK 19:19:19",
                "quantity_per_acre": "25 kg",
                "cost_estimate": 625,
                "type": "Chemical",
                **FERTILIZER_DATABASE["NPK 19:19:19"]
            },
            "organic_maintenance": {
                "name": "Compost",
                "quantity_per_acre": "500 kg",
                "cost_estimate": 1000,
                "type": "Organic",
                **FERTILIZER_DATABASE["Compost"]
            },
            "priority": "Low"
        })
    
    return {
        "soil_status": {
            "nitrogen": n,
            "phosphorus": p,
            "potassium": k,
            "ph": ph
        },
        "recommendations": recommendations,
        "ph_correction": ph_recommendation,
        "cost_summary": {
            "chemical_fertilizers": total_chemical_cost,
            "organic_fertilizers": total_organic_cost,
            "savings_with_organic": total_chemical_cost - total_organic_cost if total_organic_cost < total_chemical_cost else 0
        },
        "general_tips": general_tips,
        "crop_specific_note": f"Recommendations are general. For {crop}, consult local agricultural extension for specific requirements." if crop else "Recommendations are general. Adjust based on specific crop requirements."
    }
