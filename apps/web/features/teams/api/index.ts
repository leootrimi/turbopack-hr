import { request } from "@/components/lib/api";
import { Team } from "../../types";

export async function fetchTeams() {
  const teams = await request<Team[]>({
    url: 'http://localhost:3000/api/teams',
    method: 'GET',
    params: { page: 1, limit: 10 },
  });

  console.log(teams);
  return teams
}