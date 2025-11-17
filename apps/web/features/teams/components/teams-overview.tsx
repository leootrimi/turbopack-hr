"use client";

import { useState, useMemo } from "react";
import { Search, Users, Filter } from "lucide-react";
import { Input } from "@/components/components/ui/input";
import { Button } from "@/components/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/components/ui/select";
import { TeamCard } from "./team-card";

const teamsData = [
  {
    id: 1,
    name: "Product Design",
    lead: { name: "Sarah Chen", avatar: "/avatar-sarah.png" },
    members: 8,
    department: "Design",
    icon: "🎨",
  },
  {
    id: 2,
    name: "Frontend Engineering",
    lead: { name: "Alex Rodriguez", avatar: "/avatar-alex.png" },
    members: 12,
    department: "Engineering",
    icon: "⚛️",
  },
  {
    id: 3,
    name: "Backend Services",
    lead: { name: "Jordan Kim", avatar: "/avatar-jordan.jpg" },
    members: 10,
    department: "Engineering",
    icon: "🔧",
  },
  {
    id: 4,
    name: "Marketing Growth",
    lead: { name: "Emma Wilson", avatar: "/avatar-emma.jpg" },
    members: 6,
    department: "Marketing",
    icon: "📈",
  },
  {
    id: 5,
    name: "Customer Success",
    lead: { name: "Michael Torres", avatar: "/avatar-michael.png" },
    members: 9,
    department: "Operations",
    icon: "💬",
  },
  {
    id: 6,
    name: "Data Analytics",
    lead: { name: "Lisa Zhang", avatar: "/avatar-lisa.jpg" },
    members: 7,
    department: "Engineering",
    icon: "📊",
  },
  {
    id: 7,
    name: "Security & Compliance",
    lead: { name: "James Patterson", avatar: "/avatar-james.jpg" },
    members: 5,
    department: "Operations",
    icon: "🔐",
  },
  {
    id: 8,
    name: "HR & People Ops",
    lead: { name: "Nina Patel", avatar: "/avatar-nina.jpg" },
    members: 4,
    department: "Operations",
    icon: "👥",
  },
];

export function TeamsOverview() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [sortBy, setSortBy] = useState("name");

  const departments = [
    "all",
    ...new Set(teamsData.map((team) => team.department)),
  ];

  const filteredAndSortedTeams = useMemo(() => {
    let filtered = teamsData.filter((team) => {
      const matchesSearch =
        team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        team.lead.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDepartment =
        selectedDepartment === "all" || team.department === selectedDepartment;
      return matchesSearch && matchesDepartment;
    });

    // Sort
    if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "members") {
      filtered.sort((a, b) => b.members - a.members);
    } else if (sortBy === "department") {
      filtered.sort((a, b) => a.department.localeCompare(b.department));
    }

    return filtered;
  }, [searchQuery, selectedDepartment, sortBy]);

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-slate-50">
      {/* Header Section */}
      <div className="border-b border-slate-200/60 bg-white/70 backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-slate-400 flex gap-2 items-center">
                <Users size={24} />
                <h1 className="text-3xl font-bold text-slate-900">Teams</h1>
              </div>
              <p className="text-slate-500 text-sm mt-1">
                Manage and view all company teams
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Search Input */}
            <div className="relative md:col-span-1">
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

            <Select
              value={selectedDepartment}
              onValueChange={setSelectedDepartment}
            >
              <SelectTrigger className="bg-slate-50/80 border-slate-200/80 focus:ring-offset-0 focus:ring-2 focus:ring-blue-500">
                <Filter size={18} className="mr-2 text-slate-400" />
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200">
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>
                    {dept === "all" ? "All Departments" : dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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

      {/* Teams Grid */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {filteredAndSortedTeams.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedTeams.map((team) => (
              <TeamCard key={team.id} team={team} />
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
  );
}
