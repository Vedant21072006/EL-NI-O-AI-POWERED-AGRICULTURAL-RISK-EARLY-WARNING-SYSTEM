import {
  CropStage,
  IrrigationType,
  RiskLevel,
  RiskAssessment,
  RiskDriver,
  EarlyWarning,
  Recommendation,
  ClimateFeatures,
  WhatIfSimulationInput,
  WhatIfSimulationResult
} from '../src/types';
import { MAHARASHTRA_DISTRICTS } from '../src/data/maharashtraDistricts';

// Crop stage vulnerability weights for Soybean (Flowering & Pod dev are critically drought-sensitive)
const STAGE_WEIGHTS: Record<CropStage, number> = {
  germination: 0.65,
  vegetative: 0.50,
  flowering: 0.95,      // Moisture stress causes massive flower drop
  pod_development: 0.88, // Moisture stress causes flat/shriveled pods
  maturity: 0.25        // Moisture stress near harvest has low negative impact
};

// Irrigation mitigation factors
const IRRIGATION_MODIFIERS: Record<IrrigationType, number> = {
  yes: -0.32,      // Full irrigation drastically buffers climate hazard
  partial: -0.15,  // Partial protective irrigation provides moderate buffer
  no: 0.18         // Rainfed soybean absorbs full climate shock
};

/**
 * Baseline district climate conditions in Maharashtra during current El Niño alert
 */
export function getDistrictBaseline(districtName: string) {
  const match = MAHARASHTRA_DISTRICTS.find(
    (d) => d.district.toLowerCase() === districtName.toLowerCase()
  );
  if (match) {
    return {
      district: match.district,
      region: match.region,
      rainfallDeficitPct: match.rainfallDeficitPct,
      tempAnomalyC: match.riskLevel === 'CRITICAL' ? 2.2 : match.riskLevel === 'HIGH' ? 1.8 : 1.2,
      soilMoistureStressPct: Math.abs(parseInt(match.soilMoistureStress.match(/-?\d+/)?.[0] || '25', 10)),
      ndviAnomaly: match.riskLevel === 'CRITICAL' ? -0.28 : match.riskLevel === 'HIGH' ? -0.19 : -0.10,
      ensoStatus: 'El Niño Active (Advisory)',
      oniIndex: 1.4 // Current Oceanic Niño Index anomaly in °C
    };
  }

  // Default fallback for other Maharashtra districts
  return {
    district: districtName,
    region: 'Maharashtra',
    rainfallDeficitPct: -22,
    tempAnomalyC: 1.5,
    soilMoistureStressPct: 25,
    ndviAnomaly: -0.15,
    ensoStatus: 'El Niño Active (Advisory)',
    oniIndex: 1.4
  };
}

/**
 * Predict Agricultural Risk using simulated XGBoost Decision Tree ensemble
 * and calculate SHAP (Shapley Additive exPlanations) values for feature attribution.
 */
