"use client";

import { useQuery } from "@tanstack/react-query";
import {
  getDashboardReports,
  type ReportsRangeParam,
} from "../api";

export function useDashboardReports(range: ReportsRangeParam) {
  return useQuery({
    queryKey: ["dashboard", "reports", range],
    queryFn: () => getDashboardReports(range),
  });
}
