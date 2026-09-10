import React, { useState } from 'react';
import {
  CloudRain,
  Thermometer,
  Droplets,
  Sprout,
  Waves,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Info,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { RiskDriver, Language } from '../types';
import { translations } from '../i18n/translations';

interface WhyRiskSectionProps {
  drivers: RiskDriver[];
  language: Language;
}

export const WhyRiskSection: React.FC<WhyRiskSectionProps> = ({ drivers, language }) => {
  const t = translations[language];
  const [showTechnicalShap, setShowTechnicalShap] = useState(false);

  const getDriverIcon = (id: string) => {
    switch (id) {
      case 'rainfall':
        return <CloudRain className="w-5 h-5 text-sky-600" />;
      case 'temperature':
        return <Thermometer className="w-5 h-5 text-amber-600" />;
      case 'soil_moisture':
        return <Droplets className="w-5 h-5 text-blue-600" />;
      case 'vegetation':
        return <Sprout className="w-5 h-5 text-emerald-600" />;
      case 'enso':
      default:
        return <Waves className="w-5 h-5 text-indigo-600" />;
    }
  };

  const getImpactBadge = (impact: 'high' | 'medium' | 'low') => {
    if (impact === 'high') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
          <TrendingUp className="w-3 h-3" /> Major Risk Factor
        </span>
      );
    }
    if (impact === 'medium') {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
          Moderate Contributor
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-600 bg-stone-100 px-2 py-0.5 rounded-md">
        Stable
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <span>{t.whyThisRisk}</span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            {t.whyThisRiskSubtitle}
          </p>
        </div>

        {/* Technical toggle for SHAP values */}
        <button
          type="button"
          onClick={() => setShowTechnicalShap(!showTechnicalShap)}
          className="text-xs font-semibold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 transition-colors"
        >
          <span>{t.technicalDetailsToggle}</span>
          {showTechnicalShap ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Driver Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {drivers.map((driver) => {
          return (
            <div
              key={driver.id}
              className="bg-white rounded-xl border border-stone-200 p-4 shadow-2xs hover:border-stone-300 transition-all space-y-2.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-lg bg-stone-50 border border-stone-200/80 flex items-center justify-center shrink-0">
                    {getDriverIcon(driver.id)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">
                      {driver.name}
                    </h3>
                    <div className="text-xs font-semibold text-stone-600">
                      {driver.status} • <span className="font-mono text-stone-900">{driver.measuredValue}</span>
                    </div>
                  </div>
                </div>

                <div>
                  {getImpactBadge(driver.impact)}
                </div>
              </div>

              {/* Farmer-facing simple explanation */}
              <p className="text-xs text-stone-700 leading-relaxed bg-stone-50/70 p-2.5 rounded-lg border border-stone-100">
                {driver.simpleExplanation}
              </p>

              {/* SHAP Technical Contribution (Officer/Analyst View) */}
              {showTechnicalShap && (
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] font-mono text-stone-500">
                  <span>SHAP Value: <strong className={driver.shapValue > 0 ? 'text-red-700' : 'text-emerald-700'}>+{driver.shapValue}</strong></span>
                  <span>Normal baseline: {driver.baselineNormal}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showTechnicalShap && (
        <div className="p-3 bg-stone-100/80 rounded-lg text-[11px] text-stone-600 flex items-start gap-2">
          <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
          <span>
            <strong>SHAP (Shapley Additive exPlanations):</strong> Mathematically measures how much each feature pushes the crop risk score above the historical Kharif Maharashtra baseline rate.
          </span>
        </div>
      )}
    </div>
  );
};
