import { makeRequest } from "@/lib/axios";
import { TeamCard } from "@repo/types";

export async function fetchTeams() {
  const teams = await makeRequest<TeamCard[]>({
    url: '/api/teams/overview',
    method: 'GET',
    params: { page: 1, limit: 10 },
  });

  return teams;
}

export async function getTeamForEmployee(employeeId: number) {
  const teams = await makeRequest<TeamCard>({
    url: `api/teams/overview/${employeeId}`,
    method: 'GET',
  });

  return teams
}

export async function fetchTeamMembers(teamId: number) {
  const members = await makeRequest<{ id: number; name: string; email: string; jobTitle: string; department: string }[]>({
    url: `api/teams/${teamId}/members`,
    method: 'GET',
  });
  return members;
}