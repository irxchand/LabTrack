import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';
import { useNotification } from '../../context/NotificationContext';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const { addToast } = useNotification();
  const [prn, setPrn] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    addToast({
      title: 'Reset Dispatch Transmitted',
      message: `A temporary security token has been routed to the official institutional email for PRN ${prn}.`,
      type: 'info',
    });
  };

  return (
    <div className="min-h-screen w-screen flex flex-col justify-center items-center bg-[#070709] p-4 sm:p-6 text-white relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute w-96 h-96 rounded-full bg-[#c9b8a0]/10 blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md bg-[#111215]/90 border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6 backdrop-blur-2xl relative z-10">
        <div className="space-y-2">
          <Link
            to="/auth/login"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-sans text-zinc-300 hover:text-white transition-all mb-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Authentication</span>
          </Link>
          <h2 className="text-2xl font-bold tracking-tight text-white font-display">
            Password Recovery
          </h2>
          <p className="text-xs text-zinc-400 font-sans leading-relaxed">
            Enter your collegiate PRN or faculty staff identifier to receive an authenticated reset challenge.
          </p>
        </div>

        {submitted ? (
          <div className="p-5 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl space-y-3 font-sans text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>Challenge Dispatched</span>
            </div>
            <p className="text-zinc-300 leading-relaxed">
              If the PRN <span className="font-bold text-white">{prn}</span> is registered in the institutional active directory, check your university inbox.
            </p>
            <button
              onClick={() => navigate('/auth/login')}
              className="w-full py-2.5 px-4 rounded-full bg-white hover:bg-[#f5e6c8] text-black font-semibold text-xs transition-all shadow-sm cursor-pointer mt-2"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
            <div>
              <label className="block text-[11px] font-sans uppercase tracking-wider text-[#c9b8a0] font-semibold mb-1.5">
                Collegiate PRN / Institutional ID
              </label>
              <input
                type="text"
                required
                value={prn}
                onChange={(e) => setPrn(e.target.value)}
                placeholder="e.g. 202401048"
                className="w-full px-4 py-2.5 bg-white/[0.04] border border-white/15 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#c9b8a0] transition-all font-sans"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 px-5 bg-gradient-to-r from-[#c9b8a0] via-[#e2d2bc] to-[#f5e6c8] hover:opacity-95 text-black font-semibold text-xs rounded-full transition-all shadow-[0_0_15px_rgba(201,184,160,0.3)] cursor-pointer active:scale-95"
            >
              <KeyRound className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Dispatch Security Challenge</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;
