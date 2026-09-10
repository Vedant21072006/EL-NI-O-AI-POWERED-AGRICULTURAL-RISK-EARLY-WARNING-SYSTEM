import { RiskAssessment } from '../types';

export const INITIAL_ASSESSMENT: RiskAssessment = {
  crop: 'Soybean',
  district: 'Latur',
  cropStage: 'flowering',
  irrigation: 'partial',
  probability: 74,
  level: 'HIGH',
  headline: 'Significant Climate Risk Detected',
  summary: 'Your soybean crop in Latur is under significant drought stress during the critical flowering stage.',
  potentialYieldImpact: {
    min: 25,
    max: 35,
    text: 'Estimated -25% to -35% yield reduction without intervention'
  },
  climateFeatures: {
    ensoStatus: 'El Niño Active (Advisory)',
    oniIndex: 1.4,
    rainfallDeficitPct: -32,
    tempAnomalyC: 1.8,
    soilMoistureStressPct: 35,
    ndviAnomaly: -0.27
  },
  drivers: [
    {
      id: 'rainfall',
      name: 'Rainfall Condition',
      icon: 'CloudRain',
      status: 'Significant Deficit',
      impact: 'medium',
      direction: 'risk_increasing',
      shapValue: 0.154,
      simpleExplanation: 'Rainfall in Latur is 32% below the historical normal for this period.',
      measuredValue: '-32%',
      baselineNormal: '0% anomaly (historical avg)'
    },
    {
      id: 'vegetation',
      name: 'Vegetation Health (NDVI)',
      icon: 'Sprout',
      status: 'Stress Detected',
      impact: 'high',
      direction: 'risk_increasing',
      shapValue: 0.149,
      simpleExplanation: 'Satellite NDVI indicates declining crop canopy vigor compared to past healthy years.',
      measuredValue: '-0.27 deviation',
      baselineNormal: '0.00 (Healthy canopy)'
    },
    {
      id: 'temperature',
      name: 'Temperature',
      icon: 'Thermometer',
      status: 'Above Normal',
      impact: 'high',
      direction: 'risk_increasing',
      shapValue: 0.132,
      simpleExplanation: 'Daytime temperature is 1.8°C above normal, accelerating evapotranspiration.',
      measuredValue: '+1.8°C',
      baselineNormal: 'Normal seasonal range'
    },
    {
      id: 'soil_moisture',
      name: 'Soil Moisture',
      icon: 'Droplets',
      status: 'Moderate Stress',
      impact: 'medium',
      direction: 'risk_increasing',
      shapValue: 0.122,
      simpleExplanation: 'Soil moisture is showing stress conditions in root zone (0-30cm).',
      measuredValue: '35% stress index',
      baselineNormal: '< 15% stress index'
    },
    {
      id: 'enso',
      name: 'El Niño (ENSO) Signal',
      icon: 'Waves',
      status: 'Advisory Active',
      impact: 'medium',
      direction: 'risk_increasing',
      shapValue: 0.101,
      simpleExplanation: 'Pacific Ocean surface warming (ONI +1.4°C) historically suppresses late monsoon rains in Maharashtra.',
      measuredValue: '+1.4°C ONI',
      baselineNormal: 'Neutral (-0.5°C to +0.5°C)'
    }
  ],
  earlyWarning: {
    active: true,
    title: 'Crop Stress Risk is Increasing',
    message: 'High climate stress detected in Latur. The combination of low rainfall and thermal stress during flowering creates severe risk of yield loss.',
    urgency: 'high',
    recommendedActionSnippet: 'Provide one light protective irrigation in furrows during evening hours.'
  },
  recommendations: [
    {
      id: 'water-1',
      category: 'water',
      priority: 'HIGH',
      title: 'Targeted Protective Irrigation',
      action: 'Apply one light protective irrigation (30-40mm) in alternate furrows during evening hours.',
      rationale: 'Soybean flowering is the most moisture-critical window. Alternate furrow irrigation saves 35% water while preventing flower abortion.',
      icon: 'Droplet'
    },
    {
      id: 'crop-flowering',
      category: 'crop',
      priority: 'HIGH',
      title: 'Anti-Stress Foliar Nutrition',
      action: 'Spray 1% Potassium Nitrate (13-0-45) or 2% Urea on foliage during morning or late afternoon.',
      rationale: 'Potassium spray regulates stomatal opening, reduces transpiration loss by 20%, and arrests flower drop during dry spells.',
      icon: 'SprayCan'
    },
    {
      id: 'field-mulch',
      category: 'field',
      priority: 'HIGH',
      title: 'In-Situ Mulching & Dust Mulch',
      action: 'Perform shallow intercultural hoeing (कोळपणी) to break soil crust and create an insulating dust mulch.',
      rationale: 'Dust mulching breaks soil capillary pores, stopping evaporation and keeping subsurface moisture intact for 7-10 extra days.',
      icon: 'Layers'
    }
  ],
  assessmentDate: new Date().toISOString()
};
