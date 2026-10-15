import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLabData } from '../../context/LabDataContext';
import { ArrowLeft, FolderGit2, Users, Cpu, ShieldCheck, UserCheck } from 'lucide-react';

export function ProjectDetailPage() {
  const { projectId } = useParams();
  const { projects, activeLoans } = useLabData();

  const project = projects.find((p) => p.id === projectId);
  const assignedLoans = activeLoans.filter((l) => l.projectId === projectId);

  if (!project) {
    return (
      <div className="p-8 text-center space-y-4">
        <h2 className="text-lg font-bold text-zinc-200">Project Not Found</h2>
        <p className="text-xs font-mono text-zinc-500">
          Identifier "{projectId}" is not registered in collegiate database.
        </p>
        <Link
          to="/workspace/projects/overview"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-zinc-800 text-xs font-mono text-zinc-200 rounded"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Projects Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="pb-4 border-b border-zinc-800/80 space-y-2">
        <Link
          to="/workspace/projects/overview"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Academic Projects Directory
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-400">{project.id}</span>
              <span className="text-xs font-mono text-zinc-500">•</span>
              <span className="text-xs font-mono text-zinc-400">{project.courseCode}</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-zinc-100 mt-1">
              {project.title}
            </h1>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs">
            <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded text-right">
              <div className="text-zinc-500 text-[10px] uppercase">Compliance Score</div>
              <div className="text-emerald-400 font-bold text-sm">{project.reliabilityScore}/100</div>
            </div>
            <div className="p-2.5 bg-zinc-900 border border-zinc-800 rounded text-right">
              <div className="text-zinc-500 text-[10px] uppercase">Custody Cap</div>
              <div className="text-blue-400 font-bold text-sm">
                {project.currentAllocatedCount} / {project.hardwareBudgetCap} Items
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left 2 Cols: Abstract and Active Hardware */}
        <div className="md:col-span-2 space-y-6">
          {/* Abstract */}
          <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-lg space-y-2 font-mono text-xs">
            <div className="text-zinc-400 uppercase text-[11px] font-semibold">
              Project Abstract & Scope
            </div>
            <p className="text-zinc-300 leading-relaxed font-sans text-sm">{project.abstract}</p>
          </div>

          {/* Assigned Hardware */}
          <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-lg space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2">
              <span className="text-zinc-400 uppercase text-[11px] font-semibold flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                Active Hardware Borrowings ({assignedLoans.length})
              </span>
              <span className="text-zinc-500 text-[11px]">
                Remaining Quota: {project.hardwareBudgetCap - assignedLoans.length}
              </span>
            </div>

            {assignedLoans.length > 0 ? (
              <div className="divide-y divide-zinc-800/80">
                {assignedLoans.map((loan) => (
                  <div key={loan.id} className="py-2.5 flex items-center justify-between">
                    <div>
                      <div className="text-blue-400 font-bold">{loan.assetTag}</div>
                      <div className="text-zinc-200 font-sans text-xs">{loan.nomenclature}</div>
                    </div>
                    <div className="text-right text-[11px] text-zinc-400">
                      <div>Due: {loan.dueDate?.split(' ')[0]}</div>
                      <div className="text-amber-400">{loan.daysRemaining} days left</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-zinc-500 py-3 text-center">
                No active hardware loans currently checked out to this project team.
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Team Members & Mentor */}
        <div className="space-y-6 font-mono text-xs">
          {/* Faculty Guide */}
          <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-lg space-y-2">
            <div className="text-zinc-500 text-[10px] uppercase font-semibold">Faculty Mentor</div>
            <div className="text-zinc-100 font-bold text-sm">{project.mentorName}</div>
            <div className="text-zinc-400 text-[11px]">{project.department}</div>
            <div className="text-zinc-500 text-[11px]">Term: {project.academicTerm}</div>
          </div>

          {/* Members List */}
          <div className="p-5 bg-zinc-900/60 border border-zinc-800 rounded-lg space-y-3">
            <div className="text-zinc-400 uppercase text-[11px] font-semibold flex items-center gap-1.5 border-b border-zinc-800 pb-2">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              Registered Team Members ({project.members.length})
            </div>

            <div className="divide-y divide-zinc-800/80">
              {project.members.map((member) => (
                <div key={member.prn} className="py-2 space-y-0.5">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-zinc-200">{member.name}</span>
                    <span className="text-blue-400 text-[11px]">{member.prn}</span>
                  </div>
                  <div className="text-zinc-500 text-[11px]">{member.role}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
