import React from 'react';
import { Sprout, Check } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface LanguageScreenProps {
  currentLanguage: Language;
  onSelectLanguage: (lang: Language) => void;
  onContinue: () => void;
}

export const LanguageScreen: React.FC<LanguageScreenProps> = ({
  currentLanguage,
  onSelectLanguage,
  onContinue,
}) => {
  const languages: Array<{ id: Language; label: string; subLabel: string; flag: string }> = [
    { id: 'mr', label: 'मराठी', subLabel: 'महाराष्ट्र राज्य', flag: '🇮🇳' },
    { id: 'hi', label: 'हिंदी', subLabel: 'संपूर्ण भारत', flag: '🇮🇳' },
    { id: 'en', label: 'English', subLabel: 'English Language', flag: '🌐' },
  ];

  const t = translations[currentLanguage];

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col items-center justify-center p-4 sm:p-6 select-none">
      <div className="w-full max-w-md mx-auto text-center space-y-6">
        {/* App Emblem */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-emerald-800 text-emerald-100 shadow-md ring-8 ring-emerald-800/10">
          <Sprout className="w-10 h-10 text-emerald-300" />
        </div>

        {/* Brand & Heading */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800">
            EL NIÑO EARLY WARNING SYSTEM
          </span>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
            {t.chooseLanguage}
          </h1>
          <p className="text-sm text-stone-600">
            आपली भाषा निवडा • अपनी भाषा चुनें
          </p>
        </div>

        {/* 3 Large Touch Buttons */}
        <div className="space-y-3 pt-2">
          {languages.map((item) => {
            const isSelected = currentLanguage === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectLanguage(item.id)}
                className={`w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between shadow-xs active:scale-[0.98] ${
                  isSelected
                    ? 'border-emerald-700 bg-white ring-4 ring-emerald-700/15'
                    : 'border-stone-200 bg-white hover:border-emerald-300 hover:bg-stone-50/70'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl" role="img" aria-label="flag">
                    {item.flag}
                  </span>
                  <div>
                    <div className="text-xl font-bold text-stone-900">
                      {item.label}
                    </div>
                    <div className="text-xs text-stone-500 font-medium">
                      {item.subLabel}
                    </div>
                  </div>
                </div>

                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-emerald-700 text-white'
                      : 'border-2 border-stone-300 text-transparent'
                  }`}
                >
                  <Check className="w-4 h-4 stroke-[3]" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Continue Action */}
        <div className="pt-3 space-y-4">
          <button
            type="button"
            onClick={onContinue}
            className="w-full py-4 px-6 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-bold text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
          >
            <span>{t.continueBtn}</span>
            <span className="group-hover:translate-x-1 transition-transform">➔</span>
          </button>

          <p className="text-xs text-stone-500 max-w-xs mx-auto leading-relaxed">
            {t.changeLanguageAnytime}
          </p>
        </div>
      </div>
    </div>
  );
};
