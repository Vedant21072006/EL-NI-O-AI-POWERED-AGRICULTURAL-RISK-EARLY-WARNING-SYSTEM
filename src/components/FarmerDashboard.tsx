import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  TrendingDown,
  ShieldCheck,
  Droplets,
  Sprout,
  RefreshCw,
  MessageSquare,
  Sparkles,
  ChevronRight,
  HelpCircle,
  Thermometer,
  CloudRain
} from 'lucide-react';
import { RiskAssessment, FarmProfile, Language, RiskLevel } from '../types';
import { translations } from '../i18n/translations';

interface FarmerDashboardProps {
  assessment: RiskAssessment;
  profile: FarmProfile;
  language: Language;
  onNavigate: (tab: string) => void;
  onRefreshAssessment: () => void;
  isRefreshing?: boolean;
  onAskChatbot?: (question: string) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  assessment,
  profile,
  language,
  onNavigate,
  onRefreshAssessment,
  isRefreshing = false,
  onAskChatbot,
}) => {
  const t = translations[language];
  const [showAllFactors, setShowAllFactors] = useState(false);

  // Friendly theme colors based on risk
  const getRiskTheme = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return {
          bg: 'bg-red-500',
          lightBg: 'bg-red-50',
          border: 'border-red-200',
          text: 'text-red-900',
          badgeText: 'text-white',
          accent: 'text-red-700',
          label: language === 'mr' ? 'अति गंभीर जोखीम' : language === 'hi' ? 'अति गंभीर जोखिम' : 'CRITICAL RISK',
          icon: '🔴'
        };
      case 'HIGH':
        return {
          bg: 'bg-orange-500',
          lightBg: 'bg-orange-50/80',
          border: 'border-orange-200',
          text: 'text-stone-900',
          badgeText: 'text-white',
          accent: 'text-orange-700',
          label: language === 'mr' ? 'उच्च जोखीम' : language === 'hi' ? 'उच्च जोखिम' : 'HIGH RISK',
          icon: '🟠'
        };
      case 'MODERATE':
        return {
          bg: 'bg-amber-500',
          lightBg: 'bg-amber-50/70',
          border: 'border-amber-200',
          text: 'text-stone-900',
          badgeText: 'text-stone-950',
          accent: 'text-amber-800',
          label: language === 'mr' ? 'मध्यम जोखीम' : language === 'hi' ? 'मध्यम जोखिम' : 'MODERATE RISK',
          icon: '🟡'
        };
      case 'LOW':
      default:
        return {
          bg: 'bg-emerald-600',
          lightBg: 'bg-emerald-50/70',
          border: 'border-emerald-200',
          text: 'text-stone-900',
          badgeText: 'text-white',
          accent: 'text-emerald-700',
          label: language === 'mr' ? 'कमी जोखीम / सुरक्षित' : language === 'hi' ? 'कम जोखिम / सुरक्षित' : 'LOW RISK / SAFE',
          icon: '🟢'
        };
    }
  };

  const theme = getRiskTheme(assessment.level);

  // Top 2 critical recommendations for immediate display
  const topActions = assessment.recommendations.slice(0, 2);

  // Top 2 climate drivers
  const topDrivers = assessment.drivers.slice(0, 2);
  const remainingDrivers = assessment.drivers.slice(2);

  // Quick help prompts
  const quickQuestions = language === 'mr' 
    ? ['माझ्या पिकाला पाणी कसे द्यावे?', '१० दिवसात पाऊस पडेल का?']
    : language === 'hi'
    ? ['फसल को पानी कैसे दें?', 'क्या अगले १० दिनों में बारिश होगी?']
    : ['How should I irrigate?', 'Will it rain in next 10 days?'];

  return (
    <div className="space-y-5 max-w-2xl mx-auto pb-14">
      {/* 1. Minimal Header Card: Farm Context */}
      <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-2xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-xl shrink-0">
            🌱
          </div>
          <div>
            <h2 className="text-base font-bold text-stone-900 leading-tight">
              {profile.farmerName} • {profile.district}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              {language === 'mr' ? 'सोयाबीन' : language === 'hi' ? 'सोयाबीन' : 'Soybean'} •{' '}
              <span className="capitalize">{profile.cropStage.replace('_', ' ')}</span> •{' '}
              <span className="capitalize">{profile.irrigation} irrigation</span>
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onRefreshAssessment}
          disabled={isRefreshing}
          className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-colors"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-700' : ''}`} />
        </button>
      </div>

      {/* 2. Primary Risk Card - Clean, High-Contrast & Simple */}
      <div className={`rounded-3xl border ${theme.border} ${theme.lightBg} p-5 sm:p-6 shadow-2xs space-y-4`}>
        {/* Status Badge + Score */}
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/90 border border-stone-200/80 shadow-2xs">
            <span className="text-base leading-none">{theme.icon}</span>
            <span className="text-xs sm:text-sm font-black tracking-wide text-stone-900">
              {theme.label}
            </span>
          </div>

          <div className="text-right">
            <span className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight font-mono">
              {assessment.probability}%
            </span>
            <span className="text-[11px] text-stone-500 block font-medium">
              {language === 'mr' ? 'जोखीम शक्यता' : language === 'hi' ? 'जोखिम संभावना' : 'Risk probability'}
            </span>
          </div>
        </div>

        {/* Big Plain-Language Headline */}
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-stone-900 leading-snug">
            {assessment.headline}
          </h3>
          <p className="text-sm text-stone-700 font-normal leading-relaxed mt-1.5">
            {assessment.summary}
          </p>
        </div>

        {/* Expected Yield Impact in friendly plain language */}
        {assessment.level !== 'LOW' && (
          <div className="bg-white/85 rounded-xl p-3 border border-stone-200/70 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0 font-bold">
              📉
            </div>
            <div className="text-xs">
              <span className="font-bold text-stone-900 block">
                {language === 'mr' ? 'अंदाजित उत्पादन घट (जर उपाय नाही केले):' : language === 'hi' ? 'अनुमानित उत्पादन नुकसान:' : 'Potential yield impact without action:'}
              </span>
              <span className="text-red-700 font-semibold">
                {assessment.potentialYieldImpact.text}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* 3. "आज काय करावे?" (What to do today? - Most important section!) */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
              <span>{language === 'mr' ? '💡 आज काय करावे?' : language === 'hi' ? '💡 आज क्या करें?' : '💡 What should you do today?'}</span>
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {language === 'mr' ? 'पिकाचे नुकसान टाळण्यासाठी महत्त्वाचे उपाय' : language === 'hi' ? 'फसल नुकसान से बचने के जरूरी उपाय' : 'Top protective steps for your crop'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('recommendations')}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-900 hover:underline flex items-center gap-1"
          >
            <span>{language === 'mr' ? 'सर्व उपाय' : language === 'hi' ? 'सभी उपाय' : 'See all'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2 Simple Action Items */}
        <div className="space-y-2.5">
          {topActions.map((rec) => (
            <div
              key={rec.id}
              className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 hover:border-emerald-300 transition-all flex items-start gap-3"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 text-base font-bold">
                {rec.category === 'water' ? '💧' : rec.category === 'crop' ? '🌿' : '🌾'}
              </div>
              <div className="space-y-0.5 flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-stone-900 truncate">
                    {rec.title}
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-800 uppercase">
                    {rec.priority}
                  </span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  {rec.action}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Primary View Full Plan Button */}
        <button
          type="button"
          onClick={() => onNavigate('recommendations')}
          className="w-full py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-2xs hover:shadow-xs"
        >
          <span>{language === 'mr' ? 'संपूर्ण उपाययोजना व सल्ला पहा' : language === 'hi' ? 'पूरी कार्ययोजना और सलाह देखें' : 'View Full Advisory & Action Plan'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 4. "जोखीम का आहे?" (Why is my crop at risk? - Simplified to top 2 reasons) */}
      <div className="bg-white rounded-3xl border border-stone-200/90 p-5 shadow-2xs space-y-3.5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-900">
              {language === 'mr' ? '🌧️ मुख्य हवामान कारणे' : language === 'hi' ? '🌧️ मुख्य मौसम कारण' : '🌧️ Key Climate Drivers'}
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              {language === 'mr' ? 'पिकावर ताण आणणारे मुख्य घटक' : language === 'hi' ? 'फसल पर तनाव के मुख्य कारण' : 'Primary factors contributing to stress'}
            </p>
          </div>
        </div>

        {/* 2 Main Drivers */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {topDrivers.map((driver) => (
            <div
              key={driver.id}
              className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-start gap-2.5"
            >
              <div className="w-8 h-8 rounded-lg bg-stone-200/70 flex items-center justify-center shrink-0 text-base">
                {driver.id === 'rainfall' ? '🌧️' : driver.id === 'temperature' ? '🌡️' : '🌱'}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-bold text-stone-900 truncate">
                    {driver.name}
                  </h4>
                  <span className="text-[10px] font-mono font-bold text-stone-600 shrink-0">
                    {driver.measuredValue}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 leading-snug mt-0.5 line-clamp-2">
                  {driver.simpleExplanation}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Expandable Remaining Drivers */}
        {showAllFactors && (
          <div className="pt-2 border-t border-stone-100 space-y-2">
            {remainingDrivers.map((driver) => (
              <div
                key={driver.id}
                className="p-2.5 rounded-xl bg-stone-50 text-xs flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <span>{driver.id === 'soil_moisture' ? '💧' : driver.id === 'vegetation' ? '🌿' : '🌊'}</span>
                  <span className="font-semibold text-stone-800">{driver.name}</span>
                </div>
                <span className="font-mono text-stone-600 text-[11px]">{driver.measuredValue}</span>
              </div>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowAllFactors(!showAllFactors)}
          className="text-xs text-stone-500 hover:text-stone-800 font-semibold w-full text-center pt-1"
        >
          {showAllFactors 
            ? (language === 'mr' ? '▲ कमी दाखवा' : language === 'hi' ? '▲ कम दिखाएं' : '▲ Show Less')
            : (language === 'mr' ? '▼ इतर हवामान घटक पहा' : language === 'hi' ? '▼ अन्य मौसम कारक देखें' : '▼ See Other Factors (Soil Moisture, NDVI, ENSO)')
          }
        </button>
      </div>

      {/* 5. Clean AI Chat Help Strip */}
      <div className="bg-emerald-900 text-white rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center text-xl shrink-0">
            🤖
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">
              {language === 'mr' ? 'काही शंका आहे का? कृषी मित्राला विचारा' : language === 'hi' ? 'कोई सवाल है? कृषि मित्र से पूछें' : 'Have questions? Ask Krishi AI'}
            </h4>
            <p className="text-xs text-emerald-200 mt-0.5">
              {language === 'mr' ? 'मराठी, हिंदी किंवा इंग्रजीत बोला' : language === 'hi' ? 'मराठी, हिंदी या अंग्रेजी में बात करें' : 'Available in Marathi, Hindi & English'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('chat')}
          className="px-4 py-2 rounded-xl bg-white text-emerald-950 font-bold text-xs hover:bg-emerald-50 transition-colors shrink-0 flex items-center justify-center gap-1.5 shadow-2xs"
        >
          <MessageSquare className="w-3.5 h-3.5 text-emerald-800" />
          <span>{language === 'mr' ? 'संभाषण सुरू करा' : language === 'hi' ? 'बातचीत शुरू करें' : 'Start Chat'}</span>
        </button>
      </div>
    </div>
  );
};
