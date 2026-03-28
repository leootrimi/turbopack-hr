import { makeRequest } from "../../../lib/axios";

export type ReportsRangeParam =
  | "this_week"
  | "this_month"
  | "last_3_months"
  | "this_year";

export type KpiItem = {
  label: string;
  value: string;
  delta: string;
  deltaType: "up" | "down" | "neutral";
  sub: string;
};

export type CheckInTrendRow = {
  label: string;
  checkedIn: number;
  absent: number;
};

export type CheckInHourRow = { hour: string; count: number };

export type LocationSlice = { name: string; value: number; fill: string };

export type HeadcountTeamRow = {
  team: string;
  count: number;
  fill: string;
};

export type HeadcountGrowthRow = { month: string; count: number };

export type TurnoverRow = { month: string; joined: number; left: number };

export type TimeOffTypeRow = { name: string; days: number; fill: string };

export type TimeOffTrendRow = { month: string; days: number };

export type DashboardReportsResponse = {
  range: { key: ReportsRangeParam; from: string; to: string };
  kpis: KpiItem[];
  checkInTrend: CheckInTrendRow[];
  checkInByHour: CheckInHourRow[];
  peakCheckinHourLabel: string;
  locationSplit: LocationSlice[];
  headcountByTeam: HeadcountTeamRow[];
  headcountGrowth: HeadcountGrowthRow[];
  turnoverData: TurnoverRow[];
  timeOffByType: TimeOffTypeRow[];
  timeOffTrend: TimeOffTrendRow[];
};

export async function getDashboardReports(range: ReportsRangeParam) {
  return makeRequest<DashboardReportsResponse>({
    url: `/dashboard/reports`,
    method: "GET",
    params: { range },
  });
}
