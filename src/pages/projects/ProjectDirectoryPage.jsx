import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLabData } from '../../context/LabDataContext';
import { DataTable } from '../../components/common/DataTable';
import { FolderGit2, Users, Cpu } from 'lucide-react';

export function ProjectDirectoryPage() {
  const navigate = useNavigate();
  const { projects } = useLabData();

  const columns = [
    {
      header: 'Project ID & Course',
      accessor: 'id',
      width: '180px',
      render: (row) => (
        <div className="font-mono text-xs">
          <div className="font-semibold text-white group-hover:text-[#f5e6c8] transition-colors">{row.id}</div>
          <div className="text-zinc-500 text-[11px]">{row.courseCode}</div>
        </div>
      ),
    },
    {
      header: 'Project Title & Abstract',
      accessor: 'title',
      render: (row) => (
        <div className="space-y-0.5">
          <div className="font-medium text-white">{row.title}</div>
          <p className="text-xs text-zinc-400 font-sans line-clamp-1">{row.abstract}</p>
        </div>
      ),
    },
    {
      header: 'Assigned Mentor',
      accessor: 'mentorName',
      width: '180px',
      render: (row) => (
        <div className="text-xs">
          <div className="text-zinc-200 font-medium font-sans">{row.mentorName}</div>
          <div className="text-zinc-500 text-[11px] font-mono">{row.department}</div>
        </div>
      ),
    },
    {
      header: 'Team Size',
      accessor: 'members',
      width: '120px',
      align: 'center',
      render: (row) => (
        <span className="font-sans text-xs text-zinc-300">
          {row.members?.length || 0} Members
        </span>
      ),
    },
    {
      header: 'Hardware Allocation Cap',
      accessor: 'currentAllocatedCount',
      width: '190px',
      render: (row) => {
        const percentage = Math.round((row.currentAllocatedCount / row.hardwareBudgetCap) * 100);
        return (
          <div className="space-y-1.5 font-sans text-xs">
            <div className="flex justify-between text-zinc-400 text-[11px]">
              <span>{row.currentAllocatedCount} of {row.hardwareBudgetCap} units</span>
              <span className="font-mono text-zinc-300">{percentage}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-white h-full rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, percentage)}%` }}
              />
            </div>
          </div>
        );
      },
    },
    {
      header: 'Reliability',
      accessor: 'reliabilityScore',
      width: '120px',
      align: 'center',
      render: (row) => (
        <span
          className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-mono font-medium border ${
            row.reliabilityScore >= 90
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : row.reliabilityScore >= 75
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
          }`}
        >
          {row.reliabilityScore}/100
        </span>
      ),
    },
    {
      header: 'Action',
      width: '110px',
      align: 'right',
      render: (row) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/workspace/projects/${row.id}`);
          }}
          className="px-3 py-1 rounded-full text-xs font-medium bg-white/[0.04] hover:bg-white text-zinc-300 hover:text-black border border-white/10 transition-all cursor-pointer shadow-sm"
        >
          Inspect
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="text-[11px] font-sans font-medium text-zinc-400 tracking-wide uppercase">
            COLLABORATIVE ALLOCATIONS
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-white mt-1">
            Academic Projects
          </h1>
          <p className="text-sm font-sans text-zinc-400 mt-1 max-w-xl">
            Registered collegiate research teams, faculty mentor bindings, and authorized hardware pool quotas.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3.5 py-1.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-sans text-zinc-300 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c9b8a0]" />
            <span>Active Teams:</span>
            <span className="font-mono font-semibold text-white">{projects.length}</span>
          </div>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={projects}
        onRowClick={(row) => navigate(`/workspace/projects/${row.id}`)}
        pageSize={10}
        emptyMessage="No academic projects registered in current semester term."
      />
    </div>
  );
}

export default ProjectDirectoryPage;
