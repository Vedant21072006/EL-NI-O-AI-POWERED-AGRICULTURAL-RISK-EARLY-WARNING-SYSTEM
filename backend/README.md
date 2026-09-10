# 🌾 KrishiAlert Backend API

Standalone Express + TypeScript backend providing the XGBoost Agricultural Risk Prediction Engine, SHAP Explainability Driver attribution, Agronomic Decision Rule Engine, and Krishi AI Gemini Assistant.

---

## Features

- **XGBoost Risk Inference**: Evaluates ENSO ONI, precipitation deficit, thermal anomaly, and root zone moisture.
- **SHAP Drivers**: Computes positive and negative climate stress contributions.
- **Agronomic Recommendations**: Rule-based mitigation advisories from Maharashtra agricultural university guidelines.
- **Krishi AI**: Multilingual conversational support (Marathi, Hindi, English) with grounded context.
- **CORS Support**: Ready for cross-origin integration with frontend hosted on any domain (Vercel, Netlify, etc.).

---

## Local Development

```bash
cd backend
npm install
npm run dev
```

The API will start on `http://localhost:5000` (or the port specified in `PORT`).

---

## Environment Variables

Copy `.env.example` to `.env`:

```env
PORT=5000
GEMINI_API_KEY=your_gemini_api_key_here
CORS_ORIGIN=*
```

- `PORT`: Port to listen on (default: `5000`).
- `GEMINI_API_KEY`: (Optional) Google Gemini API key for dynamic multilingual chat. If not provided, the agronomic rule-based response engine serves responses safely.
- `CORS_ORIGIN`: Allowed origins (e.g. `https://your-frontend.vercel.app` or `*`).

---

## Deployment Options

### 1. Deploy on Render (Web Service)
1. Link your repository on [render.com](https://render.com).
2. Choose **Web Service**.
3. Set **Root Directory**: `backend`
4. Set **Build Command**: `npm install`
5. Set **Start Command**: `npm start`
6. Add Environment Variables:
   - `GEMINI_API_KEY`: (your key)
   - `CORS_ORIGIN`: `*` (or your frontend domain)

### 2. Deploy on Railway
1. Create a new service from your GitHub repo.
2. Under service settings, set **Root Directory** to `/backend`.
3. Railway automatically detects `package.json` and runs `npm start`.

### 3. Deploy with Docker / Cloud Run
```bash
cd backend
docker build -t krishialert-backend .
docker run -p 5000:5000 -e GEMINI_API_KEY="xxx" krishialert-backend
```

---

## API Endpoints

- `GET /api/health` - Health check & model metadata
- `POST /api/risk/predict` - XGBoost + SHAP crop risk assessment
- `GET /api/risk/map` - Maharashtra district vulnerability matrix
- `GET /api/risk/district/:name` - Single district drilldown
- `POST /api/simulation/run` - What-if climate stress scenario simulator
- `GET /api/recommendations` - Tailored moisture-saving advisories
- `GET /api/historical/records` - Validation records for past El Niño seasons
- `POST /api/chat` - Krishi AI multilingual advisor
- `POST /api/auth/otp` - Mobile authentication OTP dispatch
- `POST /api/auth/login` - Mobile verification & session login
