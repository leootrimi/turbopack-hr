import { makeRequest } from "../../../lib/axios";
import { OrgChartEmployee } from "@repo/types";

export async function getOrgChart(): Promise<OrgChartEmployee[]> {
  return makeRequest<OrgChartEmployee[]>({
    url: "/api/employee/org-chart",
    method: "GET",
  });
}
