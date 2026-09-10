# 🌾 KrishiAlert Frontend (React + Vite + Tailwind CSS)

Standalone frontend single-page application for the **KrishiAlert El Niño Agricultural Risk & Early Warning System**.

---

## Features

- **Multilingual Support**: Instant toggle between मराठी (Marathi), हिंदी (Hindi), and English.
- **Farmer Authentication**: Quick mobile + OTP verification with one-click demo.
- **Risk Dashboard**: Gauges, early warnings, and human-readable driver explanations.
- **Advisory Engine**: Categorized moisture-conservation recommendations (Water, Crop, Field).
- **What-If Climate Simulator**: Live slider simulation of rainfall deficits and thermal stress.
- **Krishi AI Chat Assistant**: Floating advisor with built-in voice read-aloud.
- **Officer Matrix**: Maharashtra district heat map and vulnerability rankings.
- **Historical Validation**: 2015, 2009, 2023, 2019 El Niño replay records.

---

## Local Development

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173`. When running alongside the backend (`http://localhost:5000`), requests to `/api/*` are automatically proxied.

---

## Environment Variables

Copy `.env.example` to `.env`:

```env
# URL of your deployed backend service:
VITE_API_BASE_URL=https://your-backend-service.onrender.com
```

*Note: If `VITE_API_BASE_URL` is left empty, the frontend makes relative requests (`/api/...`), which is ideal when using a proxy or when hosted under the same domain.*

---

## Deployment Options

### 1. Deploy on Vercel
1. Import your GitHub repository on [Vercel](https://vercel.com).
2. Set **Root Directory** to `frontend`.
3. Build Command: `npm run build` (or `vite build`).
4. Output Directory: `dist`.
5. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL`: `https://your-backend-api.onrender.com`
6. Click **Deploy**.

### 2. Deploy on Netlify
1. Connect repo on [Netlify](https://netlify.com).
2. Base directory: `frontend`.
3. Build command: `npm run build`.
4. Publish directory: `dist`.
5. Add `VITE_API_BASE_URL` in environment settings.

### 3. Deploy on Cloudflare Pages / Firebase Hosting
1. Run `cd frontend && npm install && npm run build`.
2. Upload the generated `dist/` directory or connect via GitHub.
