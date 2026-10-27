import React, { useState } from 'react';
import { useLabData } from '../../context/LabDataContext';
import { useAuth } from '../../context/AuthContext';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import {
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  Archive,
  FileText,
  Clock } from 'lucide-react';

export function DefectManagementPage() {
  const { defects, updateDefectStatus, retireAsset } = useLabData();
  const { role } = useAuth();

  const [selectedDefect, setSelectedDefect] = useState(null);
  const [newStatus, setNewStatus] = useState('Under Inspection');
  const [actionPlan, setActionPlan] = useState('');

  const [retireDefect, setRetireDefect] = useState(null);

  const handleOpenStatusModal = (defect) => {
    setSelectedDefect(defect);
    setNewStatus(defect.repairStatus);
    setActionPlan(defect.resolutionPlan || '');
  };

  const handleSaveStatus = async (e) => {
    e.preventDefault();
    if (!selectedDefect) return;
    await updateDefectStatus(selectedDefect.id, newStatus, actionPlan);
    setSelectedDefect(null);
  };

  const handleConfirmRetire = async () => {
    if (!retireDefect) return;
    await retireAsset(retireDefect.id);
    setRetireDefect(null);
  };

  const columns = [
    {
      header: 'Defect ID & Date',
      accessor: 'id',
      width: '160px',
      render: (row) => (
        <div className="font-sans text-xs">
          <div className="font-semibold text-[#f5e6c8]">{row.id}</div>
          <div className="text-zinc-500 text-[11px] mt-0.5">{row.reportedDate?.split(' ')[0]}</div>
        </div>
      ) },
    {
      header: 'Hardware Asset',
      accessor: 'nomenclature',
      render: (row) => (
        <div>
          <div className="font-medium text-white">{row.nomenclature}</div>
          <div className="font-sans text-[11px] text-zinc-400 mt-0.5">
            Tag: <span className="text-[#c9b8a0] font-semibold">{row.assetTag}</span> • Category: {row.defectCategory}
          </div>
        </div>
      ) },
    {
      header: 'Severity',
      accessor: 'severity',
      width: '140px',
      render: (row) => <StatusBadge status={row.severity} type="severity" size="xs" /> },
    {
      header: 'Diagnosis Summary & Responsible Project',
      accessor: 'conditionSummary',
      render: (row) => (
        <div className="space-y-0.5 font-sans text-xs">
          <div className="text-zinc-300">{row.conditionSummary}</div>
          <div className="text-[11px] text-zinc-500">
            Logged from PRN: {row.associatedPrn} ({row.associatedProject})
          </div>
        </div>
      ) },
    {
      header: 'Repair Status',
      accessor: 'repairStatus',
      width: '160px',
      render: (row) => {
        let badgeColor = 'bg-white/[0.04] text-zinc-300 border-white/10';
        if (row.repairStatus === 'Repaired') badgeColor = 'bg-[#c9b8a0]/15 text-[#f5e6c8] border-[#c9b8a0]/30';
        else if (row.repairStatus === 'Under Inspection') badgeColor = 'bg-[#c9b8a0]/15 text-[#f5e6c8] border-[#c9b8a0]/30';
        else if (row.repairStatus === 'Decommissioned') badgeColor = 'bg-white/[0.04] text-zinc-400 border-white/10';

        return (
          <span className={`px-2.5 py-0.5 rounded-full font-sans text-[11px] font-semibold border ${badgeColor}`}>
            {row.repairStatus}
          </span>
        );
      } },
    {
      header: 'Actions',
      width: '180px',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-2 font-sans text-xs">
          <button
            onClick={() => handleOpenStatusModal(row)}
            className="p-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
            title="Update Triage Status"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          {role === 'HoD / Admin' && row.repairStatus !== 'Decommissioned' && (
            <button
              onClick={() => setRetireDefect(row)}
              className="p-1.5 rounded-full bg-white/[0.04] hover:bg-white/10 text-zinc-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
              title="Decommission & Retire Asset"
            >
              <Archive className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      ) },
  ];

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div>
          <div className="text-[11px] font-sans font-semibold text-[#c9b8a0] tracking-wider uppercase flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9b8a0]" />
            LAB OPERATIONS & BENCH TRIAGE
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white flex items-center gap-2">
            Hardware Defect Triage & Maintenance Bench
          </h1>
          <p className="text-xs font-sans text-zinc-400 mt-1 max-w-xl">
            Diagnostic incident log, repair pipeline tracking, and administrative asset decommissioning.
          </p>
        </div>

        <div className="text-xs font-sans text-zinc-300 px-3.5 py-1.5 bg-white/[0.03] border border-white/10 rounded-full shadow-sm">
          Active Defect Incidents: <span className="text-[#f5e6c8] font-bold">{defects.length}</span>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={defects}
        pageSize={10}
        emptyMessage="No hardware defects currently registered."
      />

      {/* Update Repair Status Modal */}
      <Modal
        isOpen={!!selectedDefect}
        onClose={() => setSelectedDefect(null)}
        title={`Update Triage Status: ${selectedDefect?.id}`}
        subtitle={`Asset: ${selectedDefect?.assetTag} (${selectedDefect?.nomenclature})`}
      >
        <form onSubmit={handleSaveStatus} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block text-[11px] font-sans uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">
              Repair / Diagnostic Status
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-xl px-3.5 py-2.5 font-sans text-white focus:outline-none focus:border-[#a78b71]"
            >
              <option value="Under Inspection" className="bg-[#141417]">Under Inspection (Diagnostic Bench)</option>
              <option value="Awaiting Parts" className="bg-[#141417]">Awaiting Parts (Components on order)</option>
              <option value="Sent to Vendor" className="bg-[#141417]">Sent to Vendor (Manufacturer RMA)</option>
              <option value="Repaired" className="bg-[#141417]">Repaired (Verified Operational & Restocked)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-sans uppercase tracking-wider text-zinc-400 mb-1.5 font-semibold">
              Technician Action Plan / Resolution Notes
            </label>
            <textarea
              rows={3}
              value={actionPlan}
              onChange={(e) => setActionPlan(e.target.value)}
              placeholder="e.g. Solder rework completed on pin header; tested 3.3V continuity..."
              className="w-full px-3.5 py-2.5 bg-white/[0.04] border border-white/10 rounded-xl text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#a78b71] font-sans text-xs leading-relaxed"
            />
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={() => setSelectedDefect(null)}
              className="px-4 py-2 rounded-full border border-white/10 font-sans text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-white hover:bg-[#f5e6c8] font-sans text-xs font-semibold text-black transition-colors cursor-pointer"
            >
              Save Triage State
            </button>
          </div>
        </form>
      </Modal>

      {/* Retire Asset Modal (Admin Only) */}
      <Modal
        isOpen={!!retireDefect}
        onClose={() => setRetireDefect(null)}
        title="Institutional Asset Decommissioning"
        subtitle="Permanent removal of hardware from collegiate active registry."
      >
        <div className="space-y-4 text-xs font-sans">
          <div className="p-4 bg-[#c9b8a0]/10 border border-[#c9b8a0]/25 rounded-2xl text-[#f5e6c8] space-y-1.5 font-sans">
            <div className="font-bold uppercase text-[11px] flex items-center gap-1.5 text-[#f5e6c8]">
              <AlertTriangle className="w-4 h-4 text-[#c9b8a0]" />
              Administrative Decommission Warning
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              Retiring asset <span className="font-bold text-white">{retireDefect?.assetTag}</span> will irrevocably write off the unit from collegiate lab books. An immutable retirement audit event will be recorded under your HoD credentials.
            </p>
          </div>

          <div className="p-4 bg-white/[0.02] rounded-2xl border border-white/10 font-sans text-xs space-y-1.5">
            <div className="text-zinc-400">Nomenclature: <span className="text-white font-medium">{retireDefect?.nomenclature}</span></div>
            <div className="text-zinc-400">Reported Failure: <span className="text-zinc-300">{retireDefect?.conditionSummary}</span></div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-white/10">
            <button
              onClick={() => setRetireDefect(null)}
              className="px-4 py-2 rounded-full border border-white/10 font-sans text-xs text-zinc-400 hover:text-white transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmRetire}
              className="px-5 py-2 rounded-full bg-white hover:bg-neutral-200 font-sans text-xs font-bold text-black shadow-md transition-colors cursor-pointer"
            >
              Confirm Asset Retirement
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default DefectManagementPage;
