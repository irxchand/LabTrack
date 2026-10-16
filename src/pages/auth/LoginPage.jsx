import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Lock, ArrowRight, Check, AlertCircle } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const { loginWithMySQL, isAuthenticated } = useAuth();



  const [username, setUsername] = useState('202401048');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState('Student');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const personas = [
    { role: 'Student', idTag: '202401048', name: 'Rahul Sharma' },
    { role: 'Faculty', idTag: 'FAC-AI-019', name: 'Dr. Anjali Dalvi' },
    { role: 'Lab Assistant', idTag: 'LA-04', name: 'Ramesh Patil' },
    { role: 'HoD / Admin', idTag: 'HOD-AIML-001', name: 'Dr. K. V. Ramanathan' },
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
        navigate('/workspace');
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
    <div className="min-h-screen w-screen overflow-hidden flex items-center justify-center p-4 sm:p-8 relative select-none font-sans bg-[#09090b]">
      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 1. AMBIENT BACKDROP LIGHTING (Visible through the transparent glass) */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        {/* Soft background tone */}
        <div className="absolute inset-0 bg-[#08080a]" />

        {/* Floating warm gold & champagne luminous orbs shining through the glass */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full bg-gradient-to-br from-[#c9b8a0]/25 via-[#a78b71]/15 to-transparent blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 translate-x-1/3 translate-y-1/3 w-[620px] h-[620px] rounded-full bg-gradient-to-tl from-[#e8d5b7]/20 via-[#8a6845]/15 to-transparent blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[360px] rounded-full bg-[#f5e6c8]/10 blur-[130px]" />

        {/* Subtle glass optic geometry */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[880px] h-[880px] rounded-full border border-white/[0.03] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1140px] h-[1140px] rounded-full border border-white/[0.015] pointer-events-none" />
      </div>

      {/* ───────────────────────────────────────────────────────────────── */}
      {/* 2. CENTRAL TRANSPARENT GLASS CARD                                 */}
      {/* ───────────────────────────────────────────────────────────────── */}
      <div className="w-full max-w-4xl rounded-3xl shadow-[0_30px_90px_rgba(0,0,0,0.85),inset_0_1px_1px_rgba(255,255,255,0.35),inset_0_0_20px_rgba(255,255,255,0.02)] border border-white/20 backdrop-blur-2xl bg-white/[0.03] overflow-hidden grid grid-cols-1 md:grid-cols-2 relative z-10 min-h-[500px]">
        
        {/* Specular Edge Bevel (Top glass reflection) */}
        <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />

        {/* ───────────────────────────────────────────────────────────── */}
        {/* LEFT PANEL: Pure Typographic "LabTrack" Display in Glass      */}
        {/* ───────────────────────────────────────────────────────────── */}
        <div className="relative hidden md:flex flex-col items-center justify-center overflow-hidden border-r border-white/10 p-10 bg-white/[0.01] backdrop-blur-xl">
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
        <div className="p-8 sm:p-12 flex flex-col justify-center bg-white/[0.02] backdrop-blur-xl">
          <div className="max-w-sm mx-auto w-full">
            {/* Header */}
            <div className="text-center mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Sign In
              </h2>
              <p className="text-xs text-[#c9b8a0]/70 mt-1 font-sans">
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
                      className={`text-xs py-2 px-3 rounded-xl border font-medium transition-all text-left flex items-center justify-between cursor-pointer backdrop-blur-md ${
                        isSelected
                          ? 'bg-[#c9b8a0]/25 text-[#f5e6c8] border-[#f5e6c8]/60 shadow-[0_0_20px_rgba(201,184,160,0.25)]'
                          : 'bg-white/[0.03] text-stone-300 border-white/10 hover:bg-white/[0.08] hover:border-white/20'
                      }`}
                    >
                      <span className="truncate">{persona.role}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#f5e6c8] flex-shrink-0" />}
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
              <div className="bg-white/[0.03] border border-white/15 rounded-xl px-4 py-3 flex items-center space-x-3 transition-all focus-within:ring-2 focus-within:ring-[#c9b8a0]/30 focus-within:border-[#c9b8a0] focus-within:bg-white/[0.07] backdrop-blur-md hover:border-white/25">
                <User className="w-5 h-5 text-[#c9b8a0] flex-shrink-0" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="PRN or ID"
                  required
                  className="bg-transparent border-none outline-none w-full text-sm text-white placeholder-stone-400 font-normal"
                />
              </div>

              {/* Password Input */}
              <div className="bg-white/[0.03] border border-white/15 rounded-xl px-4 py-3 flex items-center space-x-3 transition-all focus-within:ring-2 focus-within:ring-[#c9b8a0]/30 focus-within:border-[#c9b8a0] focus-within:bg-white/[0.07] backdrop-blur-md hover:border-white/25">
                <Lock className="w-5 h-5 text-[#c9b8a0] flex-shrink-0" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="bg-transparent border-none outline-none w-full text-sm text-white placeholder-stone-400 font-normal"
                />
              </div>

              {/* Login Button with Champagne Gold Gradient */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-6 rounded-full text-[#0a0a0a] font-bold text-sm shadow-[0_4px_25px_rgba(167,139,113,0.45)] hover:shadow-[0_4px_30px_rgba(201,184,160,0.6)] hover:brightness-105 active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center space-x-2 mt-6 border border-[#f5e6c8]/60 disabled:opacity-60"
                style={{
                  background: 'linear-gradient(to right, #a78b71 0%, #c9b8a0 50%, #e8d5b7 100%)',
                }}
              >
                <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
                <ArrowRight className="w-4 h-4" />
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

              <button
                type="button"
                onClick={() => navigate('/hero')}
                className="text-xs text-[#c9b8a0] hover:text-[#f5e6c8] font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 mx-auto pt-1"
              >
                <span>View Neural Architecture & Showcase</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