export function predictAgriculturalRisk(
  district: string,
  crop: string = 'soybean',
  cropStage: CropStage = 'flowering',
  irrigation: IrrigationType = 'partial',
  scenarioOverrides?: {
    rainfallDelta?: number;
    tempDelta?: number;
    soilMoisture?: 'low' | 'normal' | 'high';
  }
): RiskAssessment {
  const base = getDistrictBaseline(district);

  // Apply scenario overrides if provided (for What-If simulation)
  let rainDeficit = base.rainfallDeficitPct + (scenarioOverrides?.rainfallDelta ?? 0);
  let tempAnomaly = base.tempAnomalyC + (scenarioOverrides?.tempDelta ?? 0);
  let soilStress = base.soilMoistureStressPct;

  if (scenarioOverrides?.soilMoisture === 'low') {
    soilStress = Math.min(65, soilStress + 20); // Low soil moisture = high stress
  } else if (scenarioOverrides?.soilMoisture === 'high') {
    soilStress = Math.max(5, soilStress - 20); // High soil moisture = low stress
  }

  let ndvi = base.ndviAnomaly;
  // If rainfall deficit is worse, NDVI typically drops
  if (rainDeficit < -30) ndvi -= 0.08;

  const stageFactor = STAGE_WEIGHTS[cropStage] || 0.7;
  const irrigationMod = IRRIGATION_MODIFIERS[irrigation] || 0;

  // --- XGBoost Scoring Proxy ---
  // Base expectation E[f(x)] across all soybean Kharif historical seasons in Maharashtra
  const baseRate = 0.35; // 35% base historical climate risk in rainfed zones

  // Marginal contributions (mimicking Shapley values in additive tree model)
  // phi_rain: impact of rainfall deficit
  const phi_rain = Math.max(-0.15, (-rainDeficit / 100) * 0.48);

  // phi_temp: impact of heat anomaly
  const phi_temp = Math.max(-0.05, (tempAnomaly / 3.0) * 0.22);

  // phi_soil: impact of soil moisture stress
  const phi_soil = (soilStress / 100) * 0.35;

  // phi_ndvi: impact of satellite vegetation degradation
  const phi_ndvi = Math.abs(Math.min(0, ndvi)) * 0.55;

  // phi_enso: background El Niño ONI teleconnection index
  const phi_enso = (base.oniIndex / 2.5) * 0.18;

  // Interaction term: Vulnerable crop stage * water stress
  const rawSum = baseRate + phi_rain + phi_temp + phi_soil + phi_ndvi + phi_enso;
  const stageInteraction = (rawSum * stageFactor) - (rawSum * 0.6);

  // Irrigation buffering
  const irrigationBuffer = irrigationMod * (rawSum);

  // Final calibrated probability
  let finalProb = Math.min(0.96, Math.max(0.12, rawSum + stageInteraction + irrigationBuffer));
  const probabilityPct = Math.round(finalProb * 100);

  // Determine Risk Level
  let level: RiskLevel = 'LOW';
  if (probabilityPct >= 80) {
    level = 'CRITICAL';
  } else if (probabilityPct >= 65) {
    level = 'HIGH';
  } else if (probabilityPct >= 38) {
    level = 'MODERATE';
  } else {
    level = 'LOW';
  }

  // Potential Yield Impact (model regression estimate based on water deficit & stage)
  let minYieldDrop = 0;
  let maxYieldDrop = 0;

  if (level === 'CRITICAL') {
    minYieldDrop = Math.round(probabilityPct * 0.45);
    maxYieldDrop = Math.min(65, Math.round(probabilityPct * 0.62));
  } else if (level === 'HIGH') {
    minYieldDrop = Math.round(probabilityPct * 0.32);
    maxYieldDrop = Math.round(probabilityPct * 0.48);
  } else if (level === 'MODERATE') {
    minYieldDrop = Math.max(5, Math.round(probabilityPct * 0.18));
    maxYieldDrop = Math.round(probabilityPct * 0.30);
  } else {
    minYieldDrop = 0;
    maxYieldDrop = 8;
  }

  const potentialYieldImpact = {
    min: minYieldDrop,
    max: maxYieldDrop,
    text: level === 'LOW' ? 'Normal to minimal impact (0 - 8%)' : `Estimated -${minYieldDrop}% to -${maxYieldDrop}% yield reduction without intervention`
  };

  // Human-interpretable SHAP Driver Cards
  const drivers: RiskDriver[] = [
    {
      id: 'rainfall',
      name: 'Rainfall Condition',
      icon: 'CloudRain',
      status: rainDeficit < -25 ? 'Significant Deficit' : rainDeficit < -10 ? 'Below Normal' : 'Near Normal',
      impact: phi_rain > 0.18 ? 'high' : phi_rain > 0.08 ? 'medium' : 'low',
      direction: rainDeficit < -15 ? 'risk_increasing' : 'risk_decreasing',
      shapValue: Number(phi_rain.toFixed(3)),
      simpleExplanation: rainDeficit < -20
        ? `Rainfall in ${district} is ${Math.abs(rainDeficit)}% below the historical normal for this period.`
        : `Rainfall is tracking close to seasonal average with mild local variation.`,
      measuredValue: `${rainDeficit > 0 ? '+' : ''}${rainDeficit}%`,
      baselineNormal: '0% anomaly (historical avg)'
    },
    {
      id: 'soil_moisture',
      name: 'Soil Moisture',
      icon: 'Droplets',
      status: soilStress > 35 ? 'High Stress' : soilStress > 20 ? 'Moderate Stress' : 'Adequate',
      impact: phi_soil > 0.14 ? 'high' : phi_soil > 0.08 ? 'medium' : 'low',
      direction: soilStress > 25 ? 'risk_increasing' : 'risk_decreasing',
      shapValue: Number(phi_soil.toFixed(3)),
      simpleExplanation: soilStress > 25
        ? 'Soil moisture is showing stress conditions in root zone (0-30cm).'
        : 'Root zone moisture is currently adequate for vegetative development.',
      measuredValue: `${soilStress}% stress index`,
      baselineNormal: '< 15% stress index'
    },
    {
      id: 'temperature',
      name: 'Temperature',
      icon: 'Thermometer',
      status: tempAnomaly > 1.5 ? 'Above Normal' : 'Moderate',
      impact: phi_temp > 0.12 ? 'high' : phi_temp > 0.06 ? 'medium' : 'low',
      direction: tempAnomaly > 1.0 ? 'risk_increasing' : 'risk_decreasing',
      shapValue: Number(phi_temp.toFixed(3)),
      simpleExplanation: tempAnomaly > 1.2
        ? `Daytime temperature is ${tempAnomaly.toFixed(1)}°C above normal, accelerating evapotranspiration.`
        : 'Temperature is within normal vegetative tolerance limits.',
      measuredValue: `+${tempAnomaly.toFixed(1)}°C`,
      baselineNormal: 'Normal seasonal range'
    },
    {
      id: 'vegetation',
      name: 'Vegetation Health (NDVI)',
      icon: 'Sprout',
      status: ndvi < -0.15 ? 'Stress Detected' : 'Fair Condition',
      impact: phi_ndvi > 0.12 ? 'high' : 'medium',
      direction: ndvi < -0.12 ? 'risk_increasing' : 'risk_decreasing',
      shapValue: Number(phi_ndvi.toFixed(3)),
      simpleExplanation: ndvi < -0.12
        ? 'Satellite NDVI indicates declining crop canopy vigor compared to past healthy years.'
        : 'Satellite vegetation index reflects healthy green canopy expansion.',
      measuredValue: `${ndvi.toFixed(2)} deviation`,
      baselineNormal: '0.00 (Healthy canopy)'
    },
    {
      id: 'enso',
      name: 'El Niño (ENSO) Signal',
      icon: 'Waves',
      status: 'Advisory Active',
      impact: 'medium',
      direction: 'risk_increasing',
      shapValue: Number(phi_enso.toFixed(3)),
      simpleExplanation: 'Pacific Ocean surface warming (ONI +1.4°C) historically suppresses late monsoon rains in Maharashtra.',
      measuredValue: `+${base.oniIndex}°C ONI`,
      baselineNormal: 'Neutral (-0.5°C to +0.5°C)'
    }
  ];

  // Sort drivers by SHAP importance
  drivers.sort((a, b) => b.shapValue - a.shapValue);

  // Decision Engine: Early Warning
  const isHighRisk = probabilityPct >= 65;
  const isFlowering = cropStage === 'flowering' || cropStage === 'pod_development';
  const hasNoWater = irrigation === 'no';

  let earlyWarning: EarlyWarning = {
    active: isHighRisk || (isFlowering && rainDeficit < -18),
    title: isHighRisk ? 'Crop Stress Risk is Increasing' : 'Potential Moisture Stress Warning',
    message: isHighRisk
      ? `High climate stress detected in ${district}. The combination of low rainfall and thermal stress during ${cropStage} creates severe risk of yield loss.`
      : `Moderate climate variability observed. Monitoring soil moisture closely is recommended.`,
    urgency: level === 'CRITICAL' ? 'critical' : level === 'HIGH' ? 'high' : 'moderate',
    recommendedActionSnippet: hasNoWater
      ? 'Conserve existing soil moisture using straw mulching or dust-mulch hoeing immediately.'
      : 'Provide one light protective irrigation in furrows during evening hours.'
  };

  // Decision Engine: Recommendations
  const recommendations: Recommendation[] = generateDecisionEngineRecommendations(
    cropStage,
    irrigation,
    level,
    soilStress,
    rainDeficit
  );

  return {
    crop: 'Soybean',
    district,
    cropStage,
    irrigation,
    probability: probabilityPct,
    level,
    headline: level === 'CRITICAL' 
      ? 'Severe Climate Risk'
      : level === 'HIGH'
      ? 'High Climate Risk'
      : level === 'MODERATE'
      ? 'Moderate Climate Risk'
      : 'Low Climate Risk',
    summary: level === 'CRITICAL'
      ? `Your soybean crop in ${district} is under critical drought stress during the ${cropStage} stage.`
      : level === 'HIGH'
      ? `Your crop is currently showing elevated climate-related stress in ${district}. Timely interventions are essential.`
      : level === 'MODERATE'
      ? `Your crop is currently showing moderate climate-related risk. Monitoring is recommended.`
      : `Your crop is currently showing low climate-related risk with stable moisture indicators.`,
    potentialYieldImpact,
    climateFeatures: {
      ensoStatus: base.ensoStatus,
      oniIndex: base.oniIndex,
      rainfallDeficitPct: rainDeficit,
      tempAnomalyC: tempAnomaly,
      soilMoistureStressPct: soilStress,
      ndviAnomaly: ndvi
    },
    drivers,
    earlyWarning,
    recommendations,
    assessmentDate: new Date().toISOString()
  };
}

