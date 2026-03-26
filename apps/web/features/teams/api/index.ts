import { request } from "@/components/lib/api";
import { TeamCard } from "@repo/types";

export async function fetchTeams() {
  const teams = await request<TeamCard[]>({
    url: 'http://localhost:3000/api/teams/overview',
    method: 'GET',
    params: { page: 1, limit: 10 },
  });

  return teams
}

export async function getTeamForEmployee(employeeId: number) {
  const teams = await request<TeamCard>({
    url: `http://localhost:3000/api/teams/overview/${employeeId}`,
    method: 'GET',
  });

  return teams
}

export async function fetchTeamMembers(teamId: number) {
  const members = await request<{ id: number; name: string; email: string; jobTitle: string; department: string }[]>({
    url: `http://localhost:3000/api/teams/${teamId}/members`,
    method: 'GET',
  });
  return members;
}