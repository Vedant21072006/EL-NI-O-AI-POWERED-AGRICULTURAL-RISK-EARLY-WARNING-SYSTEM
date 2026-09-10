import React from 'react';
import { Sprout, Globe, User } from 'lucide-react';
import { Language, RiskAssessment } from '../types';
import { translations } from '../i18n/translations';

interface HeaderProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isOfficerMode: boolean;
  onToggleOfficerMode: () => void;
  assessment?: RiskAssessment;
  farmerName?: string;
  district?: string;
  onOpenProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onLanguageChange,
  isOfficerMode,
  farmerName = 'Ramesh Patil',
  district = 'Latur',
  onOpenProfile
}) => {
  const t = translations[language];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-stone-200/90 px-4 py-2.5 shadow-2xs">
      <div className="max-w-4xl mx-auto flex items-center justify-between gap-3">
        {/* Brand / Title */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-800 text-emerald-100 flex items-center justify-center shadow-2xs shrink-0">
            <Sprout className="w-5 h-5 text-emerald-200" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-stone-900 tracking-tight leading-none truncate">
              {t.appName}
            </h1>
            <p className="text-[11px] text-stone-500 truncate mt-0.5 font-medium">
              {district} • Kharif 2026
            </p>
          </div>
        </div>

        {/* Right Actions: Language Switcher & Profile */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Clean Language Selector */}
          <div className="inline-flex items-center bg-stone-100 rounded-xl p-0.5">
            {(['mr', 'hi', 'en'] as Language[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => onLanguageChange(lang)}
                className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                  language === lang
                    ? 'bg-white text-emerald-900 shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {lang === 'mr' ? 'मराठी' : lang === 'hi' ? 'हिंदी' : 'EN'}
              </button>
            ))}
          </div>

          {/* Profile Button */}
          {onOpenProfile && (
            <button
              type="button"
              onClick={onOpenProfile}
              className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center hover:bg-emerald-200 transition-colors"
              title="Profile"
            >
              {farmerName ? farmerName[0] : <User className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
