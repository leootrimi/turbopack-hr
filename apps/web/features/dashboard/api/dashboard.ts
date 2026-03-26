import { makeRequest } from "../../../lib/axios";

export async function getDashboardSummary() {
  return makeRequest<any>({
    url: "/dashboard/summary",
    method: "GET",
  });
}
