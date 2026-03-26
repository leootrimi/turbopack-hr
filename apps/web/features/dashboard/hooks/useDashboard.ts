import { useQuery } from "@tanstack/react-query";
import { getDashboardSummary } from "../api/dashboard";

export const useDashboardSummary = () => {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: getDashboardSummary,
  });
};
