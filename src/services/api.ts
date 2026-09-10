import {
  RiskAssessment,
  WhatIfSimulationInput,
  WhatIfSimulationResult,
  DistrictRiskSummary,
  HistoricalReplayRecord,
  Language,
  FarmProfile
} from '../types';

// Supports standalone frontend deployment pointing to external backend via VITE_API_BASE_URL
const API_BASE = ((import.meta as any).env?.VITE_API_BASE_URL || '').replace(/\/$/, '');

export async function fetchRiskPrediction(data: {
  district: string;
  crop: string;
  sowingDate?: string;
  cropStage: string;
  irrigation: string;
}): Promise<RiskAssessment> {
  const res = await fetch(`${API_BASE}/api/risk/predict`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to fetch risk prediction');
  }

  const json = await res.json();
  return json.assessment;
}

export async function fetchDistrictMap(): Promise<{
  state: string;
  ensoAdvisory: string;
  districts: DistrictRiskSummary[];
}> {
  const res = await fetch(`${API_BASE}/api/risk/map`);
  if (!res.ok) {
    throw new Error('Failed to fetch district map data');
  }
  return await res.json();
}

export async function runSimulation(input: WhatIfSimulationInput): Promise<WhatIfSimulationResult> {
  const res = await fetch(`${API_BASE}/api/simulation/run`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  });

  if (!res.ok) {
    throw new Error('Failed to run what-if simulation');
  }

  const json = await res.json();
  return json.result;
}

export async function fetchHistoricalRecords(): Promise<HistoricalReplayRecord[]> {
  const res = await fetch(`${API_BASE}/api/historical/records`);
  if (!res.ok) {
    throw new Error('Failed to fetch historical records');
  }
  const json = await res.json();
  return json.records;
}

export async function sendChatMessage(payload: {
  message: string;
  farmProfile: FarmProfile;
  assessment?: RiskAssessment;
  language: Language;
}): Promise<{ reply: string; suggestions?: string[] }> {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error('Failed to send chat message');
  }

  return await res.json();
}

export async function requestOtp(mobile: string): Promise<{ success: boolean; demoOtp: string }> {
  const res = await fetch(`${API_BASE}/api/auth/otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile }),
  });
  return await res.json();
}

export async function verifyLogin(mobile: string, otp: string): Promise<any> {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ mobile, otp }),
  });
  return await res.json();
}

