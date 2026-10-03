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
      setError('Invalid credentials. Please verify your college mail id or identification.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAF9] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Subtle organic green backdrop gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-gradient-to-b from-emerald-100/40 via-teal-50/20 to-transparent pointer-events-none rounded-full blur-3xl opacity-70" />

      <div className="relative z-10 w-full max-w-md">
        {/* University Portal Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0D5C46] text-white shadow-md mb-4 border border-emerald-600/30">
            <GraduationCap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-[#0D3B2E]">UniDesk</h1>
          <p className="mt-1 text-sm font-medium text-slate-600">
            One Front Door for Everything
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            Unified University Service & Administrative Portal
          </p>
        </div>

        {/* Login Card */}
        <div className="glass-panel rounded-2xl p-8 shadow-sm border border-[#E2ECE7] bg-white">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-50 border border-rose-200/80 flex items-center gap-2.5 text-xs text-rose-800">
              <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="w-full pl-10 pr-3.5 py-3 bg-[#FAFBFB] border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D5C46]/20 focus:border-[#0D5C46] transition-all shadow-2xs"
                />
              </div>
            </div>

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
                  className="w-full pl-10 pr-3.5 py-3 bg-[#FAFBFB] border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0D5C46]/20 focus:border-[#0D5C46] transition-all shadow-2xs"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#0D5C46] hover:bg-[#0B4A38] text-white font-semibold text-sm rounded-xl shadow-xs hover:shadow transition-all cursor-pointer"
              >
                <span>Login</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Exact required sentence directly below the Login button */}
              <p className="mt-3 text-center text-xs text-slate-500 font-medium select-none">
                login with college mail id
              </p>
            </div>
          </form>
        </div>

        {/* Clean university footer note */}
        <p className="mt-6 text-center text-xs text-slate-400">
          Protected by University Institutional Single Sign-On (SSO)
        </p>
      </div>
    </div>
  );
};
