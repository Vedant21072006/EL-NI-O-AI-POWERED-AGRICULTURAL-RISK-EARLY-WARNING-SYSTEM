import React, { useState } from 'react';
import {
  Droplet,
  Sprout,
  Layers,
  CheckCircle2,
  ArrowLeft
} from 'lucide-react';
import { Recommendation, Language, RiskAssessment, FarmProfile } from '../types';
import { translations } from '../i18n/translations';

interface RecommendationsViewProps {
  assessment: RiskAssessment;
  profile: FarmProfile;
  language: Language;
  onBackToDashboard: () => void;
}

export const RecommendationsView: React.FC<RecommendationsViewProps> = ({
  assessment,
  profile,
  language,
  onBackToDashboard,
}) => {
  const t = translations[language];
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'water' | 'crop' | 'field'>('all');

  const getPriorityBadge = (priority: 'HIGH' | 'MEDIUM' | 'LOW') => {
    switch (priority) {
      case 'HIGH':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-md">
            🔥 {t.priorityHigh}
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
            ⚡ {t.priorityMedium}
          </span>
        );
      case 'LOW':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase text-stone-600 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-md">
            ℹ️ {t.priorityLow}
          </span>
        );
    }
  };

  const filteredRecs = selectedFilter === 'all'
    ? assessment.recommendations
    : assessment.recommendations.filter(r => r.category === selectedFilter);

  const filterButtons = [
    { id: 'all', label: language === 'mr' ? 'सर्व उपाय' : language === 'hi' ? 'सभी' : 'All' },
    { id: 'water', label: language === 'mr' ? '💧 पाणी' : language === 'hi' ? '💧 पानी' : '💧 Water' },
    { id: 'crop', label: language === 'mr' ? '🌿 पीक व खते' : language === 'hi' ? '🌿 फसल व खाद' : '🌿 Crop' },
    { id: 'field', label: language === 'mr' ? '🌾 शेती मशागत' : language === 'hi' ? '🌾 खेत प्रबंधन' : '🌾 Field' },
  ];

  return (
    <div className="space-y-4 max-w-2xl mx-auto pb-14">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← {language === 'mr' ? 'मागे जा' : language === 'hi' ? 'पीछे' : 'Back'}</span>
        </button>

        <span className="text-xs text-stone-500 font-medium">
          {profile.district} • {profile.cropStage.replace('_', ' ')}
        </span>
      </div>

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight">
          {t.recommendationsHeading}
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          {language === 'mr' 
            ? 'पाण्याचा ताण आणि उष्णतेपासून पिकाचे रक्षण करण्यासाठी कृषी सल्ला' 
            : language === 'hi' 
            ? 'पानी के तनाव और गर्मी से फसल सुरक्षा के कृषि उपाय' 
            : 'Protective agricultural advisories tailored for current drought stress'}
        </p>
      </div>

      {/* Simple Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
        {filterButtons.map((btn) => (
          <button
            key={btn.id}
            type="button"
            onClick={() => setSelectedFilter(btn.id as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedFilter === btn.id
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Recommendations List */}
      <div className="space-y-3">
        {filteredRecs.map((rec) => (
          <div
            key={rec.id}
            className="bg-white rounded-2xl border border-stone-200/90 p-4 sm:p-5 shadow-2xs space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-sm sm:text-base font-bold text-stone-900">
                {rec.title}
              </h3>
              <div className="shrink-0">{getPriorityBadge(rec.priority)}</div>
            </div>

            {/* Clear Action Directive */}
            <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-xs sm:text-sm font-semibold text-emerald-950 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>{rec.action}</span>
            </div>

            {/* Simple Rationale */}
            <p className="text-xs text-stone-600 leading-relaxed pl-1">
              <span className="font-bold text-stone-800">
                {language === 'mr' ? 'फायदा:' : language === 'hi' ? 'फायदा:' : 'Benefit:'}
              </span>{' '}
              {rec.rationale}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
