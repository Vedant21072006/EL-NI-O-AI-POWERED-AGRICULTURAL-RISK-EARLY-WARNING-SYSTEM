import React from 'react';
import {
  Home,
  CheckSquare,
  SlidersHorizontal,
  Menu,
  Sparkles
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';

interface NavigationProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  language: Language;
  isOfficerMode: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  onSelectTab,
  language,
  isOfficerMode,
}) => {
  const t = translations[language];

  const tabs = [
    {
      id: 'dashboard',
      label: language === 'mr' ? 'मुख्य' : language === 'hi' ? 'मुख्य' : 'Home',
      icon: Home
    },
    {
      id: 'recommendations',
      label: language === 'mr' ? 'उपाय' : language === 'hi' ? 'उपाय' : 'Actions',
      icon: CheckSquare
    },
    {
      id: 'whatif',
      label: language === 'mr' ? 'चाचणी' : language === 'hi' ? 'सिम्युलेटर' : 'Simulate',
      icon: SlidersHorizontal
    },
    {
      id: 'more',
      label: language === 'mr' ? 'अधिक' : language === 'hi' ? 'अधिक' : 'More',
      icon: Menu
    },
  ];

  return (
    <>
      {/* Mobile Bottom Clean Bar with 4 Big Touch Targets */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200/90 px-3 py-1.5 shadow-lg">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentTab === tab.id || (tab.id === 'more' && ['officer', 'historical', 'profile', 'more'].includes(currentTab));
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onSelectTab(tab.id)}
                className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all ${
                  isActive
                    ? 'text-emerald-800 font-black'
                    : 'text-stone-500 font-medium hover:text-stone-900'
                }`}
              >
                <div className={`p-1 rounded-xl transition-all ${isActive ? 'bg-emerald-100 text-emerald-900' : ''}`}>
                  <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
                </div>
                <span className="text-[11px] tracking-tight mt-0.5 whitespace-nowrap font-medium">
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Desktop Horizontal Clean Sub-Navbar */}
      <div className="hidden md:block bg-white border-b border-stone-200/90 shadow-2xs">
        <div className="max-w-4xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center space-x-2 py-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = currentTab === tab.id || (tab.id === 'more' && ['officer', 'historical', 'profile', 'more'].includes(currentTab));
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => onSelectTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-2xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100/80'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-stone-500 flex items-center gap-2 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Kharif 2026</span>
          </div>
        </div>
      </div>
    </>
  );
};
