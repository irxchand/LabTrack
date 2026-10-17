import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { User, Lock, ArrowRight, Eye, EyeOff, AlertCircle, ShieldAlert, Check } from 'lucide-react';
import { GooeyGradientBackground } from '../../components/canvas/GooeyGradientBackground';
import { Modal } from '../../components/common/Modal';

export function LoginPage() {
  const navigate = useNavigate();
  const { loginWithMySQL } = useAuth();

  const personas = [
    { role: 'Student', idTag: '202401048', name: 'Rahul Sharma' },
    { role: 'Faculty', idTag: 'FAC-AI-019', name: 'Dr. Anjali Dalvi' },
    { role: 'Lab Assistant', idTag: 'LA-04', name: 'Ramesh Patil' },
    { role: 'HoD / Admin', idTag: 'HOD-AIML-001', name: 'Dr. K. V. Ramanathan' },
  ];

  const [selectedRole, setSelectedRole] = useState('Student');
  const [username, setUsername] = useState('202401048');
  const [password, setPassword] = useState('password123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleRoleSelect = (persona) => {
    setSelectedRole(persona.role);
    setUsername(persona.idTag);
    setPassword('password123');
    setErrorMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setErrorMessage('Please enter your Institutional PRN or Staff ID and password.');
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const result = await loginWithMySQL(username.trim(), password, selectedRole);
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
          {/* Ambient Warm Radial Glow shining from behind */}
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
            <div className="text-center mb-5">
              <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
                Sign In
              </h2>
              <p className="text-xs text-zinc-400 mt-1.5 font-sans">
                Access your physical computing workstation
              </p>
            </div>

            {/* Role / Persona Identity Selector */}
            <div className="mb-5">
              <label className="block text-[11px] font-sans uppercase tracking-wider text-zinc-400 font-semibold mb-2">
                Select Your Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                {personas.map((p) => {
                  const isSelected = selectedRole === p.role;
                  return (
                    <button
                      key={p.role}
                      type="button"
                      onClick={() => handleRoleSelect(p)}
                      className={`py-2 px-3 rounded-xl border text-xs font-sans font-medium transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-white text-black font-semibold border-white shadow-[0_4px_16px_rgba(255,255,255,0.15)]'
                          : 'bg-white/[0.03] text-zinc-400 border-white/10 hover:bg-white/[0.06] hover:text-white hover:border-white/20'
                      }`}
                    >
                      <span className="truncate">{p.role}</span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-black stroke-[2.5] flex-shrink-0" />
                      )}
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
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {/* Username Input */}
              <div className="bg-[#18191d] border border-white/10 rounded-2xl px-4 py-3 flex items-center space-x-3 transition-all focus-within:ring-1 focus-within:ring-white/30 focus-within:border-white/30 hover:border-white/20">
                <User className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="PRN or Staff ID"
                  required
                  className="bg-transparent border-none outline-none w-full text-sm text-white placeholder-zinc-500 font-normal font-sans"
                />
              </div>

              {/* Password Input */}
              <div className="bg-[#18191d] border border-white/10 rounded-2xl px-4 py-3 flex items-center space-x-3 transition-all focus-within:ring-1 focus-within:ring-white/30 focus-within:border-white/30 hover:border-white/20">
                <Lock className="w-4 h-4 text-zinc-400 flex-shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="bg-transparent border-none outline-none w-full text-sm text-white placeholder-zinc-500 font-normal font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer p-0.5"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Apple-grade Pure White Action Button */}
              <button
                type="submit"
                disabled={isSubmitting || !username.trim() || !password}
                className="w-full py-3.5 px-6 rounded-full bg-white hover:bg-neutral-200 disabled:opacity-40 disabled:hover:bg-white text-black font-semibold text-xs tracking-wide transition-all shadow-[0_4px_20px_rgba(255,255,255,0.12)] hover:shadow-[0_6px_25px_rgba(255,255,255,0.22)] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 mt-4"
              >
                <span>{isSubmitting ? 'Authenticating...' : `Sign In as ${selectedRole}`}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </form>

            {/* Footer Links */}
            <div className="mt-5 text-center space-y-2">
              <div>
                <Link
                  to="/auth/reset-password"
                  className="text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer inline-block font-sans"
                >
                  Forgot credentials?
                </Link>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setIsContactModalOpen(true)}
                  className="text-xs text-zinc-500 hover:text-zinc-300 font-normal transition-colors cursor-pointer inline-block font-sans"
                >
                  Need an account? Contact lab administrator
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Institutional Provisioning Dialog Modal */}
      <Modal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        title="Institutional Account Clearance"
        subtitle="Department of Physical Computing & AIML"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 text-xs font-sans text-zinc-300">
          <div className="p-3.5 bg-white/[0.03] border border-white/10 rounded-2xl space-y-2">
            <div className="text-white font-medium flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-[#c9b8a0]" />
              <span>Counter Registration Protocol</span>
            </div>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              Institutional accounts for LabTrack are provisioned directly by the Department Laboratory Custodian and Academic Registrar. Hardware custody clearance requires physical verification of your collegiate photo ID.
            </p>
          </div>

          <div className="space-y-1.5 text-[11px] text-zinc-400">
            <p>• <strong>Students:</strong> Present your photo PRN card at Dispatch Counter 01 (Room 402).</p>
            <p>• <strong>Faculty & Mentors:</strong> Contact Department Lead Dr. K. V. Ramanathan.</p>
            <p>• <strong>Lab Assistants:</strong> Contact Custody Lead Ramesh Patil (Staff ID LA-04).</p>
          </div>

          <button
            type="button"
            onClick={() => setIsContactModalOpen(false)}
            className="w-full py-2.5 px-4 rounded-full bg-white hover:bg-neutral-200 text-black font-semibold text-xs transition-all cursor-pointer mt-2"
          >
            Acknowledge
          </button>
        </div>
      </Modal>
    </GooeyGradientBackground>
  );
}

export default LoginPage;
