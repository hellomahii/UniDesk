import React, { useState } from 'react';
import { GraduationCap, ArrowRight, Lock, Mail, ShieldAlert } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrId.trim()) {
      setError('Please enter your college email or college ID.');
      return;
    }
    const success = login(emailOrId, password);
    if (!success) {
      setError('Invalid college email or password.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#031D15] via-[#072B1F] to-[#02140D] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none">
      {/* 1. DARKER EMERALD BACKGROUND: Rich deep forest-green tones with subtle emerald/teal variation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Soft emerald/teal atmospheric lighting */}
        <div className="absolute -top-36 left-1/2 -translate-x-1/2 w-[820px] h-[520px] bg-gradient-to-b from-emerald-600/12 via-teal-800/8 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/4 -left-20 w-[420px] h-[420px] bg-[#0B4533]/20 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-0 w-[460px] h-[460px] bg-[#062D21]/25 rounded-full blur-3xl" />

        {/* Faint subtle institutional grid texture */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#34D399 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />

        {/* Delicate architectural framing rings */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[640px] h-[640px] rounded-full border border-emerald-400/[0.05] pointer-events-none" />
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[480px] h-[480px] rounded-full border border-emerald-400/[0.04] pointer-events-none" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* BRANDING: UniDesk - Your university, one front door. */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0F5C46] to-[#147A5E] text-white shadow-soft mb-4 border border-emerald-400/30">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white drop-shadow-xs">
            UniDesk
          </h1>
          <p className="mt-2 text-sm md:text-base font-semibold text-emerald-100/90 leading-snug">
            Your university,<br />one front door.
          </p>
        </div>

        {/* WARM OFF-WHITE/LIGHT LOGIN CARD: Crisp readability & contrast */}
        <div className="rounded-3xl p-8 shadow-2xl border border-white/20 bg-[#FAFBF9] text-slate-900 relative">
          {/* Subtle top edge emerald highlight */}
          <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#0D5C46]/50 to-transparent" />

          {/* Inline Error Message */}
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200/90 flex items-center gap-2.5 text-xs text-rose-800 animate-in fade-in duration-150">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4.5">
            {/* College Email / College ID Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                College Email / College ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={emailOrId}
                  onChange={(e) => {
                    setEmailOrId(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="name@college.edu or 2024-CS-042"
                  className="w-full pl-10 pr-3.5 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D5C46]/20 focus:border-[#0D5C46] transition-all shadow-2xs font-medium"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D5C46]/20 focus:border-[#0D5C46] transition-all shadow-2xs"
                />
              </div>
            </div>

            {/* LOGIN BUTTON: Hover lift, active press-down, subtle shadow */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#0D5C46] hover:bg-[#094534] active:scale-[0.985] hover:-translate-y-0.5 text-white font-semibold text-sm rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <span>Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Exact required subtext directly below the Login button */}
              <p className="mt-3.5 text-center text-xs text-slate-500 font-medium select-none">
                login with college mail id
              </p>
            </div>
          </form>
        </div>

        {/* Footer note */}
        <p className="mt-6 text-center text-xs text-emerald-100/60 font-medium">
          Protected by University Institutional Single Sign-On (SSO)
        </p>
      </div>
    </div>
  );
};
