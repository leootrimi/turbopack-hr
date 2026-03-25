import { useQuery } from "@tanstack/react-query";
import { getCheckinDashboard, CheckinData } from "../api";

export const useCheckinDashboard = (date?: string, filterAbsent?: boolean) => {
  return useQuery<CheckinData[]>({
    queryKey: ["checkin-dashboard", date, filterAbsent],
    queryFn: () => getCheckinDashboard(date, filterAbsent),
  });
};
