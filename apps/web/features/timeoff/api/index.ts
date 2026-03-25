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

export const createTimeOffRequest = async (data: CreateTimeOffRequestDTO) => {
  return makeRequest({
    url: "/time-off",
    method: "POST",
    data,
  });
};
