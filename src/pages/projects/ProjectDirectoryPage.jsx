import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLabData } from '../../context/LabDataContext';
import { DataTable } from '../../components/common/DataTable';
import { FolderGit2, Users, Eye, Cpu } from 'lucide-react';

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
          <div className="font-semibold text-blue-400 hover:underline">{row.id}</div>
          <div className="text-zinc-500 text-[11px]">{row.courseCode}</div>
        </div>
      ),
    },
    {
      header: 'Project Title & Abstract',
      accessor: 'title',
      render: (row) => (
        <div className="space-y-0.5">
          <div className="font-medium text-zinc-100">{row.title}</div>
          <p className="text-xs text-zinc-400 font-mono line-clamp-1">{row.abstract}</p>
        </div>
      ),
    },
    {
      header: 'Assigned Mentor',
      accessor: 'mentorName',
      width: '180px',
      render: (row) => (
        <div className="font-mono text-xs">
          <div className="text-zinc-200">{row.mentorName}</div>
          <div className="text-zinc-500 text-[11px]">{row.department}</div>
        </div>
      ),
    },
    {
      header: 'Team Size',
      accessor: 'members',
      width: '120px',
      align: 'center',
      render: (row) => (
        <span className="font-mono text-xs text-zinc-300">
          {row.members?.length || 0} Members
        </span>
      ),
    },
    {
      header: 'Hardware Allocation Cap',
      accessor: 'currentAllocatedCount',
      width: '180px',
      render: (row) => (
        <div className="space-y-1 font-mono text-xs">
          <div className="flex justify-between text-zinc-400">
            <span>{row.currentAllocatedCount} / {row.hardwareBudgetCap} Items</span>
            <span className="text-blue-400">
              {Math.round((row.currentAllocatedCount / row.hardwareBudgetCap) * 100)}%
            </span>
          </div>
          <div className="w-full bg-zinc-800 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-blue-500 h-full rounded-full"
              style={{
                width: `${Math.min(100, (row.currentAllocatedCount / row.hardwareBudgetCap) * 100)}%`,
              }}
            />
          </div>
        </div>
      ),
    },
    {
      header: 'Reliability',
      accessor: 'reliabilityScore',
      width: '110px',
      align: 'center',
      render: (row) => (
        <span
          className={`font-mono text-xs font-bold ${
            row.reliabilityScore >= 90
              ? 'text-emerald-400'
              : row.reliabilityScore >= 75
              ? 'text-amber-400'
              : 'text-red-400'
          }`}
        >
          {row.reliabilityScore}/100
        </span>
      ),
    },
    {
      header: 'Action',
      width: '120px',
      align: 'right',
      render: (row) => (
        <button
          onClick={() => navigate(`/workspace/projects/${row.id}`)}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono text-xs transition-colors"
        >
          <Eye className="w-3.5 h-3.5" />
          View Profile
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-zinc-800/80">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100 flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-blue-500" />
            Academic Project Directory & Hardware Caps
          </h1>
          <p className="text-xs font-mono text-zinc-400 mt-0.5">
            Registered collegiate project groups, mentor bindings, and custody limit allocations.
          </p>
        </div>

        <div className="text-xs font-mono text-zinc-400 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded">
          Active Student Teams: <span className="text-zinc-100 font-bold">{projects.length}</span>
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
