import { makeRequest } from "../../../lib/axios";
import type { TimeOffBalanceApi } from "../components/mock";

export interface CreateTimeOffRequestDTO {
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason?: string;
  halfDay?: boolean;
  attachmentName?: string;
}

export interface LeaveRequest {
  id: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: string;
  submittedAt: string;
  reviewedBy?: string;
  managerNote?: string;
}

export interface TimeOffDashboardResponse {
  summary: {
    totalRequests: number;
    newRequests: number;
    approved: number;
    rejected: number;
    pending: number;
  };
  page: number;
  perPage: number;
  items: Array<{
    id: string;
    employeeName: string;
    type: string;
    startDate: string;
    endDate: string;
    status: string;
    createdAt: string;
  }>;
}

export const createTimeOffRequest = async (data: CreateTimeOffRequestDTO) => {
  return makeRequest({
    url: "/time-off",
    method: "POST",
    data,
  });
};

export const getTimeOffRequests = async () => {
  return makeRequest<LeaveRequest[]>({
    url: "/time-off",
    method: "GET",
  });
};

export const getTimeOffBalance = async () => {
  return makeRequest<TimeOffBalanceApi>({
    url: "/time-off/balance",
    method: "GET",
  });
};

export const getDashboardTimeOffRequests = async (params: {
  page: number;
  perPage: number;
  status?: string;
}) => {
  return makeRequest<TimeOffDashboardResponse>({
    url: "/dashboard/timeoff/requests",
    method: "GET",
    params,
  });
};

export const updateLeaveRequestStatus = async (
  id: string,
  status: "Approved" | "Rejected",
) => {
  return makeRequest({
    url: `/time-off/${id}/status`,
    method: "PATCH",
    data: { status },
  });
};

export interface TimeOffTypeDTO {
  id: number;
  name: string;
  defaultValue: number;
  enabled: boolean;
  createdAt?: string;
}

export const getTimeOffTypes = async (options?: { all?: boolean }) => {
  return makeRequest<TimeOffTypeDTO[]>({
    url: "/time-off/types",
    method: "GET",
    params: options?.all ? { all: "true" } : undefined,
  });
};

export const createTimeOffType = async (data: {
  name: string;
  defaultValue: number;
  enabled: boolean;
}) => {
  return makeRequest<TimeOffTypeDTO>({
    url: "/time-off/types",
    method: "POST",
    data,
  });
};

export const updateTimeOffType = async (
  id: number,
  data: { name?: string; defaultValue?: number; enabled?: boolean },
) => {
  return makeRequest<TimeOffTypeDTO>({
    url: `/time-off/types/${id}`,
    method: "PATCH",
    data,
  });
};

export const deleteTimeOffType = async (id: number) => {
  return makeRequest<void>({
    url: `/time-off/types/${id}`,
    method: "DELETE",
  });
};

/** Approved leave for all employees overlapping the date range (YYYY-MM-DD). */
export interface CalendarLeaveRow {
  id: string;
  employeeId: number;
  firstName: string;
  lastName: string;
  type: string;
  startDate: string;
  endDate: string;
  days: number;
  status: string;
}

export const getTimeOffCalendar = async (from: string, to: string) => {
  return makeRequest<CalendarLeaveRow[]>({
    url: "/time-off/calendar",
    method: "GET",
    params: { from, to },
  });
};


