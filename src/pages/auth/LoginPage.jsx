import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Lock, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { InteractiveWavesBackground } from '../../components/canvas/InteractiveWavesBackground';
import { GooeyGradientBackground } from '../../components/canvas/GooeyGradientBackground';

export function LoginPage() {
  const navigate = useNavigate();
  const { loginWithMySQL, isAuthenticated } = useAuth();



  const [username, setUsername] = useState('25070126076');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState('Student');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const personas = [
    { role: 'Student', idTag: '25070126076', name: 'Ishaan Chand' },
    { role: 'Faculty', idTag: 'T100458', name: 'Dr. Meenakshi Sharma' },
    { role: 'Lab Assistant', idTag: 'N10022', name: 'Ramesh Patil' },
    { role: 'HoD / Admin', idTag: 'T100101', name: 'Dr. Sumit Kumar' },
  ];

  const handleRoleSelect = (persona) => {
    setSelectedRole(persona.role);
    setUsername(persona.idTag);
    setErrorMessage('');
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const result = await loginWithMySQL(username, password, selectedRole);
      if (result.success) {
        navigate('/hero');
      } else {
        setErrorMessage(result.error || 'Invalid credentials. Please verify your PRN and password.');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Connection error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <GooeyGradientBackground className="min-h-screen w-screen overflow-hidden flex items-center justify-center p-4 sm:p-8 relative select-none font-sans">
      {/* ───────────────────────────────────────────────────────────────── */}
      {/* CENTRAL FLOATING GLASS CARD WIDGET                                */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-4xl rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.12)] border border-white/10 backdrop-blur-2xl bg-[#141416]/90 overflow-hidden grid grid-cols-1 md:grid-cols-2 relative z-10 min-h-[500px]">
        
        {/* Specular Edge Bevel (Top glass reflection) */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

        {/* ───────────────────────────────────────────────────────────── */}
        {/* LEFT PANEL: Pure Typographic "LabTrack" Display in Glass      */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="relative hidden md:flex flex-col items-center justify-center overflow-hidden border-r border-white/10 p-10 bg-[#121215]/80">
          {/* Ambient Warm Gold Radial Glow shining from behind */}
          <div className="absolute w-64 h-64 rounded-full bg-[#a78b71]/20 blur-[80px] pointer-events-none" />

          {/* Pure LabTrack Wordmark */}
          <div className="relative z-10 text-center select-none">
            <h1 className="font-clash text-5xl lg:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-[#f5e6c8] to-[#c9b8a0] leading-none drop-shadow-[0_4px_30px_rgba(201,184,160,0.35)]">
              LabTrack
            </h1>
            <div className="w-14 h-0.5 bg-gradient-to-r from-transparent via-[#c9b8a0]/70 to-transparent mx-auto mt-4 mb-3" />
            <p className="text-xs font-sans font-semibold uppercase tracking-[0.28em] text-[#c9b8a0]/80">
              Physical Computing
            </p>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* RIGHT PANEL: Pure Glassmorphic Sign In Chamber               */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="p-8 sm:p-12 flex flex-col justify-center bg-[#161619]/80">
          <div className="max-w-sm mx-auto w-full">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Sign In
              </h2>
              <p className="text-xs text-stone-400 mt-1 font-sans">
                Access your lab workstation
              </p>
            </div>

            {/* Role Selectors */}
            <div className="mb-6">
              <div className="grid grid-cols-2 gap-1.5">
                {personas.map((persona) => {
                  const isSelected = selectedRole === persona.role;
                  return (
                    <button
                      key={persona.role}
                      type="button"
                      onClick={() => handleRoleSelect(persona)}
                      className={`text-xs py-2 px-3 rounded-xl border font-medium transition-all text-left flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-[#262528] text-white border-[#c9b8a0] shadow-[0_0_15px_rgba(201,184,160,0.15)]'
                          : 'bg-[#1c1c1f] text-stone-400 border-white/5 hover:bg-[#232326] hover:text-white'
                      }`}
                    >
                      <span className="truncate">{persona.role}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#c9b8a0] flex-shrink-0 stroke-[2.5]" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center space-x-2 backdrop-blur-md">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Input */}
              <div className="bg-[#1f2024] border border-white/10 rounded-xl px-4 py-3 flex items-center space-x-3 transition-all focus-within:ring-1 focus-within:ring-[#c9b8a0] focus-within:border-[#c9b8a0] hover:border-white/20">
                <User className="w-4 h-4 text-stone-400 flex-shrink-0" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="PRN or ID"
                  required
                  className="bg-transparent border-none outline-none w-full text-sm text-white placeholder-stone-500 font-normal font-sans"
                />
              </div>

              {/* Password Input */}
              <div className="bg-[#1f2024] border border-white/10 rounded-xl px-4 py-3 flex items-center space-x-3 transition-all focus-within:ring-1 focus-within:ring-[#c9b8a0] focus-within:border-[#c9b8a0] hover:border-white/20">
                <Lock className="w-4 h-4 text-stone-400 flex-shrink-0" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="bg-transparent border-none outline-none w-full text-sm text-white placeholder-stone-500 font-normal font-sans"
                />
              </div>

              {/* Login Button with Champagne Gold Gradient */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 rounded-full text-[#141416] font-bold text-sm shadow-[0_12px_28px_-6px_rgba(201,184,160,0.4)] hover:shadow-[0_14px_32px_-6px_rgba(201,184,160,0.55)] hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center space-x-2 mt-6 border border-[#f5e6c8]/30 disabled:opacity-60"
                style={{
                  background: 'linear-gradient(to right, #bfa07a 0%, #d8c4a5 50%, #ecdcc4 100%)',
                }}
              >
                <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-6 text-center space-y-3">
              <button
                type="button"
                onClick={() => alert(`Password recovery requested for ID: ${username}. Please contact your administrator.`)}
                className="text-xs text-stone-400 hover:text-[#c9b8a0] transition-colors cursor-pointer block mx-auto"
              >
                Forgot credentials?
              </button>

              <button
                type="button"
                onClick={() => alert('New enrollments must be provisioned by the lab administrator.')}
                className="text-xs text-stone-400 hover:text-stone-300 font-normal transition-colors cursor-pointer block mx-auto"
              >
                Need an account? Contact lab administrator
              </button>
            </div>
          </div>
        </div>
      </div>
    </GooeyGradientBackground>
  );
}

export default LoginPage;

