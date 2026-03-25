import { makeRequest } from "../../../lib/axios";

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
