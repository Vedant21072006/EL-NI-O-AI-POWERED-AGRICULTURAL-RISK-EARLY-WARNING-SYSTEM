import React from 'react';
import {
  User,
  MapPin,
  History,
  Globe,
  LogOut,
  ChevronRight,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { Language, FarmProfile } from '../types';

interface MoreToolsViewProps {
  language: Language;
  profile: FarmProfile;
  onNavigate: (tab: string) => void;
  onSelectLanguage: (lang: Language) => void;
  onLogout: () => void;
}

export const MoreToolsView: React.FC<MoreToolsViewProps> = ({
  language,
  profile,
  onNavigate,
  onSelectLanguage,
  onLogout,
}) => {
  return (
    <div className="space-y-5 max-w-xl mx-auto pb-14">
      {/* Title */}
      <div>
        <h2 className="text-xl font-bold text-stone-900 tracking-tight">
          {language === 'mr' ? 'अधिक पर्याय आणि माहिती' : language === 'hi' ? 'अधिक विकल्प और सेवाएं' : 'More Options & Services'}
        </h2>
        <p className="text-xs text-stone-500 mt-0.5">
          {language === 'mr' ? 'खाते सेटिंग्ज, जिल्हा विश्लेषण आणि इतर साधने' : language === 'hi' ? 'अकाउंट सेटिंग्स, जिला विश्लेषण और अन्य साधन' : 'Account settings, district analysis and tools'}
        </p>
      </div>

      {/* Profile quick preview card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-emerald-800 text-white font-bold text-base flex items-center justify-center">
            {profile.farmerName[0] || 'F'}
          </div>
          <div>
            <h3 className="text-sm font-bold text-stone-900">{profile.farmerName}</h3>
            <p className="text-xs text-stone-500">{profile.district}, {profile.state} • {profile.mobile}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onNavigate('profile')}
          className="text-xs font-bold text-emerald-800 hover:text-emerald-900 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 transition-colors"
        >
          {language === 'mr' ? 'बदला' : language === 'hi' ? 'बदलें' : 'Edit'}
        </button>
      </div>

      {/* Main Options Menu */}
      <div className="bg-white rounded-2xl border border-stone-200 divide-y divide-stone-100 overflow-hidden shadow-2xs">
        {/* Farm Profile Settings */}
        <button
          type="button"
          onClick={() => onNavigate('profile')}
          className="w-full p-4 flex items-center justify-between hover:bg-stone-50 transition-colors text-left group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-stone-900">
                {language === 'mr' ? 'माझी शेती व पीक माहिती' : language === 'hi' ? 'मेरी फसल और खेत की जानकारी' : 'Farm & Crop Details'}
              </div>
              <div className="text-xs text-stone-500">
                {language === 'mr' ? 'पेरणी तारीख, अवस्था व सिंचन व्यवस्था बदला' : language === 'hi' ? 'बुवाई तिथि, अवस्था और सिंचाई बदलें' : 'Update sowing date, crop stage & irrigation'}
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* District Officer Dashboard */}
        <button
          type="button"
          onClick={() => onNavigate('officer')}
          className="w-full p-4 flex items-center justify-between hover:bg-stone-50 transition-colors text-left group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-stone-900">
                {language === 'mr' ? 'जिल्हा अधिकारी डॅशबोर्ड' : language === 'hi' ? 'जिला कृषि अधिकारी डैशबोर्ड' : 'District Officer Dashboard'}
              </div>
              <div className="text-xs text-stone-500">
                {language === 'mr' ? 'महाराष्ट्रातील सर्व जिल्ह्यांचे जोखीम विश्लेषण' : language === 'hi' ? 'महाराष्ट्र के सभी जिलों का जोखिम विश्लेषण' : 'View risk matrix for all Maharashtra districts'}
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
        </button>

        {/* Historical Drought Replay */}
        <button
          type="button"
          onClick={() => onNavigate('historical')}
          className="w-full p-4 flex items-center justify-between hover:bg-stone-50 transition-colors text-left group"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-900 flex items-center justify-center shrink-0">
              <History className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-stone-900">
                {language === 'mr' ? 'मागील एल निनो दुष्काळी वर्षे' : language === 'hi' ? 'पिछले एल नीनो सूखा वर्ष' : 'Historical El Niño Replay'}
              </div>
              <div className="text-xs text-stone-500">
                {language === 'mr' ? '२०१५, २००९ आणि २०२३ मधील पावसाची तुलना' : language === 'hi' ? '2015, 2009 और 2023 की तुलना' : 'Compare with 2015, 2009 & 2023 drought records'}
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Language Selection Card */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs space-y-2.5">
        <div className="flex items-center gap-2 text-xs font-bold text-stone-700">
          <Globe className="w-4 h-4 text-emerald-800" />
          <span>{language === 'mr' ? 'अ‍ॅपची भाषा निवडा' : language === 'hi' ? 'ऐप की भाषा चुनें' : 'Select App Language'}</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(['mr', 'hi', 'en'] as Language[]).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => onSelectLanguage(l)}
              className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                language === l
                  ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                  : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            >
              {l === 'mr' ? 'मराठी' : l === 'hi' ? 'हिंदी' : 'English'}
            </button>
          ))}
        </div>
      </div>

      {/* Logout button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onLogout}
          className="w-full py-3 px-4 rounded-xl border border-red-200 text-red-700 hover:bg-red-50 text-xs font-bold flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>{language === 'mr' ? 'लॉगआउट करा' : language === 'hi' ? 'लॉग आउट करें' : 'Log Out'}</span>
        </button>
      </div>
    </div>
  );
};
