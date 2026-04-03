import { z } from "zod";

export type RequestStatus = "Pending" | "Approved" | "Rejected";
export type RequestType = "Work from home" | "Vacation" | "Sick Leave" | "Personal";

export interface TimeOffRequestRow {
  id: number;
  request_type: RequestType;
  date_from: string;
  date_to: string;
  amount_of_days: number;
  status: RequestStatus;
  created_at: string;
}

export const LeaveRequestSchema = z.object({
  id: z.string(),
  employeeName: z.string(),
  type: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  status: z.string(),
  createdAt: z.string(),
});

export const LeaveApprovalSectionPropsSchema = z.object({
  requests: z.array(LeaveRequestSchema),
});

export type LeaveApprovalSectionProps = z.infer<
  typeof LeaveApprovalSectionPropsSchema
>;