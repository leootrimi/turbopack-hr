// app/jobs/applications/page.tsx
'use client';

import { useState } from 'react';
import {
  Search,
  Filter,
  ChevronDown,
  Eye,
  UserPlus,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  MoreVertical,
  LayoutGrid,
  List,
  TrendingUp,
  Users,
  Briefcase,
  UserCheck,
  UserX,
} from 'lucide-react';
import { Application, Stage, stageColors, stages } from './types';
import { FiltersBar } from './components/applications-components/filter-bar';
import { PipelineColumn } from './components/applications-components/pipeline-column';
import { ApplicationTableRow } from './components/applications-components/application-table-row';
import { KPICard } from './components/applications-components/kpi-cards';
import { DetailPanel } from './components/applications-components/detail-panel';


// ---------- Mock Data ----------
const mockApplications: Application[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    position: 'Frontend Developer',
    department: 'Engineering',
    stage: 'Applied',
    appliedDate: '2025-03-20',
    email: 'alice@example.com',
    phone: '+1 234 567 8901',
    location: 'New York, NY',
    cvUrl: '#',
    notes: 'Strong portfolio, good React experience.',
    timeline: [
      { action: 'Application submitted', date: '2025-03-20' },
      { action: 'Email sent to candidate', date: '2025-03-21' },
    ],
  },
  {
    id: '2',
    name: 'Bob Smith',
    position: 'Backend Engineer',
    department: 'Engineering',
    stage: 'Screening',
    appliedDate: '2025-03-18',
    email: 'bob@example.com',
    phone: '+1 234 567 8902',
    location: 'Remote',
    cvUrl: '#',
    notes: 'Strong Go and Python skills.',
    timeline: [{ action: 'Application submitted', date: '2025-03-18' }],
  },
  {
    id: '3',
    name: 'Carol Davis',
    position: 'Product Manager',
    department: 'Product',
    stage: 'Interview',
    appliedDate: '2025-03-15',
    email: 'carol@example.com',
    phone: '+1 234 567 8903',
    location: 'San Francisco, CA',
    cvUrl: '#',
    notes: 'Previous PM at Google.',
    timeline: [
      { action: 'Application submitted', date: '2025-03-15' },
      { action: 'Screening completed', date: '2025-03-18' },
      { action: 'Interview scheduled', date: '2025-03-20' },
    ],
  },
  {
    id: '4',
    name: 'David Lee',
    position: 'UX Designer',
    department: 'Design',
    stage: 'Offer',
    appliedDate: '2025-03-10',
    email: 'david@example.com',
    phone: '+1 234 567 8904',
    location: 'Austin, TX',
    cvUrl: '#',
    notes: 'Excellent portfolio, strong references.',
    timeline: [
      { action: 'Application submitted', date: '2025-03-10' },
      { action: 'Interview passed', date: '2025-03-15' },
      { action: 'Offer extended', date: '2025-03-18' },
    ],
  },
  {
    id: '5',
    name: 'Eva Green',
    position: 'Marketing Lead',
    department: 'Marketing',
    stage: 'Hired',
    appliedDate: '2025-03-05',
    email: 'eva@example.com',
    phone: '+1 234 567 8905',
    location: 'Chicago, IL',
    cvUrl: '#',
    notes: 'Started on April 1.',
    timeline: [
      { action: 'Application submitted', date: '2025-03-05' },
      { action: 'Offer accepted', date: '2025-03-12' },
      { action: 'Onboarding completed', date: '2025-04-01' },
    ],
  },
  {
    id: '6',
    name: 'Frank Miller',
    position: 'Sales Executive',
    department: 'Sales',
    stage: 'Rejected',
    appliedDate: '2025-03-01',
    email: 'frank@example.com',
    phone: '+1 234 567 8906',
    location: 'Miami, FL',
    cvUrl: '#',
    notes: 'Not a culture fit.',
    timeline: [
      { action: 'Application submitted', date: '2025-03-01' },
      { action: 'Rejected after screening', date: '2025-03-05' },
    ],
  },
];

