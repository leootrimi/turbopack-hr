"use client";

import { useState } from "react";
import { Search, Users, Filter } from "lucide-react";
import { Input } from "@/components/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/components/ui/select";
import { TeamCard } from "./team-card";
import { useTeams } from "../hooks/queries";


export function TeamsOverview() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const { data: teams = [] } = useTeams();
  console.log(teams);
  

  return (
    <div className="min-h-screen bg-linear-to-br bg-background">
      {/* Header Section */}
      <div className="border-b border-slate-200/60 bg-background backdrop-blur-xl sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-slate-400 flex gap-2 items-center">
                <Users size={24} />
                <h1 className="text-3xl font-bold text-foreground">Teams</h1>
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
                {teams?.map((dept) => (
                  <SelectItem key={dept.id} value={dept.team_type ?? "all"}>
                    {dept.team_type === "all" ? "All Departments" : dept.team_type}
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
        {teams?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams?.map((team) => (
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
