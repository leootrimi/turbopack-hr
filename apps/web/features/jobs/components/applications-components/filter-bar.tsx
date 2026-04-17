import { Search } from "lucide-react";
import { Stage, stages } from "../../types";

// Filters Bar
export const FiltersBar = ({
    search,
    setSearch,
    department,
    setDepartment,
    statusFilter,
    setStatusFilter,
    departments,
  }: {
    search: string;
    setSearch: (v: string) => void;
    department: string;
    setDepartment: (v: string) => void;
    statusFilter: Stage | 'all';
    setStatusFilter: (v: Stage | 'all') => void;
    departments: string[];
  }) => {
    return (
      <div className="flex flex-wrap items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or position..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
          />
        </div>
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="all">All Departments</option>
          {departments.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as Stage | 'all')}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        >
          <option value="all">All Stages</option>
          {stages.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    );
  };
  