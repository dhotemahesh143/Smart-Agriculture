# 🚀 How to Run Smart Agriculture Project

## Quick Start (Everything Already Set Up)

### Option 1: Using Two Terminals (Recommended)

**Terminal 1 - Start Backend:**
```bash
cd Smart-Agriculture-main/backend
python -m uvicorn main:app --reload --port 8000
```

**Terminal 2 - Start Frontend:**
```bash
cd Smart-Agriculture-main/frontend
npm run dev
```

**Then open your browser:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

### Option 2: Using PowerShell Script (Windows)

Create a file `start.ps1` in the project root:

```powershell
# Start backend in background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Smart-Agriculture-main/backend; python -m uvicorn main:app --reload --port 8000"

# Wait 5 seconds for backend to start
Start-Sleep -Seconds 5

# Start frontend in background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd Smart-Agriculture-main/frontend; npm run dev"

Write-Host "✅ Both servers starting..."
Write-Host "Frontend: http://localhost:5173"
Write-Host "Backend: http://localhost:8000"
```

Then run:
```bash
powershell -ExecutionPolicy Bypass -File start.ps1
```

---

### Option 3: Using Bash Script (Git Bash/WSL)

Create a file `start.sh` in the project root:

```bash
#!/bin/bash

# Start backend in background
cd Smart-Agriculture-main/backend
python -m uvicorn main:app --reload --port 8000 &
BACKEND_PID=$!

# Wait for backend to start
sleep 5

# Start frontend in background
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "✅ Both servers started!"
echo "Frontend: http://localhost:5173"
echo "Backend: http://localhost:8000"
echo ""
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
```

Make it executable and run:
```bash
chmod +x start.sh
./start.sh
```

---

## Full Setup from Scratch (New Machine)

### Prerequisites
- Python 3.10+ (`python --version`)
- Node.js 18+ (`node --version`)
- pip (`pip --version`)
- npm (`npm --version`)

### Step-by-Step Setup

**1. Navigate to project:**
```bash
cd Smart-Agriculture-main
```

**2. Backend Setup:**
```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Create .env file (if not exists)
cp .env.example .env

# Edit .env and add your API keys:
# - GEMINI_API_KEY (get free at https://aistudio.google.com)
# - TWILIO credentials (optional, for SMS alerts)
```

**3. Copy Model Files (if not already done):**
```bash
# From backend directory
cp ../model/ann_fertilizer_model.h5 models/
cp ../model/best_cnn_phase1.h5 models/
```

**4. Frontend Setup:**
```bash
cd ../frontend

# Install npm dependencies
npm install
```

**5. Run the Project:**

Open two terminals:

**Terminal 1:**
```bash
cd Smart-Agriculture-main/backend
python -m uvicorn main:app --reload --port 8000
```

**Terminal 2:**
```bash
cd Smart-Agriculture-main/frontend
npm run dev
```

**6. Open Browser:**
- Go to http://localhost:5173

---

## Troubleshooting

### Backend won't start
```bash
# Check if port 8000 is already in use
netstat -ano | findstr :8000

# Kill the process if needed (replace PID)
taskkill /PID <PID> /F

# Or use a different port
python -m uvicorn main:app --reload --port 8001
```

### Frontend won't start
```bash
# Check if port 5173 is already in use
netstat -ano | findstr :5173

# Kill the process if needed
taskkill /PID <PID> /F

# Or delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Models not loading
```bash
# Check if TensorFlow is installed
pip show tensorflow

# If not, install it
pip install tensorflow

# Check if model files exist
ls backend/models/
# Should see: ann_fertilizer_model.h5, best_cnn_phase1.h5

