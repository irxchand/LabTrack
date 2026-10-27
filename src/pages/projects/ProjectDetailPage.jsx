import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLabData } from '../../context/LabDataContext';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Users, Cpu, ShieldCheck, ShieldAlert, Check, Sparkles, CheckCircle2 } from 'lucide-react';

export function ProjectDetailPage() {
  const { projectId } = useParams();
  const { projects, activeLoans, requisitions, inventory } = useLabData();
  const { currentUser, role } = useAuth();
  const isStudent = !role || role === 'Student';
  const userPrn = currentUser?.prn || '202401048';

  const project = projects.find((p) => p.id === projectId);
  const assignedLoans = activeLoans.filter((l) => l.projectId === projectId);
  const projectRequisitions = (requisitions || []).filter(
    (r) => r.projectId === projectId || r.courseCode === project?.courseCode
  );
  const returnedRequisitions = projectRequisitions.filter(
    (r) => r.status === 'Returned' || r.status === 'Returned & Restocked'
  );

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
    if (nom.includes('mpu') || nom.includes('imu') || nom.includes('gyro') || nom.includes('accelerometer')) return '/images/hardware/mpu6050-sensor.jpg';
    if (nom.includes('sensor') || nom.includes('bmp')) return '/images/hardware/bmp280-sensor.jpg';
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
              <div className="text-zinc-500 text-[10px] font-sans uppercase tracking-wider">Integrity Score</div>
              <div className="font-sans text-sm font-bold text-white">{project.reliabilityScore}%</div>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/10 text-right backdrop-blur-md">
              <div className="text-zinc-500 text-[10px] font-sans uppercase tracking-wider">Active Deployments</div>
              <div className="font-sans text-sm font-semibold text-white">
                {assignedLoans.length > 0 ? (
                  `${assignedLoans.length} ${assignedLoans.length === 1 ? 'unit' : 'units'}`
                ) : returnedRequisitions.length > 0 ? (
                  <span className="text-emerald-400 font-medium text-xs flex items-center gap-1.5 justify-end">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    0 (Restocked)
                  </span>
                ) : (
                  '0 units'
                )}
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
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[#f5e6c8] uppercase text-[11px] font-semibold tracking-wider font-sans flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#c9b8a0]" />
                Active Hardware Borrowings ({assignedLoans.length})
              </span>
              <span className="text-zinc-400 font-sans text-xs">
                In Field Deployment
              </span>
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
            ) : returnedRequisitions.length > 0 ? (
              <div className="py-6 px-4 rounded-2xl bg-emerald-500/[0.04] border border-emerald-500/20 text-center space-y-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-semibold text-sm">Custody Cleared • Hardware Returned & Restocked</h4>
                  <p className="text-zinc-400 text-xs mt-1 max-w-md mx-auto leading-relaxed">
                    All components previously checked out for this project ({returnedRequisitions.map((r) => r.item || r.nomenclature).join(', ')}) have been returned and verified by Lab Assistant. 0 units currently in field deployment.
                  </p>
                </div>
                <div className="pt-1">
                  <Link
                    to="/workspace/custody/requisitions?status=Returned"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-semibold text-xs transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    <span>View Return Receipt ({returnedRequisitions[0].id})</span>
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  </Link>
                </div>
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
    </div>
  );
}

export default ProjectDetailPage;
