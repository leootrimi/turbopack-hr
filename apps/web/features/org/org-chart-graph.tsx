'use client';

import { useState, useMemo } from 'react';
import Tree from 'react-d3-tree';
import { ChevronDown, ChevronRight, List, LayoutGrid } from 'lucide-react';
import { OrgChart } from './org-chart';
import { useOrgChart } from './hooks/use-org-chart';
import { OrgChartEmployee as Employee } from '@repo/types';


// ---------- Types ----------
interface OrgNode {
    name: string;
    attributes?: {
        title: string;
        department: string;
        id: number;
        avatar?: string;
    };
    children?: OrgNode[];
}


// Build tree structure for D3 (single root)
const buildD3Tree = (employees: Employee[]): OrgNode => {
    const employeeMap = new Map<number, OrgNode>();
    let root: OrgNode | null = null;

    employees.forEach(emp => {
        employeeMap.set(emp.id, {
            name: `${emp.firstName} ${emp.lastName}`,
            attributes: {
                title: emp.jobTitle,
                department: emp.department,
                id: emp.id,
                avatar: emp.avatar,
            },
            children: [],
        });
    });

    employees.forEach(emp => {
        const node = employeeMap.get(emp.id);
        if (emp.managerId === null) {
            root = node ?? null;
        } else {
            const parent = employeeMap.get(emp.managerId);
            if (parent && node) {
                parent.children = parent.children || [];
                parent.children.push(node);
            }
        }
    });

    if (!root) throw new Error('No root node found');
    return root;
};

// ---------- Custom Node Renderer (with rounded image) ----------
const renderCustomNode = ({ nodeDatum }: { nodeDatum: any }) => {
    const { name, attributes } = nodeDatum;
    const { title, department, avatar } = attributes;

    return (
        <foreignObject width="220" height="80" x="-110" y="-40" className="overflow-visible">
            <div className="flex items-center gap-5 w-[320px] bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-3">
                {/* Rounded image */}
                <img
                    src={avatar || `https://ui-avatars.com/api/?background=6366f1&color=fff&name=${encodeURIComponent(name)}`}
                    alt={name}
                    className="w-13 h-13 rounded-full object-cover shrink-0"
                />
                <div className="flex-1 min-w-0 justify-between gap-3">
                    <div className="font-semibold text-slate-800 text-xl truncate">{name}</div>
                    <div className="text-md text-slate-500 truncate">{title}</div>
                    <div className="text-sm text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded-full inline-block mt-1 max-w-full truncate">
                        {department}
                    </div>
                </div>
            </div>
        </foreignObject>
    );
};

// ---------- List View (Collapsible Tree) with rounded image ----------
const OrgNodeList = ({ node, level = 0 }: { node: OrgNode; level?: number }) => {
    const [expanded, setExpanded] = useState(true);
    const hasChildren = node.children && node.children.length > 0;
    const avatar = node.attributes?.avatar;
    const name = node.name;

    return (
        <div className="ml-6">
            <div className="flex items-center gap-2 py-1">
                {hasChildren && (
                    <button onClick={() => setExpanded(!expanded)} className="text-slate-400 hover:text-slate-600">
                        {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>
                )}
                {/* Rounded image */}
                <img
                    src={avatar || `https://ui-avatars.com/api/?background=6366f1&color=fff&name=${encodeURIComponent(name)}`}
                    alt={name}
                    className="w-8 h-8 rounded-full object-cover"
                />
                <div>
                    <div className="font-medium text-slate-800 text-sm">{name}</div>
                    <div className="text-xs text-slate-500">{node.attributes?.title} • {node.attributes?.department}</div>
                </div>
            </div>
            {hasChildren && expanded && (
                <div className="border-l-2 border-slate-200 ml-3 pl-2">
                    {node.children!.map((child, idx) => (
                        <OrgNodeList key={idx} node={child} level={level + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

// ---------- Main Component with Toggle ----------
export function OrgChartWithD3Tree() {
    const [viewMode, setViewMode] = useState<'list' | 'graph'>('graph');
    const { data: employees, isLoading, error } = useOrgChart();

    const treeData = useMemo(() => {
        if (!employees || employees.length === 0) return null;
        try {
            return buildD3Tree(employees);
        } catch (e) {
            console.error('Error building tree:', e);
            return null;
        }
    }, [employees]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-center text-red-600 bg-red-50 rounded-xl">
                Error loading organization chart. Please try again later.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">Organization Chart</h1>
                        <p className="text-sm text-slate-500">Visualize reporting structure</p>
                    </div>
                    <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 p-1 shadow-sm">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-colors ${viewMode === 'list'
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-slate-500 hover:bg-slate-50'
                                }`}
                        >
                            <List size={14} />
                            List
                        </button>
                        <button
                            onClick={() => setViewMode('graph')}
                            className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-colors ${viewMode === 'graph'
                                ? 'bg-indigo-50 text-indigo-700'
                                : 'text-slate-500 hover:bg-slate-50'
                                }`}
                        >
                            <LayoutGrid size={14} />
                            Graph
                        </button>
                    </div>
                </div>

                <div className="relative bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                    <div className="absolute inset-0 bg-slate-50 overflow-hidden z-0">
                        <div className="absolute top-20 left-20 w-96 h-96 rounded-full bg-gradient-to-r from-indigo-200 to-purple-200 blur-3xl opacity-40" />
                        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-gradient-to-r from-blue-200 to-cyan-200 blur-3xl opacity-40" />
                    </div>

                    <div className="relative z-10">
                        {viewMode === 'list' ? (
                            <div className="p-4 max-h-[70vh] overflow-y-auto">
                                <OrgChart />
                            </div>
                        ) : (
                            <div className="w-full h-[70vh]">
                                {treeData ? (
                                    <Tree
                                        data={treeData}
                                        orientation="vertical"
                                        pathFunc="elbow"
                                        renderCustomNodeElement={renderCustomNode}
                                        nodeSize={{ x: 500, y: 160 }}
                                        separation={{ siblings: 1.5, nonSiblings: 1.7 }}
                                        translate={{ x: 600, y: 80 }}
                                        zoom={0.8}
                                        zoomable
                                        collapsible={false}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-500">
                                        No organization data available
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}