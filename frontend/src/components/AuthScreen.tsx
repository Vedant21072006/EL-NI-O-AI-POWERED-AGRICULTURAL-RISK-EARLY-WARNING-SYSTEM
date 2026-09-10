import React, { useState } from 'react';
import { Phone, ShieldCheck, ArrowRight, UserCheck, Sprout } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../i18n/translations';
import { requestOtp, verifyLogin } from '../services/api';

interface AuthScreenProps {
  language: Language;
  onSuccess: (mobile: string) => void;
  onBackToLanguage: () => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({
  language,
  onSuccess,
  onBackToLanguage,
}) => {
  const t = translations[language];

  const [mobile, setMobile] = useState('9876543210');
  const [otp, setOtp] = useState('123456');
  const [isOtpSent, setIsOtpSent] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mobile.length < 10) {
      setError('Please enter a 10-digit mobile number');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await requestOtp(mobile);
      if (res.demoOtp) {
        setOtp(res.demoOtp);
      }
      setIsOtpSent(true);
    } catch {
      setError('Could not connect to service. Using offline fallback.');
      setIsOtpSent(true);
      setOtp('123456');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4) {
      setError('Please enter the OTP');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await verifyLogin(mobile, otp);
      onSuccess(mobile);
    } catch {
      // Fallback
      onSuccess(mobile);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = () => {
    setMobile('9876543210');
    setOtp('123456');
    onSuccess('9876543210');
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col justify-center p-4 sm:p-6">
      <div className="w-full max-w-md mx-auto space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-800 text-emerald-100 shadow-sm mb-2">
            <Sprout className="w-8 h-8 text-emerald-300" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            {t.loginHeading}
          </h2>
          <p className="text-sm text-stone-600">
            {t.loginSubheading}
          </p>
        </div>

        {/* Card Form */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-5">
          {error && (
            <div className="p-3 bg-red-50 text-red-800 text-xs font-medium rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={isOtpSent ? handleVerify : handleSendOtp} className="space-y-4">
            {/* Mobile Number Input */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                {t.mobileNumber}
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3.5 text-stone-500 font-semibold text-sm">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  placeholder="98765 43210"
                  className="w-full pl-20 pr-4 py-3 text-base font-semibold text-stone-900 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:bg-white focus:outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* OTP Section (Shown once requested) */}
            {isOtpSent && (
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    {t.otp}
                  </label>
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Demo OTP: 123456
                  </span>
                </div>
                <div className="relative flex items-center">
                  <ShieldCheck className="absolute left-3.5 w-5 h-5 text-stone-400" />
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full pl-11 pr-4 py-3 text-base font-mono tracking-widest font-bold text-stone-900 bg-stone-50 border border-stone-300 rounded-xl focus:ring-2 focus:ring-emerald-700 focus:bg-white focus:outline-none transition-all"
                    required
                  />
                </div>
              </div>
            )}

            {/* Main Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-6 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-bold text-base shadow-sm transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70"
            >
              {loading ? (
                <span className="animate-pulse">Loading...</span>
              ) : isOtpSent ? (
                <>
                  <span>{t.verifyOtpBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>{t.getOtpBtn}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Bypass */}
          <div className="pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={handleQuickDemo}
              className="w-full py-2.5 px-4 text-xs font-semibold rounded-lg bg-amber-50 hover:bg-amber-100/80 text-amber-900 border border-amber-200 transition-colors flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4 text-amber-700" />
              <span>⚡ One-Click Farmer Demo (Ramesh Patil • Latur)</span>
            </button>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <button
            type="button"
            onClick={onBackToLanguage}
            className="text-xs font-medium text-stone-500 hover:text-stone-800 underline transition-colors"
          >
            ← {t.chooseLanguage}
          </button>
        </div>
      </div>
    </div>
  );
};
