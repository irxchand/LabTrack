import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLabData } from '../../context/LabDataContext';
import { useAuth } from '../../context/AuthContext';
import {
  FolderGit2,
  Users,
  Cpu,
  ArrowRight,
  ShieldCheck,
  Check,
  Sparkles,
  Layers,
} from 'lucide-react';

export function ProjectDirectoryPage() {
  const navigate = useNavigate();
  const { projects, inventory } = useLabData();
  const { currentUser } = useAuth();
  const [activeFilter, setActiveFilter] = useState('all');

  // Resolve authentic hardware photography
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

  const isUserProject = (project) => {
    const userPrn = currentUser?.prn || '202401048';
    return project.members?.some((m) => m.prn === userPrn) || project.teamLeaderPrn === userPrn;
  };

  const counts = useMemo(() => ({
    all: projects.length,
    myTeam: projects.filter((p) => isUserProject(p)).length,
    aiml: projects.filter((p) => p.department?.includes('AIML') || p.courseCode?.includes('AIML')).length,
  }), [projects, currentUser]);

  const filteredProjects = useMemo(() => {
    if (activeFilter === 'myTeam') {
      return projects.filter((p) => isUserProject(p));
    }
    if (activeFilter === 'aiml') {
      return projects.filter((p) => p.department?.includes('AIML') || p.courseCode?.includes('AIML'));
    }
    return projects;
  }, [projects, activeFilter, currentUser]);

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="text-[11px] font-sans font-medium text-zinc-400 tracking-wide uppercase">
            COLLABORATIVE HARDWARE POOLS
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white mt-1">
            Academic Projects
          </h1>
          <p className="text-sm font-sans text-zinc-400 mt-1 max-w-xl">
            Collegiate research teams, faculty mentor bindings, and authorized hardware quota allocations.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-sans text-zinc-300 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9b8a0]" />
            <span>Registered Teams:</span>
            <span className="font-mono font-semibold text-white">{projects.length}</span>
          </div>
        </div>
      </div>

      {/* Segmented Filter Pills */}
      <div className="flex items-center gap-1.5 p-1 rounded-full bg-white/[0.04] border border-white/10 w-fit backdrop-blur-md">
        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'all'
              ? 'bg-white text-black font-semibold shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <span>All Projects</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeFilter === 'all' ? 'bg-black/10 text-black font-bold' : 'bg-white/10 text-zinc-300'}`}>
            {counts.all}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('myTeam')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'myTeam'
              ? 'bg-white text-black font-semibold shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <span>My Capstone Team</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeFilter === 'myTeam' ? 'bg-black/10 text-black font-bold' : 'bg-white/10 text-zinc-300'}`}>
            {counts.myTeam}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('aiml')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
            activeFilter === 'aiml'
              ? 'bg-white text-black font-semibold shadow-sm'
              : 'text-zinc-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          <span>AIML Department</span>
          <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeFilter === 'aiml' ? 'bg-black/10 text-black font-bold' : 'bg-white/10 text-zinc-300'}`}>
            {counts.aiml}
          </span>
        </button>
      </div>

      {/* Projects Grid (Apple Cupertino Showcase) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProjects.map((project) => {
          const isMine = isUserProject(project);
          const quotaPercentage = Math.round((project.currentAllocatedCount / project.hardwareBudgetCap) * 100);

          return (
            <div
              key={project.id}
              onClick={() => navigate(`/workspace/projects/${project.id}`)}
              className="relative rounded-3xl p-6 sm:p-7 bg-gradient-to-b from-[#141417]/95 via-[#0e0e11]/90 to-[#0a0a0c]/95 border border-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-xl flex flex-col justify-between group cursor-pointer shadow-[0_10px_35px_rgba(0,0,0,0.6)] hover:shadow-[0_15px_45px_rgba(0,0,0,0.8)] space-y-6 overflow-hidden"
            >
              {/* Specular Edge Highlight */}
              <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />

              {/* Top Strip */}
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold tracking-tight text-[#f5e6c8] group-hover:text-white transition-colors">
                    #{project.id}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-zinc-600" />
                  <span className="px-2.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-[11px] font-mono text-zinc-300">
                    {project.courseCode}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {isMine && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#c9b8a0]/20 text-[#f5e6c8] border border-[#c9b8a0]/40 flex items-center gap-1.5 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#f5e6c8]" />
                      <span>My Team</span>
                    </span>
                  )}
                  <span className="px-3 py-1 rounded-full text-[11px] font-sans font-medium bg-white/[0.04] text-zinc-300 border border-white/10 flex items-center gap-1.5 shadow-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c9b8a0]" />
                    <span>{project.reliabilityScore}% Integrity</span>
                  </span>
                </div>
              </div>

              {/* Title & Technical Abstract */}
              <div className="space-y-2">
                <h3 className="font-display text-lg sm:text-xl font-semibold text-white tracking-tight group-hover:text-[#f5e6c8] transition-colors leading-snug">
                  {project.title}
                </h3>
                <p className="text-xs text-zinc-300 font-sans leading-relaxed line-clamp-2">
                  {project.abstract}
                </p>
              </div>

              {/* Physical Hardware Showcase Pedestals */}
              <div className="pt-2 border-t border-white/5 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-sans">
                  <span className="text-[10px] font-sans uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-[#c9b8a0]" />
                    <span>Allocated Hardware Staging</span>
                  </span>
                  <span className="text-zinc-400 font-mono text-[11px]">
                    {project.currentAllocatedCount} of {project.hardwareBudgetCap} Units Used
                  </span>
                </div>

                {project.allocatedItems && project.allocatedItems.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {project.allocatedItems.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-black/60 border border-white/10 flex items-center gap-3 group-hover:border-white/20 transition-all shadow-inner"
                      >
                        <div className="w-12 h-12 rounded-xl bg-white/[0.03] border border-white/5 p-1.5 flex items-center justify-center flex-shrink-0">
                          <img
                            src={getItemImage(item)}
                            alt={item.nomenclature}
                            className="max-h-full max-w-full object-contain filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.8)]"
                            onError={(e) => {
                              e.target.src = '/images/hardware/raspberry-pi-5.jpg';
                            }}
                          />
                        </div>
                        <div className="min-w-0">
                          <div className="text-white text-xs font-semibold truncate font-sans">
                            {item.nomenclature}
                          </div>
                          <div className="text-[10px] font-mono text-[#c9b8a0] truncate mt-0.5">
                            {item.assetTag}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/5 text-xs text-zinc-400 font-sans flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>All {project.hardwareBudgetCap} hardware allocation slots currently available.</span>
                  </div>
                )}

                {/* Quota Progress Bar */}
                <div className="space-y-1 pt-1">
                  <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-white h-full rounded-full transition-all duration-500"
                      style={{ width: `${Math.min(100, quotaPercentage)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Footer with Team Roster & Inspect CTA */}
              <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs font-sans">
                {/* Team Avatar Stack */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center -space-x-2 flex-shrink-0">
                    {project.members?.map((member) => (
                      <div
                        key={member.prn}
                        className="w-7 h-7 rounded-full bg-gradient-to-tr from-white/20 to-white/5 border-2 border-[#121316] text-white font-semibold text-[11px] flex items-center justify-center shadow-sm"
                        title={`${member.name} (${member.role})`}
                      >
                        {member.name.charAt(0)}
                      </div>
                    ))}
                  </div>

                  <div className="min-w-0">
                    <div className="text-white font-medium truncate max-w-[150px] sm:max-w-[200px]">
                      {project.members?.[0]?.name}
                    </div>
                    <div className="text-zinc-500 text-[11px] font-sans truncate">
                      Guide: {project.mentorName}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/workspace/projects/${project.id}`);
                  }}
                  className="px-4 py-2 rounded-full text-xs font-semibold bg-white hover:bg-[#f5e6c8] text-black transition-all flex items-center gap-1.5 shadow-sm cursor-pointer active:scale-95 flex-shrink-0"
                >
                  <span>Inspect Team</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ProjectDirectoryPage;