export default function ApplicationsDashboard() {
  const [applications, setApplications] = useState<Application[]>(mockApplications);
  const [viewMode, setViewMode] = useState<'pipeline' | 'list'>('pipeline');
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('all');
  const [statusFilter, setStatusFilter] = useState<Stage | 'all'>('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  // Derived data
  const departments = Array.from(new Set(applications.map((a) => a.department)));

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(search.toLowerCase()) ||
      app.position.toLowerCase().includes(search.toLowerCase());
    const matchesDept = department === 'all' || app.department === department;
    const matchesStatus = statusFilter === 'all' || app.stage === statusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  // KPIs
  const totalApps = applications.length;
  const hiredCount = applications.filter((a) => a.stage === 'Hired').length;
  const rejectedCount = applications.filter((a) => a.stage === 'Rejected').length;
  const conversionRate = totalApps ? ((hiredCount / totalApps) * 100).toFixed(1) : '0';

  // Stage counts
  const stageCounts = stages.reduce(
    (acc, stage) => {
      acc[stage] = applications.filter((a) => a.stage === stage).length;
      return acc;
    },
    {} as Record<Stage, number>
  );

  // Move stage function
  const moveStage = (appId: string, direction: 'next' | 'prev') => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        const currentIdx = stages.indexOf(app.stage);
        let newStage = app.stage;
        if (direction === 'next' && currentIdx < stages.length - 1) {
          newStage = stages[currentIdx + 1];
        } else if (direction === 'prev' && currentIdx > 0) {
          newStage = stages[currentIdx - 1];
        }
        // Add timeline entry
        const newTimeline = [
          ...app.timeline,
          { action: `Moved to ${newStage}`, date: new Date().toISOString().split('T')[0] },
        ];
        return { ...app, stage: newStage, timeline: newTimeline };
      })
    );
  };

  const rejectApplication = (appId: string) => {
    setApplications((prev) =>
      prev.map((app) => {
        if (app.id !== appId) return app;
        const newTimeline = [
          ...app.timeline,
          { action: 'Application rejected', date: new Date().toISOString().split('T')[0] },
        ];
        return { ...app, stage: 'Rejected', timeline: newTimeline };
      })
    );  
  };

  const handleViewDetails = (app: Application) => {
    setSelectedApp(app);
  };

  const handleMoveStageFromDetail = (appId: string, direction: 'next' | 'prev') => {
    moveStage(appId, direction);
    setSelectedApp((prev) => {
      if (prev?.id === appId) {
        const updated = applications.find((a) => a.id === appId);
        return updated || null;
      }
      return prev;
    });
  };

  const handleRejectFromDetail = (appId: string) => {
    rejectApplication(appId);
    setSelectedApp(null);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 p-4 md:p-6 overflow-x-hidden">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Applications</h1>
            <p className="text-sm text-slate-500 mt-0.5">Manage and track candidate applications</p>
          </div>
          <div className="flex items-center gap-2 bg-white rounded-xl border border-slate-200 p-1">
            <button
              onClick={() => setViewMode('pipeline')}
              className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-colors ${
                viewMode === 'pipeline'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <LayoutGrid size={14} />
              Pipeline
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 transition-colors ${
                viewMode === 'list'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-slate-500 hover:bg-slate-50'
              }`}
            >
              <List size={14} />
              List
            </button>
          </div>
        </div>

        {/* KPI Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard title="Total Applications" value={totalApps} icon={<Users size={18} />} />
          <KPICard
            title="Hired"
            value={hiredCount}
            icon={<UserCheck size={18} />}
            trend={`${conversionRate}% conversion`}
          />
          <KPICard title="Rejected" value={rejectedCount} icon={<UserX size={18} />} />
          <KPICard
            title="In Progress"
            value={totalApps - hiredCount - rejectedCount}
            icon={<Briefcase size={18} />}
          />
        </div>

        {/* Stage Summary */}
        <div className="flex flex-wrap gap-3 p-4 bg-white rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Pipeline summary:</span>
          {stages.map((stage) => (
            <div key={stage} className="flex items-center gap-1.5">
              <div className={`w-2 h-2 rounded-full ${stageColors[stage].split(' ')[0]?.replace('bg-', 'bg-')}`} />
              <span className="text-xs text-slate-600">{stage}</span>
              <span className="text-xs font-semibold text-slate-800">{stageCounts[stage]}</span>
            </div>
          ))}
        </div>

        {/* Filters */}
        <FiltersBar
          search={search}
          setSearch={setSearch}
          department={department}
          setDepartment={setDepartment}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          departments={departments}
        />

        {/* Main Content */}
        {viewMode === 'pipeline' ? (
          <div className="w-full overflow-x-auto">
            <div className="flex gap-4 w-max min-w-max">
              {stages.map((stage) => (
                <PipelineColumn
                  key={stage}
                  stage={stage}
                  applications={filteredApps.filter((a) => a.stage === stage)}
                  onCardClick={handleViewDetails}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Stage
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Applied
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApps.map((app) => (
                    <ApplicationTableRow
                      key={app.id}
                      app={app}
                      onView={() => handleViewDetails(app)}
                      onMoveStage={(dir) => moveStage(app.id, dir)}
                      onReject={() => rejectApplication(app.id)}
                    />
                  ))}
                  {filteredApps.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-slate-500">
                        No applications match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      {/* Detail Modal */}
      {selectedApp && (
        <DetailPanel
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onMoveStage={handleMoveStageFromDetail}
          onReject={handleRejectFromDetail}
        />
      )}
    </div>
  );
}