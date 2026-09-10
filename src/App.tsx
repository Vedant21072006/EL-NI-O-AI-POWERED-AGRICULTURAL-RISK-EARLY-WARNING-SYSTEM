import React, { useState, useEffect, useCallback } from 'react';
import { Language, FarmProfile, RiskAssessment } from './types';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { LanguageScreen } from './components/LanguageScreen';
import { AuthScreen } from './components/AuthScreen';
import { OnboardingFarm } from './components/OnboardingFarm';
import { FarmerDashboard } from './components/FarmerDashboard';
import { RecommendationsView } from './components/RecommendationsView';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { OfficerDashboard } from './components/OfficerDashboard';
import { HistoricalReplay } from './components/HistoricalReplay';
import { ProfileSettingsView } from './components/ProfileSettingsView';
import { MoreToolsView } from './components/MoreToolsView';
import { KrishiChatbot } from './components/KrishiChatbot';
import { fetchRiskPrediction } from './services/api';
import { INITIAL_ASSESSMENT } from './data/initialAssessment';

type AppStep = 'language' | 'auth' | 'onboarding' | 'main';
type AppTab = 'dashboard' | 'recommendations' | 'whatif' | 'more' | 'officer' | 'historical' | 'profile';

export default function App() {
  // State for user journey
  const [step, setStep] = useState<AppStep>(() => {
    const saved = localStorage.getItem('krishi_step');
    return (saved as AppStep) || 'language';
  });

  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('krishi_lang');
    return (saved as Language) || 'mr';
  });

  const [activeTab, setActiveTab] = useState<AppTab>('dashboard');
  const [isOfficerMode, setIsOfficerMode] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Farmer Profile State
  const [profile, setProfile] = useState<FarmProfile>(() => {
    const saved = localStorage.getItem('krishi_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // ignore
      }
    }
    return {
      mobile: '9876543210',
      farmerName: 'Ramesh Patil',
      state: 'Maharashtra',
      district: 'Latur',
      taluka: 'Ausa',
      crop: 'Soybean',
      sowingDate: '2026-06-20',
      cropStage: 'flowering',
      irrigation: 'partial',
    };
  });

  // Risk Assessment State (initialized with baseline, updated via API)
  const [assessment, setAssessment] = useState<RiskAssessment>(INITIAL_ASSESSMENT);

  const [isRefreshing, setIsRefreshing] = useState(false);

  // Sync state to local storage for pleasant persistence
  useEffect(() => {
    localStorage.setItem('krishi_lang', language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem('krishi_step', step);
  }, [step]);

  useEffect(() => {
    localStorage.setItem('krishi_profile', JSON.stringify(profile));
  }, [profile]);

  // Fetch or recompute risk prediction whenever farm profile changes
  const loadRiskPrediction = useCallback(async (prof: FarmProfile) => {
    setIsRefreshing(true);
    try {
      const data = await fetchRiskPrediction({
        district: prof.district,
        crop: prof.crop,
        sowingDate: prof.sowingDate,
        cropStage: prof.cropStage,
        irrigation: prof.irrigation,
      });
      setAssessment(data);
    } catch (err) {
      console.warn('API risk prediction fetch failed, retaining baseline assessment', err);
      setAssessment((prev) => ({
        ...prev,
        district: prof.district,
        crop: prof.crop,
        cropStage: prof.cropStage,
        irrigation: prof.irrigation,
      }));
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (step === 'main') {
      loadRiskPrediction(profile);
    }
  }, [profile, step, loadRiskPrediction]);

  // Step transitions
  const handleLanguageContinue = () => {
    setStep('auth');
  };

  const handleAuthSuccess = (mobileNumber: string) => {
    setProfile((prev) => ({ ...prev, mobile: mobileNumber }));
    setStep('onboarding');
  };

  const handleFarmSubmit = (newProfile: FarmProfile) => {
    setProfile(newProfile);
    setStep('main');
    loadRiskPrediction(newProfile);
  };

  const handleProfileUpdate = (updatedProfile: FarmProfile) => {
    setProfile(updatedProfile);
    loadRiskPrediction(updatedProfile);
  };

  const handleLogout = () => {
    setStep('auth');
    setActiveTab('dashboard');
  };

  const handleSelectDistrictForFarmer = (selectedDistrict: string) => {
    const updated = { ...profile, district: selectedDistrict };
    setProfile(updated);
    setIsOfficerMode(false);
    setActiveTab('dashboard');
    loadRiskPrediction(updated);
  };

  // 1. Language Selection Screen
  if (step === 'language') {
    return (
      <LanguageScreen
        currentLanguage={language}
        onSelectLanguage={setLanguage}
        onContinue={handleLanguageContinue}
      />
    );
  }

  // 2. Auth Screen
  if (step === 'auth') {
    return (
      <AuthScreen
        language={language}
        onSuccess={handleAuthSuccess}
        onBackToLanguage={() => setStep('language')}
      />
    );
  }

  // 3. Farm Onboarding Screen
  if (step === 'onboarding') {
    return (
      <OnboardingFarm
        language={language}
        mobile={profile.mobile}
        initialProfile={profile}
        onSubmitFarm={handleFarmSubmit}
      />
    );
  }

  // 4. Main Application
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col font-sans selection:bg-emerald-200">
      {/* Universal Header */}
      <Header
        language={language}
        onLanguageChange={setLanguage}
        isOfficerMode={isOfficerMode}
        onToggleOfficerMode={() => {
          const next = !isOfficerMode;
          setIsOfficerMode(next);
          if (next) {
            setActiveTab('officer');
          } else {
            setActiveTab('dashboard');
          }
        }}
        assessment={assessment}
        farmerName={profile.farmerName}
        district={profile.district}
        onOpenProfile={() => setActiveTab('profile')}
      />

      {/* Navigation Sub-bar */}
      <Navigation
        currentTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab as AppTab)}
        language={language}
        isOfficerMode={isOfficerMode}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-3 sm:px-6 lg:px-8 py-5 max-w-4xl w-full mx-auto">
        {activeTab === 'dashboard' && (
          <FarmerDashboard
            assessment={assessment}
            profile={profile}
            language={language}
            onNavigate={(tab) => {
              if (tab === 'chat') {
                setIsChatOpen(true);
              } else {
                setActiveTab(tab as AppTab);
              }
            }}
            onRefreshAssessment={() => loadRiskPrediction(profile)}
            isRefreshing={isRefreshing}
          />
        )}

        {activeTab === 'recommendations' && (
          <RecommendationsView
            assessment={assessment}
            profile={profile}
            language={language}
            onBackToDashboard={() => setActiveTab('dashboard')}
          />
        )}

        {activeTab === 'whatif' && (
          <WhatIfSimulator
            profile={profile}
            assessment={assessment}
            language={language}
          />
        )}

        {activeTab === 'more' && (
          <MoreToolsView
            language={language}
            profile={profile}
            onNavigate={(tab) => setActiveTab(tab as AppTab)}
            onSelectLanguage={setLanguage}
            onLogout={handleLogout}
          />
        )}

        {activeTab === 'officer' && (
          <OfficerDashboard
            language={language}
            onSelectDistrictForFarmer={handleSelectDistrictForFarmer}
          />
        )}

        {activeTab === 'historical' && (
          <HistoricalReplay language={language} />
        )}

        {activeTab === 'profile' && (
          <ProfileSettingsView
            profile={profile}
            language={language}
            onUpdateProfile={handleProfileUpdate}
            onChangeLanguage={setLanguage}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Krishi AI Chatbot (Fixed floating action on all pages) */}
      <KrishiChatbot
        profile={profile}
        assessment={assessment}
        language={language}
        isOpen={isChatOpen}
        onToggle={setIsChatOpen}
      />
    </div>
  );
}
