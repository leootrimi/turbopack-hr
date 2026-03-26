import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchTeams, getTeamForEmployee, fetchTeamMembers } from "../api";

export const useTeams = () => {
  return useQuery({
    queryKey: ["teams"],
    queryFn: () => fetchTeams(),
  });
};

export const useTeamEmployee = (employeeId: number) => {
  return useQuery({
    queryKey: ["team", employeeId],
    queryFn: () => getTeamForEmployee(employeeId),
    enabled: !!employeeId,
  });
};

export const useTeamMembers = (teamId: number | undefined) => {
  return useQuery({
    queryKey: ["team", teamId, "members"],
    queryFn: () => fetchTeamMembers(teamId!),
    enabled: !!teamId,
  });
};
