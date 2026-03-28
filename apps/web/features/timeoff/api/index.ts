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


