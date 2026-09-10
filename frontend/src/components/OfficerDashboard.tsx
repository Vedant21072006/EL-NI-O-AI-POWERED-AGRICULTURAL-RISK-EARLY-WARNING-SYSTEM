import React, { useState } from 'react';
import {
  ShieldAlert,
  MapPin,
  Filter,
  Search,
  ChevronRight,
  TrendingDown,
  AlertOctagon,
  Download,
  Info,
  X
} from 'lucide-react';
import { DistrictRiskSummary, Language, RiskLevel } from '../types';
import { translations } from '../i18n/translations';
import { MAHARASHTRA_DISTRICTS } from '../data/maharashtraDistricts';

interface OfficerDashboardProps {
  language: Language;
  onSelectDistrictForFarmer?: (district: string) => void;
}

export const OfficerDashboard: React.FC<OfficerDashboardProps> = ({
  language,
  onSelectDistrictForFarmer,
}) => {
  const t = translations[language];
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrictModal, setSelectedDistrictModal] = useState<DistrictRiskSummary | null>(
    MAHARASHTRA_DISTRICTS[0] // default Latur
  );

  const filteredDistricts = MAHARASHTRA_DISTRICTS.filter((d) => {
    const matchesRegion = selectedRegion === 'all' || d.region === selectedRegion;
    const matchesSearch = d.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesSearch;
  });

  const highRiskDistricts = filteredDistricts.filter(
    (d) => d.riskLevel === 'HIGH' || d.riskLevel === 'CRITICAL'
  );

  const getRiskColor = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return {
          pill: 'bg-red-600 text-white',
          border: 'border-red-500',
          bg: 'bg-red-50',
          dot: 'bg-red-600',
        };
      case 'HIGH':
        return {
          pill: 'bg-orange-600 text-white',
          border: 'border-orange-500',
          bg: 'bg-orange-50',
          dot: 'bg-orange-600',
        };
      case 'MODERATE':
        return {
          pill: 'bg-amber-500 text-stone-900 font-bold',
          border: 'border-amber-400',
          bg: 'bg-amber-50',
          dot: 'bg-amber-500',
        };
      case 'LOW':
      default:
        return {
          pill: 'bg-emerald-700 text-white',
          border: 'border-emerald-500',
          bg: 'bg-emerald-50',
          dot: 'bg-emerald-600',
        };
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-amber-800 text-amber-100 text-[11px] font-bold uppercase tracking-wider mb-1">
            <span>GOVERNMENT / EXTENSION PORTAL</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
            {t.officerDashboardHeading}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            {t.officerDashboardSub} • Active El Niño Advisory (ONI +1.4°C)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs bg-red-100 text-red-900 font-bold px-3 py-1.5 rounded-lg border border-red-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
            <span>{highRiskDistricts.length} High-Risk Districts</span>
          </span>
        </div>
      </div>

      {/* Overview Statistics Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase">State Monitored</span>
          <div className="text-xl font-extrabold text-stone-900 mt-0.5">Maharashtra</div>
          <span className="text-[10px] text-stone-500">18 Key Soybean Districts</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase">Critical Area</span>
          <div className="text-xl font-extrabold text-red-700 mt-0.5">1.28M Ha</div>
          <span className="text-[10px] text-red-600">Beed, Latur, Solapur, Nanded</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase">Avg Rainfall Deficit</span>
          <div className="text-xl font-extrabold text-amber-700 mt-0.5">-23.4%</div>
          <span className="text-[10px] text-stone-500">Marathwada rain shadow</span>
        </div>
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-[11px] font-bold text-stone-500 uppercase">Early Warnings Issued</span>
          <div className="text-xl font-extrabold text-emerald-800 mt-0.5">14 Talukas</div>
          <span className="text-[10px] text-stone-500">Contingency mulch & spray</span>
        </div>
      </div>

      {/* Map & District Table Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Visual Map Representation (Left 6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-800" />
              <span>{t.districtMapTitle}</span>
            </h2>
            <div className="flex items-center gap-2 text-[10px] font-bold">
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Low</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Mod</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-orange-600"></span> High</span>
              <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-red-600"></span> Critical</span>
            </div>
          </div>

          <p className="text-xs text-stone-500">
            Click any district node to open risk probabilities, yield impacts, and recommended administrative interventions.
          </p>

          {/* Interactive District Grid Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
            {MAHARASHTRA_DISTRICTS.map((dist) => {
              const theme = getRiskColor(dist.riskLevel);
              const isSelected = selectedDistrictModal?.district === dist.district;

              return (
                <button
                  key={dist.district}
                  type="button"
                  onClick={() => setSelectedDistrictModal(dist)}
                  className={`p-3 rounded-xl border text-left transition-all relative ${
                    isSelected
                      ? 'border-stone-900 bg-stone-900 text-white shadow-md ring-2 ring-stone-900/20'
                      : `${theme.bg} ${theme.border} hover:scale-[1.02] shadow-2xs`
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                      {dist.district}
                    </span>
                    <span className={`w-2 h-2 rounded-full shrink-0 mt-1 ${theme.dot}`}></span>
                  </div>
                  <div className={`text-[11px] font-mono mt-1 ${isSelected ? 'text-stone-300' : 'text-stone-600'}`}>
                    Risk: <strong>{dist.riskProbability}%</strong>
                  </div>
                  <div className={`text-[10px] truncate ${isSelected ? 'text-stone-400' : 'text-stone-500'}`}>
                    Rain: {dist.rainfallDeficitPct}%
                  </div>
                </button>
              );
            })}
          </div>

          <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-center justify-between">
            <span>Selected for inspection: <strong>{selectedDistrictModal?.district}</strong></span>
            <span className="font-mono text-xs">{selectedDistrictModal?.region}</span>
          </div>
        </div>

        {/* High Risk Table (Right 6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl border border-stone-200 p-5 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-red-600" />
                <span>{t.highRiskDistricts}</span>
              </h2>

              {/* Search filter */}
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search district..."
                className="text-xs px-2.5 py-1.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-700"
              />
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-stone-200 text-stone-500 font-bold">
                    <th className="pb-2">{t.districtName}</th>
                    <th className="pb-2">{t.riskCol}</th>
                    <th className="pb-2">{t.cropStageCol}</th>
                    <th className="pb-2 text-right">{t.actionCol}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredDistricts.map((d) => {
                    const theme = getRiskColor(d.riskLevel);
                    return (
                      <tr
                        key={d.district}
                        onClick={() => setSelectedDistrictModal(d)}
                        className="hover:bg-stone-50/80 cursor-pointer transition-colors"
                      >
                        <td className="py-2.5 font-bold text-stone-900">
                          {d.district}
                          <span className="block text-[10px] text-stone-400 font-normal">{d.region}</span>
                        </td>
                        <td className="py-2.5">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${theme.pill}`}>
                            {d.riskProbability}% ({d.riskLevel})
                          </span>
                        </td>
                        <td className="py-2.5 capitalize text-stone-700">
                          {d.primaryCropStage.replace('_', ' ')}
                        </td>
                        <td className="py-2.5 text-right">
                          <button
                            type="button"
                            className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 inline-flex items-center gap-0.5"
                          >
                            <span>{t.viewIntervention}</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span>Showing {filteredDistricts.length} districts</span>
            <span className="font-semibold text-emerald-800">Krishi Vigyan Kendra Integrated</span>
          </div>
        </div>
      </div>

      {/* District Drill-down Card Modal */}
      {selectedDistrictModal && (
        <div className="bg-stone-900 text-white rounded-2xl p-6 sm:p-7 shadow-xl space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold tracking-tight">
                  {selectedDistrictModal.district} District Profile
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${getRiskColor(selectedDistrictModal.riskLevel).pill}`}>
                  {selectedDistrictModal.riskLevel} RISK ({selectedDistrictModal.riskProbability}%)
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                {selectedDistrictModal.region} Zone • Soybean Cultivation Area: {selectedDistrictModal.soybeanAreaHectares.toLocaleString()} Hectares
              </p>
            </div>

            {onSelectDistrictForFarmer && (
              <button
                type="button"
                onClick={() => onSelectDistrictForFarmer(selectedDistrictModal.district)}
                className="text-xs font-bold px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white transition-colors"
              >
                Inspect in Farmer View ➔
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700">
              <span className="text-[10px] font-bold text-stone-400 uppercase">Potential Yield Impact</span>
              <div className="text-lg font-black text-red-400 mt-0.5 font-mono">
                {selectedDistrictModal.potentialYieldLoss}
              </div>
            </div>
            <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700">
              <span className="text-[10px] font-bold text-stone-400 uppercase">Rainfall Anomaly</span>
              <div className="text-lg font-black text-amber-400 mt-0.5 font-mono">
                {selectedDistrictModal.rainfallDeficitPct}%
              </div>
            </div>
            <div className="bg-stone-800/80 p-3 rounded-xl border border-stone-700">
              <span className="text-[10px] font-bold text-stone-400 uppercase">Dominant Crop Stage</span>
              <div className="text-lg font-bold text-stone-200 mt-0.5 capitalize">
                {selectedDistrictModal.primaryCropStage.replace('_', ' ')}
              </div>
            </div>
          </div>

          <div className="space-y-2 pt-1">
            <div className="text-xs text-stone-300">
              <strong className="text-white">Major Drivers (SHAP Attribution):</strong> {selectedDistrictModal.majorDriver}
            </div>
            <div className="text-xs text-emerald-300 bg-stone-800 p-3 rounded-xl border border-stone-700">
              <strong className="text-white block mb-0.5">Recommended Administrative Intervention:</strong>
              {selectedDistrictModal.recommendedIntervention}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