/**
 * Agronomic Decision Engine: Generates strict, vetted recommendations
 * based on agronomic rules (Vasantrao Naik Marathwada Krishi Vidyapeeth / ICAR Soybean rules).
 */
function generateDecisionEngineRecommendations(
  cropStage: CropStage,
  irrigation: IrrigationType,
  riskLevel: RiskLevel,
  soilStress: number,
  rainDeficit: number
): Recommendation[] {
  const recs: Recommendation[] = [];

  // 1. Water Management
  if (irrigation === 'yes' || irrigation === 'partial') {
    if (cropStage === 'flowering' || cropStage === 'pod_development') {
      recs.push({
        id: 'water-1',
        category: 'water',
        priority: 'HIGH',
        title: 'Targeted Protective Irrigation',
        action: 'Apply one light protective irrigation (30-40mm) in alternate furrows during evening hours.',
        rationale: 'Soybean flowering is the most moisture-critical window. Alternate furrow irrigation saves 35% water while preventing flower abortion.',
        icon: 'Droplet'
      });
    } else {
      recs.push({
        id: 'water-2',
        category: 'water',
        priority: soilStress > 30 ? 'HIGH' : 'MEDIUM',
        title: 'Check Soil Moisture Before Irrigating',
        action: 'Avoid unnecessary heavy irrigation if root zone soil holds a cohesive ball when squeezed.',
        rationale: 'Over-irrigation in heavy black cotton soil can cause temporary root asphyxiation and collar rot.',
        icon: 'Gauge'
      });
    }
  } else {
    // Rainfed only
    recs.push({
      id: 'water-rainfed',
      category: 'water',
      priority: 'HIGH',
      title: 'Moisture Retention & Rainwater Harvesting',
      action: 'Open dead furrows every 3-4 rows to catch any intermittent rainfall and channel runoff to farm pond.',
      rationale: 'Opening dead furrows retains up to 25-30% more in-situ rain water in drought-prone Marathwada soils.',
      icon: 'Waves'
    });
  }

  // 2. Crop Management
  if (cropStage === 'flowering' || cropStage === 'pod_development') {
    recs.push({
      id: 'crop-flowering',
      category: 'crop',
      priority: riskLevel === 'HIGH' || riskLevel === 'CRITICAL' ? 'HIGH' : 'MEDIUM',
      title: 'Anti-Stress Foliar Nutrition',
      action: 'Spray 1% Potassium Nitrate (13-0-45) or 2% Urea on foliage during morning or late afternoon.',
      rationale: 'Potassium spray regulates stomatal opening, reduces transpiration loss by 20%, and arrests flower drop during dry spells.',
      icon: 'SprayCan'
    });
  } else if (cropStage === 'vegetative') {
    recs.push({
      id: 'crop-veg',
      category: 'crop',
      priority: 'MEDIUM',
      title: 'Canopy & Weed Management',
      action: 'Keep the field strictly weed-free via manual weeding or intercultural hoeing.',
      rationale: 'Weeds compete aggressively for limited soil moisture and fertilizer nutrients during early growth.',
      icon: 'Scissors'
    });
  } else {
    recs.push({
      id: 'crop-general',
      category: 'crop',
      priority: 'LOW',
      title: 'Crop Health Surveillance',
      action: 'Regularly inspect under-surfaces of soybean leaves for early signs of mites or thrips.',
      rationale: 'Warm, dry El Niño spells favor sudden outbreaks of sucking pests in soybean.',
      icon: 'Eye'
    });
  }

  // 3. Field Management
  recs.push({
    id: 'field-mulch',
    category: 'field',
    priority: riskLevel === 'CRITICAL' || riskLevel === 'HIGH' ? 'HIGH' : 'MEDIUM',
    title: 'In-Situ Mulching & Dust Mulch',
    action: 'Perform shallow intercultural hoeing (कोळपणी) to break soil crust and create an insulating dust mulch.',
    rationale: 'Dust mulching breaks soil capillary pores, stopping evaporation and keeping subsurface moisture intact for 7-10 extra days.',
    icon: 'Layers'
  });

  return recs;
}

