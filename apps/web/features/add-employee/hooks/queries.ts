import { TeamSelect } from "@repo/types";
import { useQuery } from "@tanstack/react-query";
import { getTeams } from "../api";

export function useTeamSelect() {
  return useQuery<TeamSelect[], Error>({
    queryKey: ["employees"],
    queryFn: getTeams,
    staleTime: 1000 * 60 * 1,
    refetchOnWindowFocus: false,
  });
}