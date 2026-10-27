import React, { useState } from 'react';
import {
  CheckCircle2,
  Wrench,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';

export function InspectionForm({ loan, onComplete, onCancel }) {
  const [checklist, setChecklist] = useState({
    physicalIntegrity: false,
    powerTest: false,
    accessoriesPresent: false,
  });

  const [returnMode, setReturnMode] = useState('clean'); // 'clean' | 'defect'
  const [defectDetails, setDefectDetails] = useState({
    severity: 'Moderate',
    defectCategory: 'Physical Damage (Port/Connector)',
    conditionSummary: '',
  });

  const handleCheckboxChange = (key) => {
    setChecklist((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isChecklistComplete =
    checklist.physicalIntegrity &&
    checklist.powerTest &&
    checklist.accessoriesPresent;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isChecklistComplete) {
      alert('All physical verification checklist items must be confirmed before check-in.');
      return;
    }

    if (returnMode === 'clean') {
      onComplete({
        mode: 'clean',
        condition: 'Nominal / Certified Restock',
      });
    } else {
      if (!defectDetails.conditionSummary.trim()) {
        alert('Please provide diagnosis summary for the defect log.');
        return;
      }
      onComplete({
        mode: 'defect',
        ...defectDetails,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
      {/* Loan Summary Badge */}
      <div className="p-4 bg-white/[0.03] border border-white/10 rounded-2xl space-y-2 font-sans">
        <div className="flex justify-between items-center text-zinc-400">
          <span>Asset Tag:</span>
          <span className="font-semibold text-[#c9b8a0]">{loan.assetTag}</span>
        </div>
        <div className="flex justify-between items-center text-zinc-400">
          <span>Hardware:</span>
          <span className="text-white font-medium truncate max-w-[240px]">{loan.nomenclature}</span>
        </div>
        <div className="flex justify-between items-center text-zinc-400">
          <span>Borrower PRN:</span>
          <span className="text-zinc-300">{loan.borrowerPrn} ({loan.borrowerName})</span>
        </div>
        <div className="flex justify-between items-center text-zinc-400">
          <span>Project Team:</span>
          <span className="text-zinc-300">{loan.projectId}</span>
        </div>
      </div>

      {/* Mandatory Condition Checklist */}
      <div className="space-y-2.5">
        <label className="block text-[11px] font-sans uppercase tracking-wider text-[#c9b8a0] font-semibold">
          Digital Return Verification Checklist
        </label>

        <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/[0.02] border border-white/10 cursor-pointer hover:bg-white/[0.04] transition-colors">
          <input
            type="checkbox"
            checked={checklist.physicalIntegrity}
            onChange={() => handleCheckboxChange('physicalIntegrity')}
            className="mt-0.5 rounded border-white/20 text-[#c9b8a0] focus:ring-0 focus:ring-offset-0 bg-white/5"
          />
          <div className="space-y-0.5">
            <span className="font-medium text-white">Physical Integrity</span>
            <p className="text-[11px] text-zinc-400 font-sans">Pins straight, PCB unbroken, solder joints & enclosure intact</p>
          </div>
        </label>

        <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/[0.02] border border-white/10 cursor-pointer hover:bg-white/[0.04] transition-colors">
          <input
            type="checkbox"
            checked={checklist.powerTest}
            onChange={() => handleCheckboxChange('powerTest')}
            className="mt-0.5 rounded border-white/20 text-[#c9b8a0] focus:ring-0 focus:ring-offset-0 bg-white/5"
          />
          <div className="space-y-0.5">
            <span className="font-medium text-white">Functional Power Test</span>
            <p className="text-[11px] text-zinc-400 font-sans">Power LED illuminates, no short-circuits on 3.3V/5V rails</p>
          </div>
        </label>

        <label className="flex items-start gap-2.5 p-3 rounded-2xl bg-white/[0.02] border border-white/10 cursor-pointer hover:bg-white/[0.04] transition-colors">
          <input
            type="checkbox"
            checked={checklist.accessoriesPresent}
            onChange={() => handleCheckboxChange('accessoriesPresent')}
            className="mt-0.5 rounded border-white/20 text-[#c9b8a0] focus:ring-0 focus:ring-offset-0 bg-white/5"
          />
          <div className="space-y-0.5">
            <span className="font-medium text-white">Accessories & Cables Present</span>
            <p className="text-[11px] text-zinc-400 font-sans">USB cable, antenna, cooling shroud, or probe leads accounted for</p>
          </div>
        </label>
      </div>

      {/* Mode Selector */}
      <div className="pt-2">
        <label className="block text-[11px] font-sans uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">
          Triage Decision Mode
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setReturnMode('clean')}
            className={`p-3 rounded-2xl border flex items-center justify-center gap-2 font-sans text-xs transition-all cursor-pointer ${
              returnMode === 'clean'
                ? 'bg-[#c9b8a0]/20 border-[#c9b8a0]/40 text-[#f5e6c8] font-semibold shadow-sm'
                : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:bg-white/[0.05]'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-[#c9b8a0]" />
            Accept Clean Return
          </button>

          <button
            type="button"
            onClick={() => setReturnMode('defect')}
            className={`p-3 rounded-2xl border flex items-center justify-center gap-2 font-sans text-xs transition-all cursor-pointer ${
              returnMode === 'defect'
                ? 'bg-[#c9b8a0]/20 border-[#c9b8a0]/50 text-[#f5e6c8] font-semibold shadow-sm'
                : 'bg-white/[0.02] border-white/10 text-zinc-400 hover:bg-white/[0.05]'
            }`}
          >
            <Wrench className="w-4 h-4 text-[#c9b8a0]" />
            Route to Defect Log
          </button>
        </div>
      </div>

      {/* Defect Details Form when mode === 'defect' */}
      {returnMode === 'defect' && (
        <div className="p-4 bg-[#c9b8a0]/10 border border-[#c9b8a0]/25 rounded-2xl space-y-3 pt-3">
          <div className="flex items-center gap-1.5 text-[#f5e6c8] font-sans text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" />
            Defect Condition Logging Parameters
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block text-[10px] font-sans text-zinc-400 uppercase font-semibold">Defect Severity</label>
              <select
                value={defectDetails.severity}
                onChange={(e) => setDefectDetails({ ...defectDetails, severity: e.target.value })}
                className="w-full mt-1 bg-[#141417] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
              >
                <option value="Minor">Minor (Scratches/Bent pin)</option>
                <option value="Moderate">Moderate (Port damaged/Intermittent)</option>
                <option value="Critical / Bricked">Critical / Bricked (EOS/Burnt MCU)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-sans text-zinc-400 uppercase font-semibold">Category</label>
              <select
                value={defectDetails.defectCategory}
                onChange={(e) => setDefectDetails({ ...defectDetails, defectCategory: e.target.value })}
                className="w-full mt-1 bg-[#141417] border border-white/15 rounded-xl px-3 py-2 text-xs text-white"
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
              Technician Diagnostic Notes
            </label>
            <textarea
              rows={2}
              value={defectDetails.conditionSummary}
              onChange={(e) => setDefectDetails({ ...defectDetails, conditionSummary: e.target.value })}
              placeholder="Describe physical flaw or electrical test result..."
              className="w-full mt-1 bg-[#141417] border border-white/15 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#c9b8a0] font-sans"
            />
          </div>
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
          className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-sans text-xs font-semibold tracking-wide transition-all shadow-sm cursor-pointer ${
            returnMode === 'clean'
              ? 'bg-gradient-to-r from-[#c9b8a0] via-[#e2d2bc] to-[#f5e6c8] hover:opacity-95 text-black'
              : 'bg-white hover:bg-neutral-200 text-black font-bold shadow-md'
          }`}
        >
          {returnMode === 'clean' ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Restock & Advance FIFO Queue</span>
            </>
          ) : (
            <>
              <Wrench className="w-3.5 h-3.5" />
              <span>Flag Defect & Route to Bench</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default InspectionForm;
