import { useQuery } from "@tanstack/react-query";
import { getOrgChart } from "../api/get-org-chart";

export const orgChartQueryKey = ["org-chart"] as const;

export function useOrgChart() {
  return useQuery({
    queryKey: orgChartQueryKey,
    queryFn: getOrgChart,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
