'use client';

import { useState } from 'react';
import { Search, Users, Filter } from 'lucide-react';
import { Input } from '@/components/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/components/ui/select';
import { TeamCardComponent } from './team-card';
import { TeamDetailSidebar } from './team-details';
import { useTeams } from '../hooks/queries';
import { TeamCard } from '@repo/types';


export function TeamsOverview() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [selectedTeam, setSelectedTeam] = useState<TeamCard | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: teams = [] } = useTeams();

  // Filter teams based on search and department
  const filteredTeams = teams.filter((team) => {
    const matchesSearch =
      team.teamName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.leaderName?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDepartment =
      selectedDepartment === 'all' || team.teamType === selectedDepartment;

    return matchesSearch && matchesDepartment;
  });

  // Sort teams
  const sortedTeams = [...filteredTeams].sort((a, b) => {
    if (sortBy === 'name') {
      return (a.teamName || '').localeCompare(b.teamName || '');
    } else if (sortBy === 'members') {
      return b.teamMemberCount - a.teamMemberCount;
    } else if (sortBy === 'department') {
      return (a.teamType || '').localeCompare(b.teamType || '');
    }
    return 0;
  });

  const handleTeamClick = (team: TeamCard) => {
    setSelectedTeam(team);
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
    setTimeout(() => setSelectedTeam(null), 300);
  };

  // Unique departments for filter
  const departments = Array.from(
    new Set(teams?.map((team) => team.teamType).filter(Boolean))
  );

  return (
    <div className="min-h-screen bg-linear-to-br bg-background">
      <div className="flex h-screen overflow-hidden">
        {/* Left Section - Content Area */}
        <div className={`transition-all duration-300 overflow-hidden flex flex-col ${sidebarOpen ? 'w-full md:w-1/2' : 'w-full'}`}>
          {/* Header Section */}
          <div className="border-b border-slate-200/60 bg-background backdrop-blur-xl sticky top-0 z-10 flex-shrink-0">
            <div className="px-6 py-3">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-slate-400 flex gap-2 items-center">
                    <Users size={20} />
                    <h1 className="text-2xl font-bold text-foreground">Teams</h1>
                  </div>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Manage and view all company teams
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Search Input */}
                <div className="relative sm:col-span-1">
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <Input
                    placeholder="Search teams or leads..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-slate-50/80 border-slate-200/80 focus-visible:ring-offset-0 focus-visible:ring-2 focus-visible:ring-blue-500 text-slate-900 placeholder-slate-400"
                  />
                </div>

                {/* Department Filter */}
                <Select
                  value={selectedDepartment}
                  onValueChange={setSelectedDepartment}
                >
                  <SelectTrigger className="bg-slate-50/80 border-slate-200/80 focus:ring-offset-0 focus:ring-2 focus:ring-blue-500">
                    <Filter size={18} className="mr-2 text-slate-400" />
                    <SelectValue placeholder="Department" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    <SelectItem value="all">All Departments</SelectItem>
                    {departments.map((dept) => (
                      <SelectItem key={dept} value={dept || 'all'}>
                        {dept}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort Filter */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-slate-50/80 border-slate-200/80 focus:ring-offset-0 focus:ring-2 focus:ring-blue-500">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-slate-200">
                    <SelectItem value="name">Sort by Name</SelectItem>
                    <SelectItem value="members">Sort by Members</SelectItem>
                    <SelectItem value="department">Sort by Department</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Teams Grid Section */}
          {/* Teams Grid Section */}
          <div className="flex-1 overflow-y-auto">
            <div className="px-6 py-8">
              {sortedTeams?.length > 0 ? (
                <div className={`grid gap-4 ${sidebarOpen ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
                  {sortedTeams?.map((team) => (
                    <div
                      key={team.teamId}
                      onClick={() => handleTeamClick(team)}
                      className="cursor-pointer"
                    >
                      <TeamCardComponent team={team} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="text-slate-300 mb-4">
                    <Users size={48} />
                  </div>
                  <p className="text-slate-600 font-medium">No teams found</p>
                  <p className="text-slate-400 text-sm mt-1">
                    Try adjusting your search or filters
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Section - Sidebar */}
        {selectedTeam && (
          <TeamDetailSidebar
            isOpen={sidebarOpen}
            onClose={handleCloseSidebar}
            team={selectedTeam}
          />
        )}
      </div>
    </div>
  );
}