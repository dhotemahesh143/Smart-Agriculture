# 🌾 BalirajaSahayak (कृषी सहायक) — Smart Agriculture Platform

> **An intelligent, full-stack AI-powered farming assistant built for Indian farmers**

BalirajaSahayak combines Machine Learning, Generative AI, real-time weather monitoring, multilingual voice assistant, and SMS alerts to help farmers make data-driven decisions and maximize crop yields.

[![Python](https://img.shields.io/badge/Python-3.10+-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-green.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.2+-61DAFB.svg)](https://reactjs.org/)
[![TensorFlow](https://img.shields.io/badge/TensorFlow-2.x-orange.svg)](https://www.tensorflow.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Architecture](#-project-architecture)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Machine Learning Models](#-machine-learning-models)
- [Regional Intelligence](#-regional-intelligence)
- [Screenshots](#-screenshots)
- [Contributing](#-contributing)
- [License](#-license)
- [Authors](#-authors)

---

## ✨ Features

### 🤖 AI-Powered Crop Recommendation
- **Random Forest ML Model** predicts top 3 best crops based on soil parameters (N, P, K, pH) and real-time weather
- **Geographic Validation** using Groq LLaMA 3.3 70B to correct predictions based on actual location
- Works for any location worldwide (Kashmir → Apple, Kerala → Coconut, Punjab → Wheat, Maharashtra → Grapes/Cotton)
- Confidence scores and match percentages for each recommendation

### 🌾 Maharashtra Regional Crop Intelligence
- Built-in knowledge base covering **22 Maharashtra districts**
- Surfaces **GI-tagged crops**: Alphonso Mango, Nagpuri Orange, Jalgaon Banana, Sangli Turmeric, Poona Fig, Palghar Chikoo
- Region-specific crop badges shown alongside ML recommendations
- Location autocomplete for all Maharashtra districts
- Seasonal recommendations and local variety information

### 📧 Email & SMS Weather Alerts (NEW!)
- **Email Alerts** (Recommended for India 🇮🇳): Beautiful HTML emails with weather updates
  - ✅ Works immediately without DLT registration
  - ✅ Free (100-500 emails/day)
  - ✅ Rich formatting with colors, icons, and recommendations
  - ✅ Automatic severe weather monitoring
- **SMS Alerts**: Twilio integration for text notifications
  - Works in US, Canada, UK, Australia, etc.
  - Requires DLT registration for India (2-4 weeks)
- **Automatic Monitoring**: Hourly weather checks with severity detection
- **Actionable Recommendations**: Specific farming actions for each alert type
- See: [`START_HERE.md`](START_HERE.md) for 5-minute email setup

### 📅 AI Farming Plan (Groq LLaMA 3.3 70B)
- Generates **detailed day-by-day farming itinerary** from Day 1 to harvest
- Organized into phases: Land Preparation → Sowing → Vegetative Growth → Flowering → Harvest
- Each day has specific actionable tasks, quantities, timings, and practical notes
- Maharashtra-aware: includes local variety names, GI tag info, and best seasons
- Saves plan to database with task tracking

### 🌦️ Real-Time Weather Monitoring
- **Live geocoding** via Open-Meteo API — fetches actual weather for any city (not hardcoded)
- Monitors: temperature, rainfall, humidity, wind speed, WMO weather condition
- Detects severe events: thunderstorms, heavy rainfall, extreme heat, strong winds, high humidity
- Weather-based anomaly detection for crop risk assessment

### 📱 SMS Weather Alerts (Twilio)
- Automatic SMS alerts sent when severe weather is detected in a farmer's location
- Hourly background scheduler checks all registered locations
- Farmers can register their phone number directly from the Alerts page
- Powered by **Twilio SMS API**
- Alert triggers: Thunderstorm, Heavy rainfall (>10mm/hr), Extreme heat (>42°C), Strong winds (>50km/h), High humidity (>90%)

### 🔬 Crop Disease Detection
- **CNN model** trained on PlantVillage dataset — **38 disease classes**
- Upload a leaf image → get disease name, confidence score, and treatment recommendation
- Covers: Apple, Corn, Grape, Tomato, Potato, Strawberry, Cherry, Peach, Pepper, Raspberry, Soybean, Squash, Orange, Blueberry
- Treatment recommendations for each disease with specific fungicides/pesticides

### 🧪 Smart Fertilizer Recommendation System
- **Rule-based intelligent system** (no ML model needed)
- Analyzes soil NPK values and pH level
- Identifies nutrient deficiencies (Nitrogen, Phosphorus, Potassium)
- Provides both **chemical and organic fertilizer options**
- Calculates quantities per acre and cost estimates in INR
- pH correction recommendations (Agricultural Lime for acidic soil, Gypsum/Sulfur for alkaline soil)
- Application timing and methods for each fertilizer
- Cost comparison between chemical and organic options

### 💬 Multilingual AI Chatbot (Groq LLaMA 3.3 70B)
- **Language detection** — automatically detects user's language
- Responds in the **same language** (English, Hindi, Marathi, Punjabi, Tamil, Telugu, Bengali, Gujarati, Kannada, Malayalam)
- Generates **action plans** with step-by-step instructions in the detected language
- Context-aware: uses farmer's location and soil data for personalized advice
- Covers: crop selection, disease treatment, fertilizers, irrigation, pest management, organic farming
- Suggested questions for quick start

### 🎤 Voice Assistant (Multilingual)
- **Web Speech API** integration for voice input
- Supports **English, Hindi, and Marathi**
- Real-time speech-to-text conversion
- Voice commands for hands-free operation
- Ideal for farmers with low literacy

### 🎨 Modern UI/UX
- **Dark theme** with glassmorphism effects
- **Material Design icons** for consistent visual language
- Responsive design for all devices (mobile, tablet, desktop)
- Smooth animations and transitions
- Card-based layout for easy scanning
- Color-coded severity indicators (red for high risk, orange for warnings, green for success)

---

## 🏗️ Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| **FastAPI** | High-performance REST API framework |
| **Python 3.10+** | Core programming language |
| **SQLAlchemy** | ORM for database operations |
| **SQLite** | Lightweight database for development |
| **TensorFlow/Keras** | Deep learning models (CNN, ANN) |
| **Scikit-learn** | Machine learning (Random Forest) |
| **Groq LLaMA 3.3 70B** | Generative AI for farming plans and chatbot |
| **Open-Meteo API** | Real-time weather data (free, no key needed) |
| **Twilio SMS API** | SMS alert delivery |
| **APScheduler** | Background job scheduling |
| **Pydantic** | Data validation and serialization |

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19.2** | UI framework |
| **Vite** | Fast build tool and dev server |
| **React Router** | Client-side routing |
| **Material-UI** | Component library and icons |
| **Lucide Icons** | Additional icon set |
| **Web Speech API** | Voice recognition |
| **CSS3** | Styling with glassmorphism effects |

### Machine Learning Models
| Model | Type | Purpose | Dataset |
|-------|------|---------|---------|
| **Crop Recommendation** | Random Forest | Predict best crops | Custom soil-crop dataset |
| **Disease Detection** | CNN (Convolutional Neural Network) | Identify plant diseases | PlantVillage (38 classes) |
| **Fertilizer Recommendation** | ANN (Artificial Neural Network) | Recommend fertilizers | Custom NPK-fertilizer dataset |

---

## 📁 Project Architecture

```
Smart-Agriculture/
├── backend/
│   ├── main.py                          # FastAPI app entry point
│   ├── requirements.txt                 # Python dependencies
│   ├── .env.example                     # Environment variables template
│   ├── farming_assistant.db             # SQLite database
│   │
│   ├── database/
│   │   ├── base.py                      # SQLAlchemy engine & session
│   │   └── models.py                    # DB models (UserInput, FarmingPlan, Task, Alert)
│   │
│   ├── models/
│   │   ├── schemas.py                   # Pydantic request/response schemas
│   │   ├── crop_rf_model.pkl            # Trained Random Forest crop model
│   │   ├── Label_rf_model.pkl           # Label encoder for crop names
│   │   ├── best_cnn_phase1.h5           # Trained CNN disease detection model
│   │   └── ann_fertilizer_model.h5      # Trained ANN fertilizer model
│   │
│   ├── routes/
│   │   └── api.py                       # All API endpoints
│   │
│   ├── services/
│   │   ├── ml_service.py                # ML model inference (crop, disease, fertilizer)
│   │   ├── gemini_service.py            # Groq AI farming plan + chatbot + validation
│   │   ├── weather_service.py           # Real-time weather + geocoding + severity check
│   │   ├── maharashtra_crop_service.py  # Maharashtra regional crop knowledge base
│   │   └── sms_service.py               # Twilio SMS alert service
│   │
│   └── scheduler/
│       └── jobs.py                      # Hourly weather monitoring job
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                      # Router + Navbar
│   │   ├── main.jsx                     # React entry point
│   │   ├── index.css                    # Global styles
│   │   │
│   │   ├── components/
│   │   │   ├── ChatBot.jsx              # AI chatbot component
│   │   │   ├── VoiceAssistant.jsx       # Voice input component
│   │   │   ├── Toast.jsx                # Toast notification system
│   │   │   └── LoadingSkeleton.jsx      # Loading placeholders
│   │   │
│   │   ├── pages/
│   │   │   ├── SimpleHomePage.jsx       # Landing page
│   │   │   ├── InputPage.jsx            # Soil data + location input
│   │   │   ├── RecommendationPage.jsx   # ML crop recommendations + regional crops
│   │   │   ├── Dashboard.jsx            # Day-by-day farming plan itinerary
│   │   │   ├── FertilizerPage.jsx       # Smart fertilizer recommendations
│   │   │   ├── DiseaseDetection.jsx     # Leaf image upload + CNN diagnosis
│   │   │   ├── AlertsPage.jsx           # Live weather + SMS registration + alerts
│   │   │   ├── ModernDashboard.jsx      # Modern UI dashboard (Phase 1)
│   │   │   └── VoiceAssistantPage.jsx   # Voice assistant page
│   │   │
│   │   ├── i18n/
│   │   │   ├── LanguageContext.jsx      # Language context provider
│   │   │   └── translations.js          # Translations (English, Hindi, Marathi)
│   │   │
│   │   └── theme/
│   │       └── modernTheme.js           # Modern design system
│   │
│   ├── package.json                     # npm dependencies
│   └── vite.config.js                   # Vite configuration
│
├── model/
│   ├── PEC_Project.ipynb                # Jupyter notebook for model training
│   ├── best_cnn_phase1.h5               # Trained CNN model
│   ├── ann_fertilizer_model.h5          # Trained ANN model
│   └── README.md                        # Model documentation
│
├── README.md                            # This file
├── RUN_PROJECT.md                       # Quick start guide
├── FEATURE_IMPLEMENTATION.md            # Feature development tracker
├── FERTILIZER_FEATURE_GUIDE.md          # Fertilizer system user guide
└── MODERN_UI_IMPLEMENTATION.md          # UI redesign documentation
```

---

## 🚀 Installation

### Prerequisites
- **Python 3.10+** ([Download](https://www.python.org/downloads/))
- **Node.js 18+** ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))

### 1. Clone the Repository
```bash
git clone https://github.com/PratikPBhosale/Smart-Agriculture.git
cd Smart-Agriculture
```

### 2. Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup
```bash
cd frontend

# Install dependencies
npm install
```

### 4. Copy Model Files
```bash
# From project root
cp model/ann_fertilizer_model.h5 backend/models/
cp model/best_cnn_phase1.h5 backend/models/
```

---

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
cd backend
cp .env.example .env
```

Edit `.env` and add your API keys:

```env
# Groq API (for AI farming plans and chatbot)
GROQ_API_KEY=your_groq_api_key_here

# Twilio SMS (optional, for SMS alerts)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_FROM_NUMBER=+1234567890

# Phone numbers to receive alerts (comma-separated)
ALERT_PHONE_NUMBERS=+919876543210,+919876543211
```

### Getting API Keys

#### Groq API Key (Free)
1. Visit [Groq Console](https://console.groq.com/)
2. Sign up for a free account
3. Navigate to API Keys section
4. Create a new API key
5. Copy and paste into `.env`

#### Twilio Credentials (Optional - Free Trial)
1. Visit [Twilio](https://www.twilio.com/try-twilio)
2. Sign up for a free trial account
3. Get your Account SID and Auth Token from the dashboard
4. Get a Twilio phone number
5. Copy credentials into `.env`

**Note:** Weather API (Open-Meteo) requires no API key — it's completely free!

---

## 🎯 Usage

### Starting the Application

#### Option 1: Two Terminals (Recommended)

**Terminal 1 - Backend:**
```bash
cd backend
python -m uvicorn main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

#### Option 2: PowerShell Script (Windows)

Create `start.ps1` in project root:
```powershell
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python -m uvicorn main:app --reload --port 8000"
Start-Sleep -Seconds 5
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"
```

Run:
```bash
powershell -ExecutionPolicy Bypass -File start.ps1
```

### Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Documentation:** http://localhost:8000/docs (Swagger UI)

---

## 📚 API Documentation

### Base URL
```
http://localhost:8000
```

### Endpoints

#### 1. Save Soil Input
```http
POST /input
Content-Type: application/json

{
  "N": 40,
  "P": 30,
  "K": 45,
  "pH": 6.5,
  "location": "Nashik"
}

Response: { "id": 1, "N": 40, "P": 30, "K": 45, "pH": 6.5, "location": "Nashik", "created_at": "2024-12-25T10:00:00" }
```

#### 2. Get Crop Recommendations
```http
GET /recommend?input_id=1

Response: {
  "top_crops": ["Grapes", "Onion", "Tomato"],
  "scores": [0.92, 0.87, 0.81],
  "regional_crops": [
    {
      "name": "Grapes",
      "region": "Nashik",
      "gi_tag": true,
      "best_season": "June-October",
      "local_varieties": ["Thompson Seedless", "Sharad Seedless"]
    }
  ]
}
```

#### 3. Generate Farming Plan
```http
POST /generate-plan?input_id=1
Content-Type: application/json

["Grapes", "Onion", "Tomato"]

Response: {
  "crop": "Grapes",
  "total_days": 180,
  "phases": [
    {
      "phase": "Land Preparation",
      "week_range": "Week 1-2",
      "days": [
        {
          "day": 1,
          "tasks": ["Deep plowing to 30 cm", "Remove weeds and stones"],
          "notes": "Ensure soil is well-drained",
          "priority": "high"
        }
      ]
    }
  ],
  "alerts": ["Monitor weather forecast weekly"]
}
```

#### 4. Get Real-Time Weather
```http
GET /weather?location=Nashik

Response: {
  "temperature": 28.5,
  "rainfall": 0,
  "humidity": 65,
  "wind_speed": 12,
  "weather_code": 1,
  "condition": "Partly cloudy",
  "is_severe": false,
  "severity": "Low",
  "anomaly": "None"
}
```

#### 5. Detect Crop Disease
```http
POST /disease-detect
Content-Type: multipart/form-data

file: <image file>

Response: {
  "disease": "Tomato - Early blight",
  "confidence": 0.9234,
  "treatment": "Apply fungicide (chlorothalonil). Remove lower infected leaves."
}
```

#### 6. Get Fertilizer Recommendations
```http
POST /fertilizer-recommend
Content-Type: application/json

{
  "n": 25,
  "p": 20,
  "k": 30,
  "ph": 5.5,
  "crop": "Rice",
  "location": "Pune"
}

Response: {
  "soil_status": { "nitrogen": 25, "phosphorus": 20, "potassium": 30, "ph": 5.5 },
  "recommendations": [
    {
      "nutrient": "Nitrogen (N)",
      "status": "Moderately Deficient",
      "primary_fertilizer": {
        "name": "Urea",
        "quantity_per_acre": "30 kg",
        "cost_estimate": 180
      },
      "organic_alternative": {
        "name": "Vermicompost",
        "quantity_per_acre": "500 kg",
        "cost_estimate": 2500
      }
    }
  ],
  "ph_correction": {
    "issue": "Acidic Soil",
    "solution": "Apply Agricultural Lime",
    "quantity_per_acre": "100 kg",
    "cost_estimate": 300
  },
  "cost_summary": {
    "chemical_fertilizers": 1195,
    "organic_fertilizers": 5500
  }
}
```

#### 7. Chat with AI Assistant
```http
POST /chat
Content-Type: application/json

{
  "message": "Which crop is best for black soil in Nashik?",
  "history": [],
  "context": { "location": "Nashik" }
}

Response: {
  "reply": "For black soil in Nashik, the best crops are Cotton, Soybean, and Wheat...",
  "language": "English",
  "plan": [
    {
      "title": "Soil Testing",
      "description": "Conduct soil test to check NPK levels and pH"
    }
  ],
  "plan_title": "Action Plan"
}
```

#### 8. Register for SMS Alerts
```http
POST /register-phone?phone=+919876543210

Response: {
  "message": "Phone +919876543210 registered for weather alerts.",
  "total_registered": 1
}
```

#### 9. Get All Alerts
```http
GET /alerts

Response: [
  {
    "id": 1,
    "message": "Heavy rainfall detected in Nashik",
    "alert_type": "Weather",
    "severity": "High",
    "created_at": "2024-12-25T10:00:00"
  }
]
```

#### 10. Get All Tasks
```http
GET /tasks

Response: [
  {
    "id": 1,
    "plan_id": 1,
    "phase": "Land Preparation (Week 1-2)",
    "task_name": "Deep plowing to 30 cm | Remove weeds and stones",
    "day_offset": 1,
    "priority": "high",
    "completed": false
  }
]
```

---

## 🤖 Machine Learning Models

### 1. Crop Recommendation Model
- **Algorithm:** Random Forest Classifier
- **Features:** N, P, K, pH, Temperature, Humidity, Rainfall
- **Output:** Top 3 crops with confidence scores
- **Accuracy:** ~92% on test set
- **Training:** Custom dataset with 2200+ samples
- **File:** `crop_rf_model.pkl`, `Label_rf_model.pkl`

### 2. Disease Detection Model
- **Algorithm:** Convolutional Neural Network (CNN)
- **Architecture:** 
  - Input: 128x128x3 RGB images
  - Conv2D layers with ReLU activation
  - MaxPooling layers
  - Dropout for regularization
  - Dense layers with softmax output
- **Classes:** 38 plant diseases
- **Accuracy:** ~94% on validation set
- **Dataset:** PlantVillage (54,000+ images)
- **File:** `best_cnn_phase1.h5`

### 3. Fertilizer Recommendation Model
- **Algorithm:** Artificial Neural Network (ANN)
- **Features:** N, P, K, pH, Crop type
- **Output:** Fertilizer type and quantity
- **Accuracy:** ~89% on test set
- **File:** `ann_fertilizer_model.h5`

**Note:** The fertilizer feature also includes a rule-based system that doesn't require the ML model, providing detailed recommendations with cost analysis.

---

## 🌍 Regional Intelligence

### Maharashtra Districts Covered

| Region | Districts |
|--------|-----------|
| **Konkan** | Ratnagiri, Sindhudurg, Raigad, Palghar |
| **Nashik Region** | Nashik, Dhule, Jalgaon |
| **Pune Region** | Pune, Ahmednagar, Satara, Solapur, Sangli, Kolhapur |
| **Vidarbha** | Nagpur, Amravati, Wardha, Yavatmal, Akola, Buldhana |
| **Marathwada** | Chhatrapati Sambhajinagar, Latur, Nanded, Beed, Dharashiv |
| **Mumbai** | Mumbai, Thane, Palghar |

### GI-Tagged Crops

| Crop | Region | GI Tag | Best Season |
|------|--------|--------|-------------|
| **Alphonso (Hapus) Mango** | Ratnagiri, Sindhudurg | ✅ | March-June |
| **Nagpuri Mandarin Orange** | Nagpur, Amravati | ✅ | November-February |
| **Jalgaon Banana** | Jalgaon | ✅ | Year-round |
| **Sangli Turmeric** | Sangli | ✅ | January-March |
| **Poona Fig (Anjeer)** | Pune (Purandar) | ✅ | June-September |
| **Palghar Chikoo (Sapota)** | Palghar (Dahanu) | ✅ | December-April |

### Regional Crop Database

The system includes detailed information for each district:
- **Primary crops** (e.g., Grapes in Nashik, Cotton in Vidarbha)
- **Secondary crops** (alternative options)
- **Best seasons** for planting
- **Local varieties** (e.g., Thompson Seedless grapes)
- **GI tag status**
- **Region-specific notes** (soil type, climate, irrigation)

---

## 📸 Screenshots

### Home Page
![Home Page](docs/screenshots/home.png)
*Landing page with feature highlights*

### Soil Input Page
![Input Page](docs/screenshots/input.png)
*Enter soil parameters and location*

### Crop Recommendations
![Recommendations](docs/screenshots/recommendations.png)
*ML predictions + regional crops with GI tags*

### Farming Plan Dashboard
![Dashboard](docs/screenshots/dashboard.png)
*Day-by-day farming itinerary with phases*

### Disease Detection
![Disease Detection](docs/screenshots/disease.png)
*Upload leaf image for CNN diagnosis*

### Fertilizer Recommendations
![Fertilizer](docs/screenshots/fertilizer.png)
*Smart fertilizer system with cost analysis*

### Weather Alerts
![Alerts](docs/screenshots/alerts.png)
*Live weather monitoring and SMS registration*

### AI Chatbot
![Chatbot](docs/screenshots/chatbot.png)
*Multilingual AI assistant with action plans*

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow PEP 8 for Python code
- Use ESLint for JavaScript/React code
- Write descriptive commit messages
- Add comments for complex logic
- Update documentation for new features
- Test thoroughly before submitting PR

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Authors

**Pratik Bhosale**
- GitHub: [@PratikPBhosale](https://github.com/PratikPBhosale)
- Email: pratikbhosale@example.com

---

## 🙏 Acknowledgments

- **PlantVillage Dataset** for disease detection training data
- **Open-Meteo** for free weather API
- **Groq** for fast LLaMA 3.3 70B inference
- **Twilio** for SMS API
- **Material-UI** for React components
- **FastAPI** for excellent API framework
- **TensorFlow** for deep learning capabilities

---

## 📞 Support

If you encounter any issues or have questions:

1. Check the [RUN_PROJECT.md](RUN_PROJECT.md) for troubleshooting
2. Open an issue on GitHub
3. Contact the author

---

## 🗺️ Roadmap

### Upcoming Features

- [ ] **Weather-Based Advisory System** - Real-time alerts for heavy rainfall, high temperature
- [ ] **Pest Risk Prediction** - Predict probability of pest attack with preventive measures
- [ ] **Market Price Prediction** - Predict future crop prices and suggest sell/store decisions
- [ ] **Smart Irrigation Recommendation** - Based on soil moisture and weather
- [ ] **Multimodal Disease Detection** - Accept image + text + voice input
- [ ] **Farm Analytics Dashboard** - Yield trends, soil health, weather patterns
- [ ] **PDF Report Generator** - Comprehensive farming report with all recommendations
- [ ] **Mobile App** - React Native app for Android/iOS
- [ ] **Offline Mode** - Work without internet connection
- [ ] **Community Forum** - Farmers can share experiences and tips

---

## 📊 Project Stats

- **Lines of Code:** ~15,000+
- **API Endpoints:** 10
- **ML Models:** 3 (Random Forest, CNN, ANN)
- **Supported Languages:** 10 (English, Hindi, Marathi, Punjabi, Tamil, Telugu, Bengali, Gujarati, Kannada, Malayalam)
- **Disease Classes:** 38
- **Maharashtra Districts:** 22
- **GI-Tagged Crops:** 6

---

## 🌟 Star History

If you find this project useful, please consider giving it a ⭐ on GitHub!

---

**Built with ❤️ for Maharashtra farmers**

*Empowering farmers with AI and data-driven insights*

---

## 📝 Citation

If you use this project in your research or work, please cite:

```bibtex
@software{BalirajaSahayak2024,
  author = {Bhosale, Pratik},
  title = {BalirajaSahayak: Smart Agriculture Platform},
  year = {2024},
  url = {https://github.com/PratikPBhosale/Smart-Agriculture}
}
```

---

## 🔗 Related Projects

- [AgriTech-AI](https://github.com/example/agritech-ai) - Similar project for African farmers
- [FarmBot](https://github.com/example/farmbot) - Automated farming robot
- [CropNet](https://github.com/example/cropnet) - Crop disease detection API

---

*Last Updated: December 25, 2024*
