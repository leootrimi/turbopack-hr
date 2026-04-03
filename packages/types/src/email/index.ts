import type { RequestStatus } from "../time-off/index.js";

export type EnqueueAccountCreatedEmailArgs = {
  toEmail: string;
  firstName: string;
  lastName: string;
  accountEmail: string;
  tempPassword: string;
};

export type EnqueueTimeOffStatusEmailArgs = {
  toEmail: string;
  firstName: string;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  status: Extract<RequestStatus, "Approved" | "Rejected">;
};

export type SesSendEmailArgs = {
  toEmail: string;
  fromEmail: string;
  subject: string;
  textBody: string;
  htmlBody?: string;
};