/**
 * Runs What-If Simulation
 */
export function runWhatIfSimulation(input: WhatIfSimulationInput): WhatIfSimulationResult {
  const currentAssessment = predictAgriculturalRisk(
    input.district,
    input.crop,
    input.cropStage,
    input.irrigation
  );

  const scenarioAssessment = predictAgriculturalRisk(
    input.district,
    input.crop,
    input.cropStage,
    input.irrigation,
    {
      rainfallDelta: input.rainfallDelta,
      tempDelta: input.tempDelta,
      soilMoisture: input.soilMoisture
    }
  );

  const delta = scenarioAssessment.probability - currentAssessment.probability;

  // Determine main reason for change
  let mainReasons: string[] = [];
  if (input.rainfallDelta < 0) {
    mainReasons.push(`Increased rainfall deficit (${input.rainfallDelta}%)`);
  }
  if (input.tempDelta > 0) {
    mainReasons.push(`Higher temperature (+${input.tempDelta}°C)`);
  }
  if (input.soilMoisture === 'low') {
    mainReasons.push('Critical soil moisture depletion');
  } else if (input.soilMoisture === 'high') {
    mainReasons.push('Subsurface moisture replenishment');
  }

  const mainReason = mainReasons.length > 0 
    ? mainReasons.join(' and ') 
    : 'Identical scenario conditions';

  return {
    baselineRisk: currentAssessment.probability,
    scenarioRisk: scenarioAssessment.probability,
    delta,
    baselineLevel: currentAssessment.level,
    scenarioLevel: scenarioAssessment.level,
    mainReason,
    scenarioFeatures: scenarioAssessment.climateFeatures,
    topDrivers: scenarioAssessment.drivers.slice(0, 3).map((d) => d.name)
  };
}
