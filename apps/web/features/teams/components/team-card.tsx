import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/components/ui/avatar";
import { Card } from "@/components/components/ui/card";
import { Users, ArrowRight } from "lucide-react";

interface TeamCardProps {
  team: {
    id: number;
    name: string;
    lead: { name: string; avatar: string };
    members: number;
    department: string;
    icon: string;
  };
}

export function TeamCard({ team }: TeamCardProps) {
  const initials = team.lead.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <Card className="group bg-card hover:shadow-lg hover:border-blue-200/50 transition-all duration-300 border-slate-200/60 backdrop-blur-sm overflow-hidden cursor-pointer">
      <div className="px-4">
        {/* Top Section: Icon and Department */}
        <div className="flex items-start justify-between mb-5">
          {/* Team Name */}
          <h3 className="text-lg font-semibold text-foreground mb-4 text-balance group-hover:text-blue-600 transition-colors">
            {team.name}
          </h3>
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100/60">
            {team.department}
          </span>
        </div>

        {/* Team Lead Info */}
        <div className="flex items-center gap-3 mb-5 pb-5 border-b border-slate-100">
          <Avatar className="h-10 w-10 border border-slate-200">
            <AvatarImage className=""
              src={team.lead.avatar || "/placeholder.svg"}
              alt={team.lead.name}
            />
            <AvatarFallback className="bg-linear-to-br from-blue-100 to-slate-100 text-blue-700 font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">Lead</p>
            <p className="text-xs text-slate-500">{team.lead.name}</p>
          </div>
        </div>

        {/* Members Count and Action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-600">
            <Users size={16} className="text-slate-400" />
            <span className="text-sm font-medium">{team.members} members</span>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowRight size={18} className="text-blue-500" />
          </div>
        </div>
      </div>

      {/* Subtle Bottom Border on Hover */}
      <div className="h-1 bg-linear-to-r from-blue-400 via-blue-500 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Card>
  );
}
