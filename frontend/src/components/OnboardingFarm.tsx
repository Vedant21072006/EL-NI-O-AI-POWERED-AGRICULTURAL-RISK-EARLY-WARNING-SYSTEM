import React, { useState } from 'react';
import {
  MapPin,
  Calendar,
  Layers,
  Droplet,
  Check,
  ArrowRight,
  Sprout,
  Info
} from 'lucide-react';
import { Language, CropStage, IrrigationType, FarmProfile } from '../types';
import { translations } from '../i18n/translations';
import { MAHARASHTRA_DISTRICTS } from '../data/maharashtraDistricts';

interface OnboardingFarmProps {
  language: Language;
  mobile: string;
  initialProfile?: FarmProfile;
  onSubmitFarm: (profile: FarmProfile) => void;
}

export const OnboardingFarm: React.FC<OnboardingFarmProps> = ({
  language,
  mobile,
  initialProfile,
  onSubmitFarm,
}) => {
  const t = translations[language];

  const [district, setDistrict] = useState(initialProfile?.district || 'Latur');
  const [taluka, setTaluka] = useState(initialProfile?.taluka || 'Ausa');
  const [crop] = useState('Soybean');
  const [sowingDate, setSowingDate] = useState(initialProfile?.sowingDate || '2026-06-20');
  const [cropStage, setCropStage] = useState<CropStage>(initialProfile?.cropStage || 'flowering');
  const [irrigation, setIrrigation] = useState<IrrigationType>(initialProfile?.irrigation || 'partial');

  const stageOptions: Array<{ id: CropStage; label: string; desc: string; sensitive?: boolean }> = [
    { id: 'germination', label: t.stages.germination, desc: '0 - 15 days' },
    { id: 'vegetative', label: t.stages.vegetative, desc: '15 - 40 days' },
    { id: 'flowering', label: t.stages.flowering, desc: '40 - 65 days', sensitive: true },
    { id: 'pod_development', label: t.stages.pod_development, desc: '65 - 85 days', sensitive: true },
    { id: 'maturity', label: t.stages.maturity, desc: '85 - 105 days' },
  ];

  const irrigationOptions: Array<{ id: IrrigationType; label: string; color: string; desc: string }> = [
    { id: 'yes', label: t.irrigationYes, color: 'border-emerald-500 bg-emerald-50/50', desc: 'Borewell / Well / Canal available' },
    { id: 'partial', label: t.irrigationPartial, color: 'border-amber-500 bg-amber-50/50', desc: '1-2 protective irrigations possible' },
    { id: 'no', label: t.irrigationNo, color: 'border-red-500 bg-red-50/50', desc: 'Completely rain-dependent' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitFarm({
      mobile,
      farmerName: initialProfile?.farmerName || 'Ramesh Patil',
      state: 'Maharashtra',
      district,
      taluka,
      crop,
      sowingDate,
      cropStage,
      irrigation,
    });
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 px-4 sm:px-6">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Title Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <Sprout className="w-4 h-4" />
            <span>KHARIF SEASON 2026</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {t.tellUsAboutFarm}
          </h1>
          <p className="text-sm text-stone-600 max-w-md mx-auto">
            {t.onboardingSub}
          </p>
        </div>

        {/* Step-by-Step Interactive Card */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-8">
          
          {/* Step 1: Location */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h2 className="text-base font-bold text-stone-900">
                {t.step1Location}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                  {t.state}
                </label>
                <div className="px-4 py-3 bg-stone-100/80 border border-stone-200 rounded-xl font-bold text-stone-800 text-sm flex items-center justify-between">
                  <span>Maharashtra (महाराष्ट्र)</span>
                  <span className="text-xs bg-emerald-200/70 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                    Active Zone
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                  {t.district}
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-stone-300 rounded-xl font-semibold text-stone-900 text-sm focus:ring-2 focus:ring-emerald-700 focus:outline-none transition-all cursor-pointer"
                >
                  {MAHARASHTRA_DISTRICTS.map((d) => (
                    <option key={d.district} value={d.district}>
                      {d.district} ({d.region})
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                  {t.talukaOptional}
                </label>
                <input
                  type="text"
                  value={taluka}
                  onChange={(e) => setTaluka(e.target.value)}
                  placeholder="e.g. Ausa, Latur, Renapur, Nilanga"
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium text-stone-900 focus:ring-2 focus:ring-emerald-700 focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Crop */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h2 className="text-base font-bold text-stone-900">
                {t.step2Crop}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-4 rounded-xl border-2 border-emerald-700 bg-emerald-50/40 flex items-center justify-between cursor-pointer">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">🌱</span>
                  <div>
                    <div className="font-bold text-stone-900 text-sm">{t.soybean}</div>
                    <div className="text-[11px] text-emerald-700 font-semibold">Primary Kharif Model</div>
                  </div>
                </div>
                <div className="w-5 h-5 rounded-full bg-emerald-700 text-white flex items-center justify-center">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              </div>

              <div className="p-4 rounded-xl border border-dashed border-stone-300 bg-stone-50/50 opacity-60 flex items-center gap-2.5">
                <span className="text-xl">☁️</span>
                <div>
                  <div className="font-semibold text-stone-500 text-xs">Cotton (कापूस)</div>
                  <div className="text-[10px] text-stone-400">Coming soon</div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-dashed border-stone-300 bg-stone-50/50 opacity-60 flex items-center gap-2.5">
                <span className="text-xl">🌽</span>
                <div>
                  <div className="font-semibold text-stone-500 text-xs">Maize / Jowar</div>
                  <div className="text-[10px] text-stone-400">Coming soon</div>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Crop Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h2 className="text-base font-bold text-stone-900">
                {t.step3CropInfo}
              </h2>
            </div>

            <div className="space-y-4 pt-1">
              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-1.5">
                  {t.sowingDate}
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={sowingDate}
                    onChange={(e) => setSowingDate(e.target.value)}
                    className="w-full sm:w-64 px-4 py-2.5 bg-white border border-stone-300 rounded-xl text-sm font-medium text-stone-900 focus:ring-2 focus:ring-emerald-700 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-600 mb-2">
                  {t.cropStage}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {stageOptions.map((st) => {
                    const isSelected = cropStage === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setCropStage(st.id)}
                        className={`text-left p-3 rounded-xl border-2 transition-all flex items-start justify-between ${
                          isSelected
                            ? 'border-emerald-700 bg-white ring-2 ring-emerald-700/10 shadow-2xs'
                            : 'border-stone-200 bg-stone-50/50 hover:bg-white hover:border-stone-300'
                        }`}
                      >
                        <div>
                          <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                            <span>{st.label}</span>
                            {st.sensitive && (
                              <span className="text-[10px] bg-red-100 text-red-800 font-bold px-1.5 py-0.2 rounded">
                                Vulnerable
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-stone-500 mt-0.5">
                            {st.desc}
                          </div>
                        </div>
                        <div
                          className={`w-4 h-4 rounded-full mt-0.5 shrink-0 flex items-center justify-center ${
                            isSelected
                              ? 'bg-emerald-700 text-white'
                              : 'border border-stone-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Step 4: Irrigation Availability */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-stone-100">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                4
              </div>
              <h2 className="text-base font-bold text-stone-900">
                {t.step4Irrigation}
              </h2>
            </div>

            <p className="text-xs text-stone-600">
              {t.irrigationQuestion}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {irrigationOptions.map((opt) => {
                const isSelected = irrigation === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setIrrigation(opt.id)}
                    className={`text-left p-4 rounded-xl border-2 transition-all flex flex-col justify-between ${
                      isSelected
                        ? `${opt.color} shadow-2xs`
                        : 'border-stone-200 bg-stone-50/50 hover:bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-stone-900">{opt.label}</span>
                      <div
                        className={`w-4 h-4 rounded-full flex items-center justify-center ${
                          isSelected ? 'bg-stone-900 text-white' : 'border border-stone-300'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                    <span className="text-[11px] text-stone-500 font-medium">
                      {opt.desc}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Submit Button */}
          <div className="pt-4 border-t border-stone-100">
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-extrabold text-base sm:text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group"
            >
              <span>{t.getRiskAssessmentBtn}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
