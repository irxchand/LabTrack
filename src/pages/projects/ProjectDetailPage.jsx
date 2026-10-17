import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLabData } from '../../context/LabDataContext';
import { useAuth } from '../../context/AuthContext';
import {
  ArrowLeft,
  Users,
  Cpu,
  ShieldCheck,
  ShieldAlert,
  Check,
  Sparkles,
  Plus,
  X,
  Package,
  Layers,
  AlertCircle,
  FileCheck2,
} from 'lucide-react';

export function ProjectDetailPage() {
  const { projectId } = useParams();
  const { projects, activeLoans, inventory, allocateHardwareToProject } = useLabData();
  const { currentUser, role } = useAuth();
  const isStudent = !role || role === 'Student';
  const isFaculty = role === 'Faculty';
  const userPrn = currentUser?.prn || '202401048';

  const [isAllocModalOpen, setIsAllocModalOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [allocQty, setAllocQty] = useState(1);
  const [allocNotes, setAllocNotes] = useState('Allocated by faculty mentor for sprint validation');
  const [isSubmittingAlloc, setIsSubmittingAlloc] = useState(false);
  const [allocError, setAllocError] = useState('');

  const project = projects.find((p) => p.id === projectId);
  const assignedLoans = activeLoans.filter((l) => l.projectId === projectId);

  const isFacultyLeadOrMentor = useMemo(() => {
    if (!isFaculty || !project) return false;
    const isMentor = project.mentorName && currentUser?.name && (
      project.mentorName.toLowerCase().includes(currentUser.name.toLowerCase()) ||
      currentUser.name.toLowerCase().includes(project.mentorName.toLowerCase())
    );
    const isLead =
      project.facultyLead === currentUser?.name ||
      project.teamLeaderPrn === currentUser?.prn ||
      project.id === currentUser?.projectId;
    return isMentor || isLead;
  }, [isFaculty, project, currentUser]);

  const isUserProject = (p) => {
    if (!p) return false;
    return (
      p.teamLeaderPrn === userPrn ||
      p.members?.some((m) => m.prn === userPrn) ||
      p.id === currentUser?.projectId
    );
  };

  const formatHumanDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    try {
      const d = new Date(dateStr.split(' ')[0]);
      if (isNaN(d.getTime())) return dateStr;
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const getItemImage = (item) => {
    if (!item) return '/images/hardware/raspberry-pi-5.jpg';
    if (item.image) return item.image;

    const match = inventory?.find(
      (i) =>
        i.id === item.assetTag ||
        i.assetTag === item.assetTag ||
        i.id === item.itemId ||
        (i.nomenclature && item.nomenclature && (
          i.nomenclature.toLowerCase().includes(item.nomenclature.toLowerCase()) ||
          item.nomenclature.toLowerCase().includes(i.nomenclature.toLowerCase())
        ))
    );
    if (match?.image) return match.image;

    const nom = item.nomenclature?.toLowerCase() || '';
    if (nom.includes('oled') || nom.includes('display')) return '/images/hardware/oled-display.jpg';
    if (nom.includes('jetson') || nom.includes('orin') || nom.includes('nano')) return '/images/hardware/jetson-nano.jpg';
    if (nom.includes('arduino') || nom.includes('uno')) return '/images/hardware/arduino-uno-r3.jpg';
    if (nom.includes('esp32') || nom.includes('micro') || nom.includes('wroom')) return '/images/hardware/esp32-wroom.jpg';
    if (nom.includes('oscilloscope') || nom.includes('rigol')) return '/images/hardware/oscilloscope.jpg';
    if (nom.includes('jumper') || nom.includes('wire') || nom.includes('ribbon')) return '/images/hardware/jumper-wires.jpg';
    if (nom.includes('breadboard')) return '/images/hardware/breadboard-830.jpg';
    if (nom.includes('sensor') || nom.includes('imu') || nom.includes('mpu') || nom.includes('bmp')) return '/images/hardware/bmp280-sensor.jpg';
    if (nom.includes('resistor')) return '/images/hardware/resistors-pack.jpg';
    return '/images/hardware/raspberry-pi-5.jpg';
  };

  if (!project) {
    return (
      <div className="p-16 text-center space-y-4 max-w-md mx-auto">
        <h2 className="font-display text-xl font-semibold text-white">
          Project Not Found
        </h2>
        <p className="text-sm font-sans text-zinc-400">
          Identifier "{projectId}" is not registered in the institutional repository.
        </p>
        <Link
          to="/workspace/projects"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-[#c9b8a0] via-[#e2d2bc] to-[#f5e6c8] hover:opacity-95 text-black font-semibold text-xs transition-all shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Academic Projects</span>
        </Link>
      </div>
    );
  }

  // Student Privacy: If student attempts to view a project they do not belong to
  if (isStudent && !isUserProject(project)) {
    return (
      <div className="p-16 text-center space-y-4 max-w-md mx-auto">
        <div className="w-14 h-14 rounded-full bg-[#c9b8a0]/15 border border-[#c9b8a0]/30 flex items-center justify-center mx-auto text-[#f5e6c8] shadow-[0_0_20px_rgba(201,184,160,0.2)]">
          <ShieldAlert className="w-7 h-7" />
        </div>
        <h2 className="font-display text-2xl font-semibold text-white">
          Restricted Project Dossier
        </h2>
        <p className="text-sm font-sans text-zinc-400 leading-relaxed">
          Project group "{projectId}" belongs to another academic team. In accordance with institutional confidentiality, students may only view projects they lead or actively collaborate on.
        </p>
        <Link
          to="/workspace/projects"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#c9b8a0] via-[#e2d2bc] to-[#f5e6c8] hover:opacity-95 text-black font-semibold text-xs transition-all shadow-[0_0_15px_rgba(201,184,160,0.3)] mt-2"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-black" />
          <span>Back to My Projects</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="pb-5 border-b border-white/10 space-y-3">
        <div>
          <Link
            to="/workspace/projects"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-sans text-zinc-300 hover:text-white transition-all mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Academic Projects</span>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[11px] font-sans font-medium text-zinc-300">
                {project.courseCode}
              </span>
              <span className="text-xs font-sans text-zinc-400">
                Project Group <span className="text-zinc-200 font-medium">{project.id}</span>
              </span>
              <span className="w-1 h-1 rounded-full bg-zinc-600" />
              <span className="text-xs font-sans text-zinc-500">
                {project.academicTerm || 'Autumn 2026'}
              </span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white mt-1">
              {project.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/10 text-right backdrop-blur-md">
              <div className="text-zinc-500 text-[10px] font-sans uppercase tracking-wider">Custody Quota</div>
              <div className="font-sans text-sm font-semibold text-white">
                {assignedLoans.length} / {project.hardwareBudgetCap} units
              </div>
              <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden mt-1.5">
                <div
                  className="bg-gradient-to-r from-[#c9b8a0] via-[#e2d2bc] to-[#f5e6c8] h-full rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(201,184,160,0.6)]"
                  style={{ width: `${Math.min(100, (assignedLoans.length / (project.hardwareBudgetCap || 1)) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Abstract and Active Hardware */}
        <div className="md:col-span-2 space-y-6">
          {/* Abstract */}
          <div className="p-6 bg-gradient-to-b from-[#141417]/95 to-[#0c0c0e]/95 border border-white/10 rounded-3xl space-y-2 backdrop-blur-xl shadow-lg">
            <div className="text-[10px] font-sans uppercase tracking-wider text-[#c9b8a0] font-semibold">
              Project Abstract & Scope
            </div>
            <p className="text-zinc-300 leading-relaxed font-sans text-sm">{project.abstract}</p>
          </div>

          {/* Assigned Hardware */}
          <div className="p-6 bg-gradient-to-b from-[#141417]/95 to-[#0c0c0e]/95 border border-white/10 rounded-3xl space-y-4 backdrop-blur-xl shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-3 gap-2">
              <div className="flex items-center gap-2">
                <span className="text-[#f5e6c8] uppercase text-[11px] font-semibold tracking-wider font-sans flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-[#c9b8a0]" />
                  Active Hardware Borrowings ({assignedLoans.length})
                </span>
                <span className="text-zinc-500 font-sans text-xs">
                  • Quota: {project.hardwareBudgetCap - assignedLoans.length} remaining
                </span>
              </div>

              {isFacultyLeadOrMentor && (
                <button
                  type="button"
                  onClick={() => {
                    const firstAvailable = inventory.find((i) => i.availableStock > 0) || inventory[0];
                    setSelectedAssetId(firstAvailable?.id || '');
                    setAllocQty(1);
                    setAllocNotes(project.isFacultyProject ? 'Allocated for faculty laboratory research' : 'Allocated by faculty mentor for capstone sprint');
                    setAllocError('');
                    setIsAllocModalOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-[#f5e6c8] text-black font-semibold text-xs transition-all shadow-[0_2px_10px_rgba(255,255,255,0.2)] cursor-pointer active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5 text-black" />
                  <span>Allocate Hardware</span>
                </button>
              )}
            </div>

            {assignedLoans.length > 0 ? (
              <div className="divide-y divide-white/5">
                {assignedLoans.map((loan) => (
                  <div key={loan.id} className="py-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-14 h-14 rounded-2xl bg-black/60 border border-white/10 p-2 flex items-center justify-center flex-shrink-0 shadow-inner">
                        <img
                          src={getItemImage(loan)}
                          alt={loan.nomenclature}
                          className="max-h-full max-w-full object-contain filter drop-shadow-sm"
                          onError={(e) => {
                            e.target.src = '/images/hardware/raspberry-pi-5.jpg';
                          }}
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-white font-semibold font-sans text-sm truncate">{loan.nomenclature}</div>
                        <div className="text-[#c9b8a0] font-sans font-medium text-xs mt-0.5">{loan.assetTag}</div>
                      </div>
                    </div>

                    <div className="text-right text-xs font-sans flex-shrink-0">
                      <div className="text-zinc-400">Due {formatHumanDate(loan.dueDate)}</div>
                      <div className="text-amber-400 font-medium text-[11px] mt-0.5">{loan.daysRemaining} days remaining</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-zinc-500 py-8 text-center text-xs font-sans space-y-1">
                <div>No active hardware loans currently checked out to this project team.</div>
                <div className="text-zinc-600">Browse the Workstation catalog to request hardware under this project's allocation quota.</div>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Team Members & Mentor */}
        <div className="space-y-6">
          {/* Faculty Guide */}
          <div className="p-6 bg-gradient-to-b from-[#141417]/95 to-[#0c0c0e]/95 border border-white/10 rounded-3xl space-y-2 backdrop-blur-xl shadow-lg">
            <div className="text-[#c9b8a0] text-[10px] uppercase font-semibold tracking-wider font-sans">Faculty Mentor</div>
            <div className="flex items-center gap-3 pt-1">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-white/20 to-white/5 border border-white/10 text-white font-semibold text-sm flex items-center justify-center shadow-sm">
                {(project.mentorName || 'F').charAt(0)}
              </div>
              <div>
                <div className="text-white font-semibold text-base font-sans">{project.mentorName}</div>
                <div className="text-zinc-400 text-xs font-sans">{project.department}</div>
              </div>
            </div>
            <div className="text-zinc-400 text-xs font-sans pt-1 flex items-center gap-1.5">
              <span className="text-zinc-500">Academic Term:</span>
              <span className="text-zinc-300 font-medium">{project.academicTerm}</span>
            </div>
          </div>

          {/* Members List */}
          <div className="p-6 bg-gradient-to-b from-[#141417]/95 to-[#0c0c0e]/95 border border-white/10 rounded-3xl space-y-4 backdrop-blur-xl shadow-lg">
            <div className="text-[#f5e6c8] uppercase text-[11px] font-semibold tracking-wider font-sans flex items-center gap-2 border-b border-white/10 pb-3">
              <Users className="w-4 h-4 text-[#c9b8a0]" />
              Team Roster ({project.members?.length || 0})
            </div>

            <div className="divide-y divide-white/5">
              {project.members?.map((member) => (
                <div key={member.prn} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-7 h-7 rounded-full bg-white/10 border border-white/10 text-white font-semibold text-[11px] flex items-center justify-center flex-shrink-0">
                      {member.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-white text-xs font-sans truncate">{member.name}</div>
                      <div className="text-zinc-500 text-[11px] font-sans truncate">{member.role}</div>
                    </div>
                  </div>

                  <span className="text-zinc-300 text-xs font-sans font-medium px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 flex-shrink-0">
                    {member.prn}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Faculty Direct Allocation Modal */}
      {isAllocModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-xl rounded-3xl bg-gradient-to-b from-[#141417] to-[#0c0c0e] border border-white/15 p-6 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.9)] space-y-5 animate-in fade-in zoom-in-95 duration-150">
            {/* Top specular reflection */}
            <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none" />

            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[10px] font-medium text-zinc-300 mb-1.5">
                  <FileCheck2 className="w-3 h-3 text-[#c9b8a0]" />
                  <span>Faculty Allocation Authority</span>
                </div>
                <h3 className="font-display text-lg font-semibold text-white">
                  Direct Allocate to {project.title}
                </h3>
                <p className="text-zinc-400 text-xs mt-0.5">
                  {project.isFacultyProject ? 'Deploying to Faculty Research Lab' : `Mentored Team • ${project.courseCode}`}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAllocModalOpen(false)}
                className="w-8 h-8 rounded-full border border-white/10 bg-white/[0.04] hover:bg-white/[0.1] text-zinc-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Component Selector */}
              <div>
                <label className="text-xs font-medium text-zinc-200 block mb-2">
                  Select Laboratory Hardware Asset
                </label>
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1 no-scrollbar">
                  {inventory.map((item) => {
                    const isSelected = (selectedAssetId || inventory[0]?.id) === item.id;
                    const isAvailable = item.availableStock > 0;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setSelectedAssetId(item.id)}
                        className={`w-full p-2.5 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-white/[0.08] border-white/30 shadow-sm'
                            : 'bg-white/[0.02] border-white/10 hover:bg-white/[0.04]'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-black/60 border border-white/10 p-1 flex items-center justify-center flex-shrink-0">
                            <img
                              src={getItemImage(item)}
                              alt={item.nomenclature}
                              className="max-h-full max-w-full object-contain"
                              onError={(e) => {
                                e.target.src = '/images/hardware/raspberry-pi-5.jpg';
                              }}
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold text-white truncate">
                              {item.nomenclature}
                            </div>
                            <div className="text-[11px] text-[#c9b8a0]">{item.assetTag}</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-shrink-0">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                              isAvailable
                                ? 'bg-white/10 text-white'
                                : 'bg-rose-500/10 text-rose-300'
                            }`}
                          >
                            {item.availableStock} in depot
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quantity Stepper */}
              <div>
                <label className="text-xs font-medium text-zinc-200 block mb-1.5">
                  Allocation Quantity
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={allocQty}
                    onChange={(e) => setAllocQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-24 px-3 py-2 bg-white/[0.04] border border-white/15 rounded-xl text-xs text-white text-center focus:outline-none focus:border-white/30"
                  />
                  <span className="text-xs text-zinc-400">
                    Maximum units allowed per project: {project.hardwareBudgetCap}
                  </span>
                </div>
              </div>

              {/* Purpose / Rationale */}
              <div>
                <label className="text-xs font-medium text-zinc-200 block mb-1.5">
                  Faculty Authorization Rationale
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {[
                    'Sprint 3 Milestone Hardware',
                    'High-Priority Bench Validation',
                    'Lab 402 Practical Kit',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAllocNotes(preset)}
                      className="px-2.5 py-1 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 text-[11px] text-zinc-300 hover:text-white transition-colors cursor-pointer"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <textarea
                  value={allocNotes}
                  onChange={(e) => setAllocNotes(e.target.value)}
                  placeholder="Enter notes or conditions for this allocation..."
                  rows={2}
                  className="w-full px-3.5 py-2.5 bg-white/[0.03] border border-white/15 rounded-xl text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-white/30 leading-relaxed"
                />
              </div>

              {allocError && (
                <div className="flex items-center gap-1.5 text-xs text-rose-400">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{allocError}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsAllocModalOpen(false)}
                className="px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] text-xs font-medium text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmittingAlloc}
                onClick={async () => {
                  const targetItemId = selectedAssetId || inventory[0]?.id;
                  if (!targetItemId) {
                    setAllocError('Please select a hardware component.');
                    return;
                  }
                  setIsSubmittingAlloc(true);
                  setAllocError('');
                  try {
                    const ok = await allocateHardwareToProject({
                      projectId: project.id,
                      itemId: targetItemId,
                      quantity: allocQty,
                      notes: allocNotes,
                    });
                    if (ok) {
                      setIsAllocModalOpen(false);
                    }
                  } catch (err) {
                    setAllocError(err.message || 'Failed to allocate hardware.');
                  } finally {
                    setIsSubmittingAlloc(false);
                  }
                }}
                className="px-5 py-2 rounded-full bg-white text-black font-semibold text-xs transition-transform active:scale-95 shadow-[0_2px_12px_rgba(255,255,255,0.25)] flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5 text-black" />
                <span>{isSubmittingAlloc ? 'Allocating...' : 'Confirm Direct Allocation'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectDetailPage;
