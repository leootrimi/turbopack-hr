import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchTeams, getTeamForEmployee } from "../api";

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
