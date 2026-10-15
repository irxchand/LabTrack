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
    <div className="min-h-screen w-screen flex flex-col justify-center items-center bg-zinc-950 p-4 sm:p-6 text-zinc-100">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-lg p-6 shadow-2xl space-y-5">
        <div className="space-y-1">
          <Link
            to="/auth/login"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Authentication Desk
          </Link>
          <h2 className="text-xl font-bold tracking-tight text-zinc-100">
            Institutional Password Recovery
          </h2>
          <p className="text-xs text-zinc-400 font-mono">
            Enter your collegiate PRN or faculty staff identifier to receive an authenticated reset challenge.
          </p>
        </div>

        {submitted ? (
          <div className="p-4 bg-emerald-950/40 border border-emerald-700/60 rounded-md space-y-3 font-mono text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              Challenge Dispatched
            </div>
            <p className="text-zinc-300">
              If the PRN <span className="font-bold text-white">{prn}</span> is registered in the institutional active directory, check your university inbox.
            </p>
            <button
              onClick={() => navigate('/auth/login')}
              className="w-full py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded font-mono text-xs transition-colors"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
                Collegiate PRN / Institutional ID
              </label>
              <input
                type="text"
                required
                value={prn}
                onChange={(e) => setPrn(e.target.value)}
                placeholder="e.g. 202401048"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-md text-sm text-zinc-100 font-mono placeholder:text-zinc-600 focus:outline-none focus:border-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-semibold rounded-md transition-colors shadow-sm"
            >
              <KeyRound className="w-3.5 h-3.5" />
              Dispatch Security Challenge
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
