'use client';

import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight, Mail } from 'lucide-react';
import { useOrgChart } from './hooks/use-org-chart';
import { OrgChartEmployee as Employee } from '@repo/types';


// Combined node for the tree
interface OrgNode {
  id: number;
  name: string;
  title: string;
  department: string;
  children: OrgNode[];
}

// Build tree from flat data
const buildOrgTree = (employees: Employee[]): OrgNode[] => {
  const employeeMap = new Map<number, OrgNode>();
  const roots: OrgNode[] = [];

  employees.forEach(emp => {
    employeeMap.set(emp.id, {
      id: emp.id,
      name: `${emp.firstName} ${emp.lastName}`,
      title: emp.jobTitle,
      department: emp.department,
      children: [],
    });
  });

  employees.forEach(emp => {
    const node = employeeMap.get(emp.id);
    if (!node) return;

    if (emp.managerId === null) {
      roots.push(node);
    } else {
      const parent = employeeMap.get(emp.managerId);
      if (parent) {
        parent.children.push(node);
      } else {
        roots.push(node);
      }
    }
  });

  return roots;
};

// ---------- Node Component ----------
const OrgNodeCard = ({ node, level, isLastChild }: { node: OrgNode; level: number; isLastChild?: boolean }) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;

  return (
    <div className="relative">
      {/* Vertical line connecting to parent (except root) */}
      {level > 0 && (
        <div
          className="absolute left-1/2 -translate-x-1/2 -top-4 w-px h-4 bg-slate-300"
          style={{ left: 'calc(50% - 1px)' }}
        />
      )}
      {/* Card */}
      <div className="relative group mt-2">
        <div className={`
          bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200
          ${expanded && hasChildren ? 'ring-1 ring-indigo-100' : ''}
        `}>
          <div className="p-3 flex items-center gap-3">
            {/* Expand/collapse button */}
            {hasChildren && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            )}
            {/* Avatar / Initials */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
              {node.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-slate-800 text-sm truncate">{node.name}</p>
                <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full">
                  {node.department}
                </span>
              </div>
              <p className="text-xs text-slate-500 truncate">{node.title}</p>
            </div>
          </div>
        </div>
        {/* Children */}
        {hasChildren && expanded && (
          <div className="relative mt-4 ml-6 pl-6 border-l border-slate-200">
            {node.children.map((child, idx) => (
              <div key={child.id} className="relative">
                {/* Horizontal connector line */}
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-px bg-slate-300" style={{ left: '-14px' }} />
                <OrgNodeCard node={child} level={level + 1} isLastChild={idx === node.children.length - 1} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ---------- Main OrgChart Component ----------
export function OrgChart() {
  const { data: employees, isLoading, error } = useOrgChart();

  const orgData = useMemo(() => {
    if (!employees) return [];
    return buildOrgTree(employees);
  }, [employees]);

  if (isLoading) {
    return <div className="text-center p-8 text-slate-500">Loading organization...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">Error loading organization chart</div>;
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
          <div className="min-w-[500px]">
            {orgData.map((root) => (
              <OrgNodeCard key={root.id} node={root} level={0} />
            ))}
          </div>
        <div className="mt-4 text-center text-xs text-slate-400">
          {orgData.length} {orgData.length === 1 ? 'root department' : 'root departments'} • Expand/collapse nodes
        </div>
      </div>
    </div>
  );
}