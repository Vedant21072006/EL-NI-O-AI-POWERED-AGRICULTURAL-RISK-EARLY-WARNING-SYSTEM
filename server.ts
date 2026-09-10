import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import cors from 'cors';
import { createServer as createViteServer } from 'vite';
import {
  predictAgriculturalRisk,
  runWhatIfSimulation,
  getDistrictBaseline
} from './server/mlEngine';
import { handleKrishiChat } from './server/chatEngine';
import { MAHARASHTRA_DISTRICTS, HISTORICAL_RECORDS } from './src/data/maharashtraDistricts';
import { CropStage, IrrigationType } from './src/types';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors({
  origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true,
  credentials: true
}));
app.use(express.json());

// In-memory demo store for farmer sessions
interface FarmerUser {
  mobile: string;
  name: string;
  district: string;
  taluka: string;
  crop: string;
  sowingDate: string;
  cropStage: CropStage;
  irrigation: IrrigationType;
}

const usersStore: Map<string, FarmerUser> = new Map([
  [
    '9876543210',
    {
      mobile: '9876543210',
      name: 'Ramesh Patil',
      district: 'Latur',
      taluka: 'Ausa',
      crop: 'Soybean',
      sowingDate: '2026-06-20',
      cropStage: 'flowering',
      irrigation: 'partial'
    }
  ]
]);

// ---------------- API ROUTES ----------------

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'KrishiAlert El Niño Risk Engine',
    model: 'XGBoost Agricultural Risk v1.4 + SHAP',
    timestamp: new Date().toISOString()
  });
});

// Auth / OTP
app.post('/api/auth/otp', (req, res) => {
  const { mobile } = req.body;
  if (!mobile || mobile.length < 10) {
    return res.status(400).json({ error: 'Valid 10-digit mobile number required' });
  }
  // Simulated OTP for rapid farmer onboarding (demo accepts any 6-digit OTP or '123456')
  res.json({
    success: true,
    message: 'OTP sent successfully to +91 ' + mobile,
    demoOtp: '123456'
  });
});

app.post('/api/auth/login', (req, res) => {
  const { mobile, otp } = req.body;
  if (!mobile) {
    return res.status(400).json({ error: 'Mobile number required' });
  }

  // Get or seed default profile
  let user = usersStore.get(mobile);
  if (!user) {
    user = {
      mobile,
      name: 'Farmer ' + mobile.slice(-4),
      district: 'Latur',
      taluka: 'Latur',
      crop: 'Soybean',
      sowingDate: '2026-06-22',
      cropStage: 'flowering',
      irrigation: 'partial'
    };
    usersStore.set(mobile, user);
  }

  res.json({
    success: true,
    user,
    token: 'mock-jwt-token-' + mobile
  });
});

app.post('/api/auth/register', (req, res) => {
  const { mobile, name, district, taluka, crop, sowingDate, cropStage, irrigation } = req.body;
  if (!mobile) {
    return res.status(400).json({ error: 'Mobile number required' });
  }

  const user: FarmerUser = {
    mobile,
    name: name || 'Soybean Farmer',
    district: district || 'Latur',
    taluka: taluka || '',
    crop: crop || 'Soybean',
    sowingDate: sowingDate || '2026-06-20',
    cropStage: cropStage || 'flowering',
    irrigation: irrigation || 'partial'
  };

  usersStore.set(mobile, user);
  res.json({ success: true, user });
});

app.get('/api/profile', (req, res) => {
  const mobile = (req.query.mobile as string) || '9876543210';
  const user = usersStore.get(mobile) || usersStore.get('9876543210');
  res.json({ user });
});

// Risk Prediction Endpoint (XGBoost + SHAP)
app.post('/api/risk/predict', (req, res) => {
  try {
    const { district, crop, cropStage, irrigation } = req.body;
    const cleanDistrict = district || 'Latur';
    const cleanCrop = crop || 'Soybean';
    const cleanStage = (cropStage as CropStage) || 'flowering';
    const cleanIrrigation = (irrigation as IrrigationType) || 'partial';

    const assessment = predictAgriculturalRisk(
      cleanDistrict,
      cleanCrop,
      cleanStage,
      cleanIrrigation
    );

    res.json({
      success: true,
      assessment
    });
  } catch (err: any) {
    console.error('Prediction error:', err);
    res.status(500).json({ error: 'Failed to compute risk prediction', details: err.message });
  }
});

// District Map data
app.get('/api/risk/map', (req, res) => {
  res.json({
    success: true,
    state: 'Maharashtra',
    ensoAdvisory: 'Active El Niño (ONI +1.4°C)',
    districts: MAHARASHTRA_DISTRICTS
  });
});

// Single district drill-down
app.get('/api/risk/district/:district', (req, res) => {
  const districtName = req.params.district;
  const match = MAHARASHTRA_DISTRICTS.find(
    (d) => d.district.toLowerCase() === districtName.toLowerCase()
  );

  if (!match) {
    return res.status(404).json({ error: 'District not found in Maharashtra dataset' });
  }

  const assessment = predictAgriculturalRisk(
    match.district,
    'Soybean',
    match.primaryCropStage,
    'partial'
  );

  res.json({
    success: true,
    districtSummary: match,
    assessment
  });
});

// What-If Simulator
app.post('/api/simulation/run', (req, res) => {
  try {
    const { district, crop, cropStage, irrigation, rainfallDelta, tempDelta, soilMoisture } = req.body;

    const result = runWhatIfSimulation({
      district: district || 'Latur',
      crop: crop || 'Soybean',
      cropStage: (cropStage as CropStage) || 'flowering',
      irrigation: (irrigation as IrrigationType) || 'partial',
      rainfallDelta: Number(rainfallDelta) || 0,
      tempDelta: Number(tempDelta) || 0,
      soilMoisture: soilMoisture || 'normal'
    });

    res.json({
      success: true,
      result
    });
  } catch (err: any) {
    console.error('Simulation error:', err);
    res.status(500).json({ error: 'Simulation failed', details: err.message });
  }
});

// Recommendations Endpoint
app.get('/api/recommendations', (req, res) => {
  const district = (req.query.district as string) || 'Latur';
  const cropStage = ((req.query.cropStage as string) as CropStage) || 'flowering';
  const irrigation = ((req.query.irrigation as string) as IrrigationType) || 'partial';

  const assessment = predictAgriculturalRisk(district, 'Soybean', cropStage, irrigation);
  res.json({
    success: true,
    recommendations: assessment.recommendations,
    earlyWarning: assessment.earlyWarning
  });
});

// Historical Replay Records
app.get('/api/historical/records', (req, res) => {
  res.json({
    success: true,
    records: HISTORICAL_RECORDS
  });
});

// Krishi AI Chatbot
app.post('/api/chat', async (req, res) => {
  try {
    const { message, farmProfile, assessment, language } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message required' });
    }

    const context = {
      farmProfile: farmProfile || {
        district: 'Latur',
        crop: 'Soybean',
        cropStage: 'flowering',
        irrigation: 'partial'
      },
      assessment,
      language: language || 'mr'
    };

    const response = await handleKrishiChat(message, context);
    res.json({
      success: true,
      reply: response.reply,
      suggestions: response.suggestions
    });
  } catch (err: any) {
    console.error('Chat endpoint error:', err);
    res.status(500).json({
      success: false,
      error: 'Failed to process chat message',
      reply: 'Namaskar! Krishi AI is momentarily busy. Please check your recommendations page or try again in a few moments.'
    });
  }
});

// ---------------- VITE MIDDLEWARE / STATIC ----------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌾 KrishiAlert El Niño Risk Engine running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
