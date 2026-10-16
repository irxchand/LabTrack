import React, { useState } from 'react';
import { useLabData } from '../../context/LabDataContext';
import { useAuth } from '../../context/AuthContext';
import { DataTable } from '../../components/common/DataTable';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Modal } from '../../components/common/Modal';
import {
  Wrench,
  AlertTriangle,
  Archive,
  CheckCircle2,
  Clock,
  Send,
  Eye,
  Sliders,
} from 'lucide-react';

export function DefectManagementPage() {
  const { defects, updateDefectStatus, retireAsset } = useLabData();
  const { role, permissions } = useAuth();

  // Status update modal
  const [selectedDefect, setSelectedDefect] = useState(null);
  const [newStatus, setNewStatus] = useState('Repaired');
  const [actionPlan, setActionPlan] = useState('');

  // Retire confirm modal
  const [retireDefect, setRetireDefect] = useState(null);

  const handleOpenStatusModal = (defect) => {
    setSelectedDefect(defect);
    setNewStatus(defect.repairStatus);
    setActionPlan(defect.actionPlan || '');
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
        <div className="font-mono text-xs">
          <div className="font-semibold text-rose-400">{row.id}</div>
          <div className="text-zinc-500 text-[11px]">{row.reportedDate?.split(' ')[0]}</div>
        </div>
      ),
    },
    {
      header: 'Hardware Asset',
      accessor: 'nomenclature',
      render: (row) => (
        <div>
          <div className="font-medium text-zinc-100">{row.nomenclature}</div>
          <div className="font-mono text-[11px] text-zinc-400">
            Tag: <span className="text-blue-400 font-semibold">{row.assetTag}</span> • Category: {row.defectCategory}
          </div>
        </div>
      ),
    },
    {
      header: 'Severity',
      accessor: 'severity',
      width: '140px',
      render: (row) => <StatusBadge status={row.severity} type="severity" size="xs" />,
    },
    {
      header: 'Diagnosis Summary & Responsible Project',
      accessor: 'conditionSummary',
      render: (row) => (
        <div className="space-y-0.5 font-mono text-xs">
          <div className="text-zinc-300">{row.conditionSummary}</div>
          <div className="text-[11px] text-zinc-500">
            Logged from PRN: {row.associatedPrn} ({row.associatedProject})
          </div>
        </div>
      ),
    },
    {
      header: 'Repair Status',
      accessor: 'repairStatus',
      width: '160px',
      render: (row) => {
        let badgeColor = 'bg-zinc-800 text-zinc-300 border-zinc-700';
        if (row.repairStatus === 'Repaired') badgeColor = 'bg-emerald-950 text-emerald-400 border-emerald-800';
        else if (row.repairStatus === 'Under Inspection') badgeColor = 'bg-amber-950 text-amber-400 border-amber-800';
        else if (row.repairStatus === 'Decommissioned') badgeColor = 'bg-red-950 text-red-500 border-red-900';

        return (
          <span className={`px-2 py-0.5 rounded font-mono text-[11px] uppercase font-semibold border ${badgeColor}`}>
            {row.repairStatus}
          </span>
        );
      },
    },
    {
      header: 'Actions',
      width: '180px',
      align: 'right',
      render: (row) => (
        <div className="flex items-center justify-end gap-1.5 font-mono text-xs">
          <button
            onClick={() => handleOpenStatusModal(row)}
            className="p-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            title="Update Triage Status"
          >
            <Sliders className="w-3.5 h-3.5" />
          </button>

          {permissions.canRetireAsset && !row.isRetired && (
            <button
              onClick={() => setRetireDefect(row)}
              className="px-2.5 py-1 rounded bg-red-950/60 hover:bg-red-900/80 text-red-300 border border-red-800/60 transition-colors flex items-center gap-1"
              title="Decommission hardware from department assets"
            >
              <Archive className="w-3 h-3" />
              Retire
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-800/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <Wrench className="w-5 h-5 text-blue-500" />
            Hardware Defect Triage & Maintenance Bench
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-0.5">
            Diagnostic incident log, repair pipeline tracking, and administrative asset decommissioning.
          </p>
        </div>

        <div className="text-xs font-mono text-zinc-400 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded">
          Active Defect Incidents: <span className="text-rose-400 font-bold">{defects.length}</span>
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
            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
              Repair / Diagnostic Status
            </label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded px-2.5 py-1.5 font-mono text-zinc-200 focus:outline-none focus:border-blue-500"
            >
              <option value="Under Inspection">Under Inspection (Diagnostic Bench)</option>
              <option value="Awaiting Parts">Awaiting Parts (Components on order)</option>
              <option value="Sent to Vendor">Sent to Vendor (Manufacturer RMA)</option>
              <option value="Repaired">Repaired (Verified Operational & Restocked)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
              Technician Action Plan / Resolution Notes
            </label>
            <textarea
              rows={3}
              value={actionPlan}
              onChange={(e) => setActionPlan(e.target.value)}
              placeholder="e.g. Solder rework completed on pin header; tested 3.3V continuity..."
              className="w-full px-2.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-blue-500 font-mono text-xs"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setSelectedDefect(null)}
              className="px-3 py-1.5 rounded border border-zinc-700 font-mono text-xs text-zinc-400 hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 font-mono text-xs font-semibold text-white"
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
          <div className="p-3 bg-red-950/40 border border-red-800/60 rounded text-red-200 space-y-1 font-mono">
            <div className="font-bold uppercase text-[11px] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              Administrative Decommission Warning
            </div>
            <p className="font-sans text-xs text-red-300">
              Retiring asset <span className="font-bold text-white">{retireDefect?.assetTag}</span> will irrevocably write off the unit from collegiate lab books. An immutable retirement audit event will be recorded under your HoD credentials.
            </p>
          </div>

          <div className="p-3 bg-zinc-950 rounded border border-zinc-800 font-mono text-xs space-y-1">
            <div className="text-zinc-500">Nomenclature: {retireDefect?.nomenclature}</div>
            <div className="text-zinc-500">Reported Failure: {retireDefect?.conditionSummary}</div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
            <button
              onClick={() => setRetireDefect(null)}
              className="px-3 py-1.5 rounded border border-zinc-700 font-mono text-xs text-zinc-400 hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmRetire}
              className="px-4 py-1.5 rounded bg-red-600 hover:bg-red-500 font-mono text-xs font-bold text-white shadow-sm"
            >
              Confirm Asset Retirement
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
