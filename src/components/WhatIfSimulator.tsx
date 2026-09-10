import React, { useState } from 'react';
import {
  CloudRain,
  Thermometer,
  Droplets,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import {
  FarmProfile,
  RiskAssessment,
  Language,
  WhatIfSimulationResult,
  RiskLevel
} from '../types';
import { translations } from '../i18n/translations';
import { runSimulation } from '../services/api';

interface WhatIfSimulatorProps {
  profile: FarmProfile;
  assessment: RiskAssessment;
  language: Language;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  profile,
  assessment,
  language,
}) => {
  const t = translations[language];

  const [rainfallDelta, setRainfallDelta] = useState<number>(-20);
  const [tempDelta, setTempDelta] = useState<number>(1);
  const [soilMoisture, setSoilMoisture] = useState<'low' | 'normal' | 'high'>('low');
  const [loading, setLoading] = useState(false);

  const [simulationResult, setSimulationResult] = useState<WhatIfSimulationResult | null>({
    baselineRisk: assessment.probability,
    scenarioRisk: Math.min(95, assessment.probability + 13),
    delta: 13,
    baselineLevel: assessment.level,
    scenarioLevel: assessment.level === 'LOW' ? 'MODERATE' : 'CRITICAL',
    mainReason: language === 'mr' 
      ? 'पावसाची वाढलेली तूट (-२०%) आणि जमिनीतील ओलाव्याची घट' 
      : language === 'hi'
      ? 'बारिश में कमी (-20%) और मिट्टी की नमी में गिरावट'
      : 'Increased rainfall deficit (-20%) and soil moisture depletion',
    scenarioFeatures: {
      ...assessment.climateFeatures,
      rainfallDeficitPct: assessment.climateFeatures.rainfallDeficitPct - 20,
      tempAnomalyC: assessment.climateFeatures.tempAnomalyC + 1,
    },
    topDrivers: ['Rainfall Deficit', 'Soil Moisture', 'Temperature']
  });

  const handleRunSimulation = async () => {
    setLoading(true);
    try {
      const res = await runSimulation({
        district: profile.district,
        crop: profile.crop,
        cropStage: profile.cropStage,
        irrigation: profile.irrigation,
        rainfallDelta,
        tempDelta,
        soilMoisture,
      });
      setSimulationResult(res);
    } catch (err) {
      console.error('Simulation error', err);
      const mockDelta = Math.round(
        Math.abs(rainfallDelta) * 0.4 + tempDelta * 5 + (soilMoisture === 'low' ? 8 : soilMoisture === 'high' ? -8 : 0)
      );
      const newRisk = Math.min(96, Math.max(15, assessment.probability + mockDelta));
      setSimulationResult({
        baselineRisk: assessment.probability,
        scenarioRisk: newRisk,
        delta: newRisk - assessment.probability,
        baselineLevel: assessment.level,
        scenarioLevel: newRisk >= 80 ? 'CRITICAL' : newRisk >= 65 ? 'HIGH' : newRisk >= 38 ? 'MODERATE' : 'LOW',
        mainReason: language === 'mr'
          ? `पाऊस ${rainfallDelta}% आणि जमिनीतील ओलावा ${soilMoisture === 'low' ? 'कमी' : 'बदलल्यामुळे'}`
          : `Rainfall ${rainfallDelta}% and ${soilMoisture} soil moisture`,
        scenarioFeatures: assessment.climateFeatures,
        topDrivers: ['Rainfall Deficit', 'Soil Stress', 'Temperature']
      });
    } finally {
      setLoading(false);
    }
  };

  const getBadge = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-red-600 text-white">CRITICAL</span>;
      case 'HIGH':
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-orange-600 text-white">HIGH</span>;
      case 'MODERATE':
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-amber-500 text-stone-950">MODERATE</span>;
      case 'LOW':
      default:
        return <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-emerald-700 text-white">LOW</span>;
    }
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto pb-14">
      {/* Title */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
          {language === 'mr' ? 'हवामान बदल चाचणी (What-If)' : language === 'hi' ? 'मौसम परिवर्तन सिमुलेटर' : 'Climate Scenario Simulator'}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
          {language === 'mr'
            ? 'पाऊस किंवा तापमान बदलल्यास पिकाच्या जोखमीवर काय परिणाम होईल ते तपासा.'
            : language === 'hi'
            ? 'बारिश या तापमान बदलने पर फसल जोखिम पर क्या असर होगा, देखें।'
            : 'Test how your crop risk changes under different rainfall or heat scenarios.'}
        </p>
      </div>

      {/* Interactive Sliders / Controls */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-2xs space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
          {language === 'mr' ? 'हवामान परिस्थिती निवडा' : language === 'hi' ? 'मौसम स्थिति चुनें' : 'Adjust Climate Conditions'}
        </h3>

        {/* Rainfall */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-stone-800 flex items-center gap-1.5">
              <CloudRain className="w-4 h-4 text-sky-600" />
              {language === 'mr' ? 'पावसातील बदल' : language === 'hi' ? 'बारिश में बदलाव' : 'Rainfall Change'}
            </span>
            <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
              {rainfallDelta === 0 ? 'Normal' : `${rainfallDelta}%`}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[0, -10, -20, -30].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setRainfallDelta(val)}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  rainfallDelta === val
                    ? 'bg-sky-600 text-white border-sky-600 shadow-2xs'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                {val === 0 ? 'Current' : `${val}%`}
              </button>
            ))}
          </div>
        </div>

        {/* Temperature */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-stone-800 flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-amber-600" />
              {language === 'mr' ? 'तापमान वाढ' : language === 'hi' ? 'तापमान वृद्धि' : 'Temperature Rise'}
            </span>
            <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded">
              {tempDelta === 0 ? 'Normal' : `+${tempDelta}°C`}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setTempDelta(val)}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  tempDelta === val
                    ? 'bg-amber-600 text-white border-amber-600 shadow-2xs'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                {val === 0 ? 'Normal' : `+${val}°C`}
              </button>
            ))}
          </div>
        </div>

        {/* Soil Moisture */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-stone-800 flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-blue-600" />
              {language === 'mr' ? 'मातीतील ओलावा' : language === 'hi' ? 'मिट्टी की नमी' : 'Soil Moisture'}
            </span>
            <span className="font-mono font-bold text-stone-900 bg-stone-100 px-2 py-0.5 rounded capitalize">
              {soilMoisture}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['low', 'normal', 'high'] as Array<'low' | 'normal' | 'high'>).map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => setSoilMoisture(val)}
                className={`py-2 text-xs font-bold rounded-xl border capitalize transition-all ${
                  soilMoisture === val
                    ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                    : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>

        {/* Run Button */}
        <button
          type="button"
          onClick={handleRunSimulation}
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-2xs"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>{loading ? 'गणना चालू आहे...' : (language === 'mr' ? 'जोखीम चाचणी करा' : language === 'hi' ? 'जोखिम सिमुलेट करें' : 'Run Scenario')}</span>
        </button>
      </div>

      {/* Result Card */}
      {simulationResult && (
        <div className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-2xs space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
            {language === 'mr' ? 'चाचणी निकाल' : language === 'hi' ? 'सिमुलेशन परिणाम' : 'Simulation Outcome'}
          </h3>

          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
            <div>
              <span className="text-xs text-stone-500 block">{language === 'mr' ? 'सध्याची जोखीम' : 'Current Risk'}</span>
              <div className="text-2xl font-black text-stone-800 font-mono mt-0.5">
                {simulationResult.baselineRisk}%
              </div>
              <div className="mt-1">{getBadge(simulationResult.baselineLevel)}</div>
            </div>

            <div className="border-l border-stone-200 pl-3">
              <span className="text-xs text-stone-500 block">{language === 'mr' ? 'बदलांनंतरची जोखीम' : 'New Risk'}</span>
              <div className="text-2xl font-black text-red-700 font-mono mt-0.5 flex items-center gap-1">
                <span>{simulationResult.scenarioRisk}%</span>
                {simulationResult.delta > 0 ? (
                  <TrendingUp className="w-4 h-4 text-red-600" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-emerald-600" />
                )}
              </div>
              <div className="mt-1">{getBadge(simulationResult.scenarioLevel)}</div>
            </div>
          </div>

          <p className="text-xs text-stone-700 font-medium leading-relaxed bg-amber-50/80 border border-amber-200/80 p-3 rounded-xl">
            {simulationResult.mainReason}
          </p>
        </div>
      )}
    </div>
  );
};