# If missing, copy from model/ folder
cp model/*.h5 backend/models/
```

### Python dependencies issues
```bash
# Upgrade pip first
python -m pip install --upgrade pip

# Install dependencies one by one if batch fails
pip install fastapi uvicorn sqlalchemy python-dotenv pydantic
pip install requests APScheduler google-genai groq httpx
pip install Pillow numpy twilio scikit-learn joblib
pip install tensorflow
```

---

## What Each Server Does

### Backend (Port 8000)
- FastAPI REST API
- Machine Learning models (crop, disease, fertilizer)
- Weather data fetching
- Gemini AI farming plans
- Database (SQLite)
- SMS alerts (Twilio)

### Frontend (Port 5173)
- React + Vite web interface
- User input forms
- Crop recommendations display
- Disease detection upload
- Weather alerts dashboard
- Farming plan calendar

---

## Features Status

| Feature | Status | Requirements |
|---------|--------|--------------|
| Weather Monitoring | ✅ Works | None (free API) |
| Disease Detection | ✅ Works | TensorFlow installed |
| Fertilizer Recommendation | ✅ Works | TensorFlow installed |
| Smart Fertilizer System | ✅ NEW | None (rule-based) |
| Gemini AI Farming Plans | ✅ Works | GEMINI_API_KEY in .env |
| Maharashtra Regional Crops | ✅ Works | None |
| SMS Weather Alerts | ⚠️ Optional | Twilio credentials in .env |
| Crop Recommendation | ⚠️ Mock | Need crop_rf_model.pkl (train from notebook) |
| Voice Assistant (Multilingual) | ✅ Works | Web Speech API (Chrome/Edge) |
| AI Chatbot | ✅ Works | GROQ_API_KEY in .env |

---

## API Endpoints

Once backend is running, visit http://localhost:8000/docs for interactive API documentation.

Key endpoints:
- `POST /input` - Save soil + location data
- `GET /recommend?input_id=1` - Get crop recommendations
- `POST /generate-plan?input_id=1` - Generate AI farming plan
- `POST /fertilizer-recommend` - Get detailed fertilizer recommendations (NEW)
- `GET /weather?location=Nashik` - Get real-time weather
- `POST /disease-detect` - Upload leaf image for disease detection
- `POST /chat` - Chat with AI assistant (multilingual)
- `GET /alerts` - Get weather and AI alerts
- `POST /register-phone?phone=+91...` - Register for SMS alerts

### New: Smart Fertilizer Recommendation System

The fertilizer recommendation endpoint analyzes your soil's NPK values and pH level to provide:

**Input:**
```json
{
  "n": 25,
  "p": 20,
  "k": 30,
  "ph": 5.5,
  "crop": "Rice",
  "location": "Pune"
}
```

**Output includes:**
- Current soil status analysis
- Nutrient deficiency identification (N, P, K)
- Chemical fertilizer recommendations with quantities and costs
- Organic fertilizer alternatives
- pH correction recommendations (if needed)
- Application timing and methods
- Cost comparison between chemical and organic options
- General tips for fertilizer application

**Features:**
- Identifies severe vs moderate deficiencies
- Provides both chemical and organic options
- Calculates quantities per acre
- Estimates costs in INR
- Includes pH correction recommendations
- Crop-specific notes (optional)

---

## Stop the Servers

**If running in terminals:**
- Press `Ctrl+C` in each terminal

**If running via script:**
- Close the PowerShell windows
- Or press `Ctrl+C` in the script terminal

**If processes are stuck:**
```bash
# Windows
taskkill /F /IM python.exe
taskkill /F /IM node.exe

# Or find specific PIDs
netstat -ano | findstr :8000
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

---

## Next Steps

1. **Test Disease Detection**: Upload a leaf image at http://localhost:5173
2. **Try Crop Recommendation**: Enter soil parameters and location
3. **Generate Farming Plan**: Get AI-powered day-by-day farming schedule
4. **Check Weather Alerts**: View real-time weather for any Maharashtra location
5. **Add Twilio Credentials**: Enable SMS weather alerts (optional)

---

**Built with ❤️ for Maharashtra farmers**
