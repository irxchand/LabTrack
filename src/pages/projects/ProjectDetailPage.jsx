import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLabData } from '../../context/LabDataContext';
import { ArrowLeft, Users, Cpu, ShieldCheck } from 'lucide-react';

export function ProjectDetailPage() {
  const { projectId } = useParams();
  const { projects, activeLoans } = useLabData();

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

  if (!project) {
    return (
      <div className="p-12 text-center space-y-4 max-w-md mx-auto">
        <h2 className="font-display text-xl font-semibold text-white">Project Not Found</h2>
        <p className="text-sm font-sans text-zinc-400">
          Identifier "{projectId}" is not registered in the institutional repository.
        </p>
        <Link
          to="/workspace/projects"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-sans text-white transition-all"
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-xs font-sans text-zinc-300 hover:text-white transition-all mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Academic Projects</span>
          </Link>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-[#c9b8a0]">{project.id}</span>
              <span className="text-zinc-600">•</span>
              <span className="text-xs font-mono text-zinc-400">{project.courseCode}</span>
            </div>
            <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white mt-1">
              {project.title}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/10 text-right">
              <div className="text-zinc-500 text-[10px] font-sans uppercase tracking-wider">Compliance</div>
              <div className="font-mono text-sm font-bold text-emerald-400">{project.reliabilityScore}/100</div>
            </div>
            <div className="px-4 py-2 rounded-2xl bg-white/[0.03] border border-white/10 text-right">
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
          <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-2 backdrop-blur-md">
            <div className="text-zinc-400 uppercase text-[11px] font-semibold tracking-wider font-sans">
              Project Abstract & Scope
            </div>
            <p className="text-zinc-300 leading-relaxed font-sans text-sm">{project.abstract}</p>
          </div>

          {/* Assigned Hardware */}
          <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4 backdrop-blur-md">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-zinc-300 uppercase text-[11px] font-semibold tracking-wider font-sans flex items-center gap-2">
                <Cpu className="w-4 h-4 text-[#c9b8a0]" />
                Active Hardware Borrowings ({assignedLoans.length})
              </span>
              <span className="text-zinc-500 text-xs font-sans">
                Remaining Quota: {project.hardwareBudgetCap - assignedLoans.length}
              </span>
            </div>

            {assignedLoans.length > 0 ? (
              <div className="divide-y divide-white/5">
                {assignedLoans.map((loan) => (
                  <div key={loan.id} className="py-3 flex items-center justify-between">
                    <div>
                      <div className="text-white font-semibold font-sans text-sm">{loan.nomenclature}</div>
                      <div className="text-zinc-500 font-mono text-xs mt-0.5">{loan.assetTag}</div>
                    </div>
                    <div className="text-right text-xs font-sans">
                      <div className="text-zinc-400">Due {formatHumanDate(loan.dueDate)}</div>
                      <div className="text-amber-400 font-medium text-[11px] mt-0.5">{loan.daysRemaining} days remaining</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-zinc-500 py-6 text-center text-xs font-sans">
                No active hardware loans currently checked out to this project team.
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Team Members & Mentor */}
        <div className="space-y-6">
          {/* Faculty Guide */}
          <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-2 backdrop-blur-md">
            <div className="text-zinc-500 text-[10px] uppercase font-semibold tracking-wider font-sans">Faculty Mentor</div>
            <div className="text-white font-semibold text-base font-sans">{project.mentorName}</div>
            <div className="text-zinc-400 text-xs font-sans">{project.department}</div>
            <div className="text-zinc-500 text-[11px] font-mono mt-1">Term: {project.academicTerm}</div>
          </div>

          {/* Members List */}
          <div className="p-6 bg-white/[0.02] border border-white/10 rounded-2xl space-y-4 backdrop-blur-md">
            <div className="text-zinc-300 uppercase text-[11px] font-semibold tracking-wider font-sans flex items-center gap-2 border-b border-white/10 pb-3">
              <Users className="w-4 h-4 text-[#c9b8a0]" />
              Team Members ({project.members.length})
            </div>

            <div className="divide-y divide-white/5">
              {project.members.map((member) => (
                <div key={member.prn} className="py-2.5 space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-white text-xs font-sans">{member.name}</span>
                    <span className="text-zinc-400 text-[11px] font-mono">{member.prn}</span>
                  </div>
                  <div className="text-zinc-500 text-[11px] font-sans">{member.role}</div>
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
