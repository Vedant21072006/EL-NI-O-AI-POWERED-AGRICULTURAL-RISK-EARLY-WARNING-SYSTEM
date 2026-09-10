# 🚀 KrishiAlert Deployment Guide

KrishiAlert is architected with a decoupled structure having independent **`frontend/`** and **`backend/`** folders, allowing you to deploy both services to different hosting providers (e.g. Frontend on Vercel and Backend on Render), or run them together in a single container.

---

## Directory Structure

```
├── backend/                # Standalone Node.js / Express API Backend
│   ├── data/               # Maharashtra district baselines & historical records
│   ├── .env.example        # Backend environment variables template
│   ├── Dockerfile          # Production container build
│   ├── package.json        # Backend dependencies and scripts
│   ├── README.md           # Backend-specific instructions
│   ├── server.ts           # Standalone Express API entry point
│   ├── mlEngine.ts         # XGBoost risk scoring & Agronomic rule engine
│   ├── chatEngine.ts       # Krishi AI assistant integration
│   ├── types.ts            # Shared API data models
│   └── tsconfig.json       # Backend TypeScript config
│
├── frontend/               # Standalone React 19 + Vite + Tailwind Frontend
│   ├── public/             # Static assets & icons
│   ├── src/                # React UI components, i18n, services
│   ├── .env.example        # Frontend environment variables template
│   ├── index.html          # SPA HTML entry point
│   ├── package.json        # Frontend dependencies and scripts
│   ├── README.md           # Frontend-specific instructions
│   ├── tsconfig.json       # Frontend TypeScript config
│   └── vite.config.ts      # Vite bundler configuration & local API proxy
│
├── package.json            # Monorepo root orchestration
├── metadata.json           # Application metadata
└── DEPLOYMENT.md           # This deployment guide
```

---

## Step 1: Deploy the Backend First

Deploy your backend first so you have the backend URL to provide to the frontend.

### Option A: Deploy to Render (Recommended - Free & Easy)
1. Go to [render.com](https://render.com) and create a **Web Service**.
2. Connect your GitHub repository.
3. Configure the service settings:
   - **Name**: `krishialert-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add Environment Variables:
   - `PORT`: `5000` (or leave default assigned by Render)
   - `CORS_ORIGIN`: `*` (or your frontend domain once deployed)
   - `GEMINI_API_KEY`: *(Optional)* Your Google Gemini API Key
5. Click **Create Web Service**.
6. Copy your public backend URL (e.g. `https://krishialert-backend.onrender.com`).

### Option B: Deploy to Railway
1. Go to [railway.app](https://railway.app) and create a **New Project**.
2. Select **Deploy from GitHub repo**.
3. Under service settings, set **Root Directory** to `/backend`.
4. Add variable `GEMINI_API_KEY` (optional).
5. Railway will automatically build and expose a public domain.

### Option C: Deploy with Docker / Google Cloud Run
```bash
cd backend
docker build -t krishialert-backend .
# Deploy container to Google Cloud Run, AWS ECS, or Fly.io
```

Verify the backend is live by opening:
`https://<your-backend-url>/api/health`

---

## Step 2: Deploy the Frontend

### Option A: Deploy to Vercel (Recommended)
1. Go to [vercel.com](https://vercel.com) and click **Add New Project**.
2. Import your GitHub repository.
3. In the project configuration:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click edit and select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Expand **Environment Variables** and add:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://<your-backend-url>` (e.g. `https://krishialert-backend.onrender.com`)
5. Click **Deploy**.

### Option B: Deploy to Netlify
1. Go to [netlify.com](https://netlify.com) and select **Add new site** > **Import an existing project**.
2. Set:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`
3. In **Environment variables**, set `VITE_API_BASE_URL` to your backend URL.
4. Click **Deploy site**.

---

## Step 3: Local Development (Testing Separate Folders)

To run both services locally on your machine:

**Terminal 1 (Backend API on port 5000):**
```bash
cd backend
npm install
npm run dev
```

**Terminal 2 (Frontend SPA on port 5173):**
```bash
cd frontend
npm install
npm run dev
```

The frontend Vite dev server will run on `http://localhost:5173` and automatically proxy all `/api/*` requests to `http://localhost:5000`.
