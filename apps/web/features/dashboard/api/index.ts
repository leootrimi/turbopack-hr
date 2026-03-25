import { makeRequest } from "../../../lib/axios";

export interface CheckinData {
  id: string;
  name: string;
  initials: string;
  team: string;
  status: "in" | "late" | "absent" | "leave";
  time: string | null;
  location: "office" | "remote" | "—";
}

export const getCheckinDashboard = async (date?: string, filterAbsent?: boolean) => {
  const queryParams = new URLSearchParams();
  if (date) queryParams.append("date", date);
  if (filterAbsent) queryParams.append("filterAbsent", "true");

  return makeRequest<CheckinData[]>({
    url: `/api/checkin/dashboard?${queryParams.toString()}`,
    method: "GET",
  });
};
