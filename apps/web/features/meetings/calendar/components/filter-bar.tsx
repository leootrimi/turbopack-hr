// components/participants-calendar/FilterBar.tsx
import React, { useState } from 'react';
import { Filter } from 'lucide-react';

interface FilterBarProps {
  onStatusFilterChange?: (status: string) => void;
  onTeamFilterChange?: (team: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onStatusFilterChange,
  onTeamFilterChange,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [teamFilter, setTeamFilter] = useState<string>('all');

  const handleStatusChange = (status: string) => {
    setStatusFilter(status);
    onStatusFilterChange?.(status);
  };

  const handleTeamChange = (team: string) => {
    setTeamFilter(team);
    onTeamFilterChange?.(team);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 p-4 bg-white rounded-xl border border-slate-200/80 shadow-sm">
      <div className="flex items-center gap-2">
        <Filter size={14} className="text-slate-400" />
        <span className="text-xs font-medium text-slate-600">Filters:</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {['All', 'Upcoming', 'Completed', 'Canceled'].map((status) => (
          <button
            key={status}
            onClick={() => handleStatusChange(status.toLowerCase())}
            className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
              statusFilter === status.toLowerCase()
                ? 'bg-indigo-100 text-indigo-700 font-medium'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>
      <div className="w-px h-5 bg-slate-200" />
      <div className="flex gap-2">
        {['All Teams', 'Product', 'Engineering', 'HR'].map((team) => (
          <button
            key={team}
            onClick={() => handleTeamChange(team.toLowerCase())}
            className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
              teamFilter === team.toLowerCase()
                ? 'bg-slate-200 text-slate-800 font-medium'
                : 'text-slate-500 hover:bg-slate-100'
            }`}
          >
            {team}
          </button>
        ))}
      </div>
    </div>
  );
};