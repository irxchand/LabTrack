import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLabData } from '../../context/LabDataContext';
import { ArrowLeft, Users, Cpu, ShieldCheck, Check, Sparkles } from 'lucide-react';

export function ProjectDetailPage() {
  const { projectId } = useParams();
  const { projects, activeLoans, inventory } = useLabData();

  const project = projects.find((p) => p.id === projectId);
  const assignedLoans = activeLoans.filter((l) => l.projectId === projectId);

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
        <h2 className="font-display text-xl font-semibold text-white">Project Not Found</h2>
        <p className="text-sm font-sans text-zinc-400">
          Identifier "{projectId}" is not registered in the institutional repository.
        </p>
        <Link
          to="/workspace/projects"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white hover:bg-[#f5e6c8] text-black font-semibold text-xs transition-all shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Academic Projects
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
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-[#f5e6c8]">#{project.id}</span>
              <span className="text-zinc-600">•</span>
              <span className="px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-[11px] font-mono text-zinc-300">
                {project.courseCode}
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
              <div className="text-zinc-500 text-[10px] font-sans uppercase tracking-wider">Custody Quota</div>
              <div className="font-mono text-sm font-bold text-white">
                {project.currentAllocatedCount} / {project.hardwareBudgetCap} units
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
            <div className="text-[10px] font-sans uppercase tracking-wider text-zinc-500 font-semibold">
              Project Abstract & Scope
            </div>
            <p className="text-zinc-300 leading-relaxed font-sans text-sm">{project.abstract}</p>
          </div>

          {/* Assigned Hardware */}
          <div className="p-6 bg-gradient-to-b from-[#141417]/95 to-[#0c0c0e]/95 border border-white/10 rounded-3xl space-y-4 backdrop-blur-xl shadow-lg">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-zinc-300 uppercase text-[11px] font-semibold tracking-wider font-sans flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#c9b8a0]" />
                Active Hardware Borrowings ({assignedLoans.length})
              </span>
              <span className="text-zinc-400 font-mono text-xs">
                Remaining Quota: {project.hardwareBudgetCap - assignedLoans.length}
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
                        <div className="text-[#c9b8a0] font-mono text-xs mt-0.5">{loan.assetTag}</div>
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
            <div className="text-zinc-500 text-[10px] uppercase font-semibold tracking-wider font-sans">Faculty Mentor</div>
            <div className="flex items-center gap-3 pt-1">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-white/20 to-white/5 border border-white/10 text-white font-semibold text-sm flex items-center justify-center shadow-sm">
                {(project.mentorName || 'F').charAt(0)}
              </div>
              <div>
                <div className="text-white font-semibold text-base font-sans">{project.mentorName}</div>
                <div className="text-zinc-400 text-xs font-sans">{project.department}</div>
              </div>
            </div>
            <div className="text-zinc-500 text-[11px] font-mono pt-1">Academic Term: {project.academicTerm}</div>
          </div>

          {/* Members List */}
          <div className="p-6 bg-gradient-to-b from-[#141417]/95 to-[#0c0c0e]/95 border border-white/10 rounded-3xl space-y-4 backdrop-blur-xl shadow-lg">
            <div className="text-zinc-300 uppercase text-[11px] font-semibold tracking-wider font-sans flex items-center gap-2 border-b border-white/10 pb-3">
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

                  <span className="text-zinc-400 text-[11px] font-mono px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/10 flex-shrink-0">
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
