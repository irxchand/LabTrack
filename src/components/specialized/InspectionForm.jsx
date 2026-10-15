import React, { useState } from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck, Wrench } from 'lucide-react';

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

  const allPassed =
    checklist.physicalIntegrity && checklist.powerTest && checklist.accessoriesPresent;

  const handleCheckboxChange = (field) => {
    setChecklist((prev) => {
      const updated = { ...prev, [field]: !prev[field] };
      // If any unchecked, default suggested mode is defect, else clean
      const willPass = updated.physicalIntegrity && updated.powerTest && updated.accessoriesPresent;
      if (!willPass && returnMode === 'clean') {
        // user can still choose
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onComplete({
      checklist,
      returnType: returnMode,
      defectDetails: returnMode === 'defect' ? defectDetails : null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
      {/* Loan Summary Badge */}
      <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-md space-y-1 font-mono">
        <div className="flex justify-between items-center text-zinc-400">
          <span>Asset Tag:</span>
          <span className="font-bold text-blue-400">{loan.assetTag}</span>
        </div>
        <div className="flex justify-between items-center text-zinc-400">
          <span>Hardware:</span>
          <span className="text-zinc-200 truncate max-w-[240px]">{loan.nomenclature}</span>
        </div>
        <div className="flex justify-between items-center text-zinc-400">
          <span>Borrower PRN:</span>
          <span className="text-zinc-200">{loan.borrowerPrn} ({loan.borrowerName})</span>
        </div>
        <div className="flex justify-between items-center text-zinc-400">
          <span>Project Team:</span>
          <span className="text-zinc-200">{loan.projectId}</span>
        </div>
      </div>

      {/* Mandatory Condition Checklist */}
      <div className="space-y-2.5">
        <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400">
          Digital Return Verification Checklist
        </label>

        <label className="flex items-start gap-2.5 p-2.5 rounded bg-zinc-950/60 border border-zinc-800 cursor-pointer hover:bg-zinc-800/40 transition-colors">
          <input
            type="checkbox"
            checked={checklist.physicalIntegrity}
            onChange={() => handleCheckboxChange('physicalIntegrity')}
            className="mt-0.5 rounded border-zinc-700 text-blue-600 focus:ring-0 focus:ring-offset-0 bg-zinc-900"
          />
          <div className="space-y-0.5">
            <span className="font-medium text-zinc-200">Physical Integrity</span>
            <p className="text-[11px] text-zinc-500 font-mono">Pins straight, PCB unbroken, solder joints & enclosure intact</p>
          </div>
        </label>

        <label className="flex items-start gap-2.5 p-2.5 rounded bg-zinc-950/60 border border-zinc-800 cursor-pointer hover:bg-zinc-800/40 transition-colors">
          <input
            type="checkbox"
            checked={checklist.powerTest}
            onChange={() => handleCheckboxChange('powerTest')}
            className="mt-0.5 rounded border-zinc-700 text-blue-600 focus:ring-0 focus:ring-offset-0 bg-zinc-900"
          />
          <div className="space-y-0.5">
            <span className="font-medium text-zinc-200">Functional Power Test</span>
            <p className="text-[11px] text-zinc-500 font-mono">Power LED illuminates, no short-circuits on 3.3V/5V rails</p>
          </div>
        </label>

        <label className="flex items-start gap-2.5 p-2.5 rounded bg-zinc-950/60 border border-zinc-800 cursor-pointer hover:bg-zinc-800/40 transition-colors">
          <input
            type="checkbox"
            checked={checklist.accessoriesPresent}
            onChange={() => handleCheckboxChange('accessoriesPresent')}
            className="mt-0.5 rounded border-zinc-700 text-blue-600 focus:ring-0 focus:ring-offset-0 bg-zinc-900"
          />
          <div className="space-y-0.5">
            <span className="font-medium text-zinc-200">Accessories & Cables Present</span>
            <p className="text-[11px] text-zinc-500 font-mono">USB cable, antenna, cooling shroud, or probe leads accounted for</p>
          </div>
        </label>
      </div>

      {/* Mode Selector */}
      <div className="pt-2">
        <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1.5">
          Triage Decision Mode
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setReturnMode('clean')}
            className={`p-2.5 rounded border flex items-center justify-center gap-2 font-mono text-xs transition-all ${
              returnMode === 'clean'
                ? 'bg-emerald-950/80 border-emerald-600 text-emerald-300 font-semibold shadow-sm'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Accept Clean Return
          </button>

          <button
            type="button"
            onClick={() => setReturnMode('defect')}
            className={`p-2.5 rounded border flex items-center justify-center gap-2 font-mono text-xs transition-all ${
              returnMode === 'defect'
                ? 'bg-rose-950/80 border-rose-600 text-rose-300 font-semibold shadow-sm'
                : 'bg-zinc-950 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
            }`}
          >
            <Wrench className="w-4 h-4 text-rose-400" />
            Route to Defect Log
          </button>
        </div>
      </div>

      {/* Defect Details Form when mode === 'defect' */}
      {returnMode === 'defect' && (
        <div className="p-3 bg-rose-950/30 border border-rose-900/50 rounded-md space-y-2.5 pt-2">
          <div className="flex items-center gap-1.5 text-rose-300 font-mono text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" />
            Defect Condition Logging Parameters
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[10px] font-mono text-zinc-400 uppercase">Defect Severity</label>
              <select
                value={defectDetails.severity}
                onChange={(e) => setDefectDetails({ ...defectDetails, severity: e.target.value })}
                className="w-full mt-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-200"
              >
                <option value="Minor">Minor (Scratches/Bent pin)</option>
                <option value="Moderate">Moderate (Port damaged/Intermittent)</option>
                <option value="Critical / Bricked">Critical / Bricked (EOS/Burnt MCU)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-mono text-zinc-400 uppercase">Category</label>
              <select
                value={defectDetails.defectCategory}
                onChange={(e) => setDefectDetails({ ...defectDetails, defectCategory: e.target.value })}
                className="w-full mt-1 bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-200"
              >
                <option value="Physical Damage (Port/Connector)">Physical Damage</option>
                <option value="Electrical Overstress (EOS)">Electrical Overstress</option>
                <option value="Missing Component / Probe">Missing Component</option>
                <option value="Firmware Flash Failure">Firmware Failure</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono text-zinc-400 uppercase">
              Technician Diagnostic Notes
            </label>
            <textarea
              rows={2}
              value={defectDetails.conditionSummary}
              onChange={(e) => setDefectDetails({ ...defectDetails, conditionSummary: e.target.value })}
              placeholder="Describe physical flaw or electrical test result..."
              className="w-full mt-1 bg-zinc-900 border border-zinc-700 rounded px-2.5 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex items-center justify-end gap-2 pt-3 border-t border-zinc-800">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 rounded border border-zinc-700 font-mono text-xs text-zinc-400 hover:bg-zinc-800 transition-colors"
        >
          Cancel
        </button>

        <button
          type="submit"
          className={`flex items-center gap-1.5 px-4 py-1.5 rounded font-mono text-xs font-semibold tracking-tight transition-all shadow-sm ${
            returnMode === 'clean'
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
              : 'bg-rose-600 hover:bg-rose-500 text-white'
          }`}
        >
          {returnMode === 'clean' ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              Restock & Advance FIFO Queue
            </>
          ) : (
            <>
              <Wrench className="w-3.5 h-3.5" />
              Flag Defect & Route to Bench
            </>
          )}
        </button>
      </div>
    </form>
  );
}
