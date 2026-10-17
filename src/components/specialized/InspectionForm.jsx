import React, { useState } from 'react';
import {
  CheckCircle2,
  Wrench,
  AlertTriangle,
  ShieldCheck,
  Check,
  Package,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';

export function InspectionForm({ loan, onComplete, onCancel }) {
  const [checklist, setChecklist] = useState({
    physicalIntegrity: false,
    powerTest: false,
    accessoriesPresent: false,
    esdPackaging: false,
  });

  const [returnMode, setReturnMode] = useState('clean'); // 'clean' | 'defect'
  const [validationError, setValidationError] = useState('');
  const [defectDetails, setDefectDetails] = useState({
    severity: 'Moderate',
    defectCategory: 'Physical Damage (Port/Connector)',
    conditionSummary: '',
  });

  const handleCheckboxChange = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
    if (validationError) setValidationError('');
  };

  const isChecklistComplete =
    checklist.physicalIntegrity &&
    checklist.powerTest &&
    checklist.accessoriesPresent &&
    checklist.esdPackaging;

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');

    if (!isChecklistComplete) {
      setValidationError('All 4 physical inspection criteria must be verified before accepting equipment return.');
      return;
    }

    if (returnMode === 'clean') {
      onComplete({
        checklist,
        returnType: 'clean',
        defectDetails: null,
      });
    } else {
      if (!defectDetails.conditionSummary.trim()) {
        setValidationError('Technician diagnostic findings note is required when routing hardware to the defect bench.');
        return;
      }
      onComplete({
        checklist,
        returnType: 'defect',
        defectDetails,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
      {/* Hardware Summary Card */}
      <div className="p-4 bg-white/[0.03] border border-white/[0.08] rounded-2xl space-y-2.5 backdrop-blur-xl">
        <div className="flex items-center justify-between text-xs pb-2 border-b border-white/[0.06]">
          <span className="text-zinc-400">Inspecting Hardware Asset</span>
          <span className="font-semibold text-white px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10">
            {loan.assetTag}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400">Nomenclature</span>
          <span className="text-white font-medium truncate max-w-[280px]">{loan.nomenclature}</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400">Borrower PRN & Name</span>
          <span className="text-zinc-200">
            {loan.borrowerPrn} ({loan.borrowerName})
          </span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400">Academic Project</span>
          <span className="text-zinc-300">{loan.projectId}</span>
        </div>

        <div className="flex items-center justify-between text-xs">
          <span className="text-zinc-400">Loan Due Date</span>
          <span className="text-zinc-300">{loan.dueDate?.split(' ')[0]}</span>
        </div>
      </div>

      {/* Mandatory Condition Checklist */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="block text-[11px] font-sans uppercase tracking-wider text-zinc-400 font-semibold">
            Multi-Point Physical Return Checklist
          </label>
          <span className="text-[11px] text-zinc-500">
            {Object.values(checklist).filter(Boolean).length} of 4 confirmed
          </span>
        </div>

        <div className="space-y-2">
          {/* Item 1 */}
          <label className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer">
            <input
              type="checkbox"
              checked={checklist.physicalIntegrity}
              onChange={() => handleCheckboxChange('physicalIntegrity')}
              className="mt-0.5 rounded border-white/20 text-white focus:ring-0 bg-white/5 cursor-pointer accent-white"
            />
            <div className="space-y-0.5">
              <span className="font-medium text-white text-xs">Physical PCB & Connector Integrity</span>
              <p className="text-[11px] text-zinc-400">
                Pins straight, PCB unbroken, solder joints, GPIO headers & enclosure casing intact
              </p>
            </div>
          </label>

          {/* Item 2 */}
          <label className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer">
            <input
              type="checkbox"
              checked={checklist.powerTest}
              onChange={() => handleCheckboxChange('powerTest')}
              className="mt-0.5 rounded border-white/20 text-white focus:ring-0 bg-white/5 cursor-pointer accent-white"
            />
            <div className="space-y-0.5">
              <span className="font-medium text-white text-xs">Functional Power Rail & LED Test</span>
              <p className="text-[11px] text-zinc-400">
                Power indicator LED illuminates steadily; no dead shorts detected across 3.3V/5V rails
              </p>
            </div>
          </label>

          {/* Item 3 */}
          <label className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer">
            <input
              type="checkbox"
              checked={checklist.accessoriesPresent}
              onChange={() => handleCheckboxChange('accessoriesPresent')}
              className="mt-0.5 rounded border-white/20 text-white focus:ring-0 bg-white/5 cursor-pointer accent-white"
            />
            <div className="space-y-0.5">
              <span className="font-medium text-white text-xs">Accessories & Cabling Accounted For</span>
              <p className="text-[11px] text-zinc-400">
                USB-C cable, heatsink, Wi-Fi antenna, power adapter, or oscilloscope probe leads verified
              </p>
            </div>
          </label>

          {/* Item 4 */}
          <label className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:border-white/20 transition-all cursor-pointer">
            <input
              type="checkbox"
              checked={checklist.esdPackaging}
              onChange={() => handleCheckboxChange('esdPackaging')}
              className="mt-0.5 rounded border-white/20 text-white focus:ring-0 bg-white/5 cursor-pointer accent-white"
            />
            <div className="space-y-0.5">
              <span className="font-medium text-white text-xs">ESD Conductive Shielding</span>
              <p className="text-[11px] text-zinc-400">
                Returned securely in collegiate anti-static bubble envelope or conductive pouch
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* Triage Decision Mode */}
      <div className="pt-2">
        <label className="block text-[11px] font-sans uppercase tracking-wider text-zinc-400 mb-2 font-semibold">
          Triage Decision Mode
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => {
              setReturnMode('clean');
              setValidationError('');
            }}
            className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2 font-sans text-xs transition-all cursor-pointer ${
              returnMode === 'clean'
                ? 'bg-white text-black font-semibold shadow-md border-white'
                : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:bg-white/[0.05]'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Accept Clean Return
          </button>

          <button
            type="button"
            onClick={() => {
              setReturnMode('defect');
              setValidationError('');
            }}
            className={`p-3.5 rounded-2xl border flex items-center justify-center gap-2 font-sans text-xs transition-all cursor-pointer ${
              returnMode === 'defect'
                ? 'bg-rose-500/20 border-rose-500/40 text-rose-300 font-semibold shadow-md'
                : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:bg-white/[0.05]'
            }`}
          >
            <Wrench className="w-4 h-4 text-rose-400" />
            Route to Defect Log
          </button>
        </div>
      </div>

      {/* Defect Details Form when mode === 'defect' */}
      {returnMode === 'defect' && (
        <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl space-y-3 pt-3">
          <div className="flex items-center gap-2 text-rose-300 font-sans text-xs font-semibold">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            Defect Quarantine Logging Parameters
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-sans text-zinc-400 uppercase font-semibold">
                Defect Severity
              </label>
              <select
                value={defectDetails.severity}
                onChange={(e) => setDefectDetails({ ...defectDetails, severity: e.target.value })}
                className="w-full mt-1 bg-[#111317] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400 cursor-pointer"
              >
                <option value="Minor">Minor (Bent header pin / light scratches)</option>
                <option value="Moderate">Moderate (Port damaged / flaky boot)</option>
                <option value="Critical / Bricked">Critical / Bricked (EOS / burnt MCU)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-sans text-zinc-400 uppercase font-semibold">
                Category
              </label>
              <select
                value={defectDetails.defectCategory}
                onChange={(e) => setDefectDetails({ ...defectDetails, defectCategory: e.target.value })}
                className="w-full mt-1 bg-[#111317] border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400 cursor-pointer"
              >
                <option value="Physical Damage (Port/Connector)">Physical Damage</option>
                <option value="Electrical Overstress (EOS)">Electrical Overstress</option>
                <option value="Missing Component / Probe">Missing Component</option>
                <option value="Firmware Flash Failure">Firmware Failure</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-sans text-zinc-400 uppercase font-semibold">
              Technician Diagnostic Notes <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={2}
              value={defectDetails.conditionSummary}
              onChange={(e) => setDefectDetails({ ...defectDetails, conditionSummary: e.target.value })}
              placeholder="e.g. Solder pad lifted on pin 14; 5V rail shorted to ground..."
              className="w-full mt-1 bg-[#111317] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-rose-400 font-sans"
            />
          </div>
        </div>
      )}

      {/* Inline Validation Warning (Replaces window.alert) */}
      {validationError && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-rose-300 text-xs">
          <Info className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded-full border border-white/10 font-sans text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          Cancel
        </button>

        <button
          type="submit"
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-sans text-xs font-semibold tracking-wide transition-all shadow-md cursor-pointer ${
            returnMode === 'clean'
              ? 'bg-white hover:bg-neutral-200 text-black'
              : 'bg-rose-600 hover:bg-rose-500 text-white'
          }`}
        >
          {returnMode === 'clean' ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Verify & Restock to Active Inventory</span>
            </>
          ) : (
            <>
              <Wrench className="w-4 h-4" />
              <span>Flag Defect & Route to Bench</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default InspectionForm;
