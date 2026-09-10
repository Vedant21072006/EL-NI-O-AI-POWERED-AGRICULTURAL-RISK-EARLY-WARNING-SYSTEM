export type Language = 'mr' | 'hi' | 'en';

export type CropStage = 
  | 'germination'
  | 'vegetative'
  | 'flowering'
  | 'pod_development'
  | 'maturity';

export type IrrigationType = 'yes' | 'partial' | 'no';

export type RiskLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';

export interface FarmProfile {
  mobile: string;
  farmerName: string;
  state: string;
  district: string;
  taluka?: string;
  crop: string;
  sowingDate: string;
  cropStage: CropStage;
  irrigation: IrrigationType;
}

export interface RiskDriver {
  id: string;
  name: string;
  icon: string;
  status: string;
  impact: 'high' | 'medium' | 'low';
  direction: 'risk_increasing' | 'risk_decreasing';
  shapValue: number; // e.g. +0.28, internal metric
  simpleExplanation: string;
  measuredValue: string;
  baselineNormal: string;
}

export interface EarlyWarning {
  active: boolean;
  title: string;
  message: string;
  urgency: 'low' | 'moderate' | 'high' | 'critical';
  recommendedActionSnippet: string;
}

export interface Recommendation {
  id: string;
  category: 'water' | 'crop' | 'field';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  action: string;
  rationale: string;
  icon: string;
}

export interface ClimateFeatures {
  ensoStatus: string;
  oniIndex: number;
  rainfallDeficitPct: number;
  tempAnomalyC: number;
  soilMoistureStressPct: number;
  ndviAnomaly: number;
}

export interface RiskAssessment {
  crop: string;
  district: string;
  cropStage: CropStage;
  irrigation: IrrigationType;
  probability: number;
  level: RiskLevel;
  headline: string;
  summary: string;
  potentialYieldImpact: {
    min: number;
    max: number;
    text: string;
  };
  climateFeatures: ClimateFeatures;
  drivers: RiskDriver[];
  earlyWarning: EarlyWarning;
  recommendations: Recommendation[];
  assessmentDate: string;
}

export interface WhatIfSimulationInput {
  district: string;
  crop: string;
  cropStage: CropStage;
  irrigation: IrrigationType;
  rainfallDelta: number; // 0, -10, -20, -30
  tempDelta: number; // 0, 1, 2
  soilMoisture: 'low' | 'normal' | 'high';
}

export interface WhatIfSimulationResult {
  baselineRisk: number;
  scenarioRisk: number;
  delta: number;
  baselineLevel: RiskLevel;
  scenarioLevel: RiskLevel;
  mainReason: string;
  scenarioFeatures: ClimateFeatures;
  topDrivers: string[];
}

export interface DistrictRiskSummary {
  district: string;
  region: 'Marathwada' | 'Vidarbha' | 'Western Maharashtra' | 'North Maharashtra';
  soybeanAreaHectares: number;
  riskProbability: number;
  riskLevel: RiskLevel;
  rainfallDeficitPct: number;
  soilMoistureStress: string;
  primaryCropStage: CropStage;
  potentialYieldLoss: string;
  majorDriver: string;
  recommendedIntervention: string;
  coordinates: { lat: number; lng: number };
}

export interface HistoricalReplayRecord {
  year: number;
  district: string;
  crop: string;
  ensoEvent: string;
  oniPeak: number;
  monsoonRainfallDeficit: string;
  tempAnomaly: string;
  soilCondition: string;
  predictedRiskPct: number;
  predictedRiskLevel: RiskLevel;
  actualYieldDropPct: number;
  actualOutcomeSummary: string;
  keyTakeaway: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestions?: string[];
}
