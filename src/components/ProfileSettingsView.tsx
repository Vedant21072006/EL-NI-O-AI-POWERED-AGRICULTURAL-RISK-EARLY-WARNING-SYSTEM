import React, { useState } from 'react';
import {
  User,
  MapPin,
  Calendar,
  Globe,
  Save,
  LogOut,
  RefreshCw,
  Sprout,
  Check
} from 'lucide-react';
import { FarmProfile, Language, CropStage, IrrigationType } from '../types';
import { translations } from '../i18n/translations';
import { MAHARASHTRA_DISTRICTS } from '../data/maharashtraDistricts';

interface ProfileSettingsViewProps {
  profile: FarmProfile;
  language: Language;
  onUpdateProfile: (profile: FarmProfile) => void;
  onChangeLanguage: (lang: Language) => void;
  onLogout: () => void;
}

export const ProfileSettingsView: React.FC<ProfileSettingsViewProps> = ({
  profile,
  language,
  onUpdateProfile,
  onChangeLanguage,
  onLogout,
}) => {
  const t = translations[language];

  const [farmerName, setFarmerName] = useState(profile.farmerName);
  const [district, setDistrict] = useState(profile.district);
  const [taluka, setTaluka] = useState(profile.taluka || '');
  const [sowingDate, setSowingDate] = useState(profile.sowingDate);
  const [cropStage, setCropStage] = useState<CropStage>(profile.cropStage);
  const [irrigation, setIrrigation] = useState<IrrigationType>(profile.irrigation);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      farmerName,
      district,
      taluka,
      sowingDate,
      cropStage,
      irrigation,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-12">
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
          {t.navProfile} & Settings
        </h1>
        <p className="text-sm text-stone-600">
          Manage your farm configuration, registered mobile number, and application language.
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-300 text-sm font-bold flex items-center gap-2">
          <Check className="w-5 h-5" />
          <span>Farm profile successfully updated! Risk assessment recalculating...</span>
        </div>
      )}

      {/* Language Preference Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <Globe className="w-5 h-5 text-emerald-800" />
          <h2 className="text-base font-bold text-stone-900">{t.chooseLanguage}</h2>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-1">
          {(['mr', 'hi', 'en'] as Language[]).map((lang) => {
            const isSelected = language === lang;
            return (
              <button
                key={lang}
                type="button"
                onClick={() => onChangeLanguage(lang)}
                className={`py-3 px-3 rounded-xl border text-center font-bold text-sm transition-all ${
                  isSelected
                    ? 'border-emerald-800 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-800/10'
                    : 'border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100'
                }`}
              >
                {lang === 'mr' ? 'मराठी' : lang === 'hi' ? 'हिंदी' : 'English'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Farm Details Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
          <Sprout className="w-5 h-5 text-emerald-800" />
          <h2 className="text-base font-bold text-stone-900">Farm Information</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">Farmer Name</label>
            <input
              type="text"
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-semibold text-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">Registered Mobile</label>
            <input
              type="text"
              disabled
              value={`+91 ${profile.mobile}`}
              className="w-full px-3.5 py-2.5 bg-stone-100 border border-stone-200 rounded-xl text-sm font-mono text-stone-600"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">{t.district}</label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm font-semibold text-stone-900"
            >
              {MAHARASHTRA_DISTRICTS.map((d) => (
                <option key={d.district} value={d.district}>
                  {d.district} ({d.region})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">{t.talukaOptional}</label>
            <input
              type="text"
              value={taluka}
              onChange={(e) => setTaluka(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-semibold text-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">{t.sowingDate}</label>
            <input
              type="date"
              value={sowingDate}
              onChange={(e) => setSowingDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-semibold text-stone-900"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-600 mb-1">{t.cropStage}</label>
            <select
              value={cropStage}
              onChange={(e) => setCropStage(e.target.value as CropStage)}
              className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm font-semibold text-stone-900 capitalize"
            >
              <option value="germination">{t.stages.germination}</option>
              <option value="vegetative">{t.stages.vegetative}</option>
              <option value="flowering">{t.stages.flowering} (Sensitive)</option>
              <option value="pod_development">{t.stages.pod_development} (Sensitive)</option>
              <option value="maturity">{t.stages.maturity}</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-stone-600 mb-1">{t.step4Irrigation}</label>
            <div className="grid grid-cols-3 gap-2">
              {(['yes', 'partial', 'no'] as IrrigationType[]).map((irr) => (
                <button
                  key={irr}
                  type="button"
                  onClick={() => setIrrigation(irr)}
                  className={`py-2 px-3 text-xs font-bold rounded-xl border capitalize ${
                    irrigation === irr
                      ? 'bg-emerald-800 text-white border-emerald-800'
                      : 'bg-stone-50 text-stone-700 border-stone-200'
                  }`}
                >
                  {irr === 'yes' ? t.irrigationYes : irr === 'partial' ? t.irrigationPartial : t.irrigationNo}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <button
            type="submit"
            className="py-3 px-6 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-sm flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="py-2.5 px-4 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-xs font-bold flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span>Switch Account</span>
          </button>
        </div>
      </form>
    </div>
  );
};
