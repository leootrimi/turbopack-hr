import { useQuery } from "@tanstack/react-query";
import { getCheckinDashboard } from "../api";

export const useCheckinDashboard = () => {
  return useQuery({
    queryKey: ["checkin-dashboard"],
    queryFn: getCheckinDashboard,
  });
};
