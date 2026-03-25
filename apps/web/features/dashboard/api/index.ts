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

export const getCheckinDashboard = async () => {
  return makeRequest<CheckinData[]>({
    url: "/api/checkin/dashboard",
    method: "GET",
  });
};
