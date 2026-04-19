import { makeRequest } from "../../../lib/axios";
import type { ReviewFormQuestion } from "../review-form-defaults";

export interface ReviewCycle {
  id: number;
  title: string;
  description: string | null;
  enabled: boolean;
  startDate: string | null;
  endDate: string | null;
  selfReviewQuestions: ReviewFormQuestion[] | null;
  managerReviewQuestions: ReviewFormQuestion[] | null;
  createdById: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewCycleDTO {
  title: string;
  description?: string;
  enabled?: boolean;
  startDate?: string;
  endDate?: string;
  selfReviewQuestions?: ReviewFormQuestion[] | null;
  managerReviewQuestions?: ReviewFormQuestion[] | null;
}

export interface UpdateReviewCycleDTO {
  title?: string;
  description?: string;
  enabled?: boolean;
  startDate?: string | null;
  endDate?: string | null;
  selfReviewQuestions?: ReviewFormQuestion[] | null;
  managerReviewQuestions?: ReviewFormQuestion[] | null;
}

export async function getReviewCycles(): Promise<ReviewCycle[]> {
  return makeRequest<ReviewCycle[]>({ url: "/api/reviews/cycles", method: "GET" });
}

export async function getActiveReviewCycle(): Promise<ReviewCycle | null> {
  return makeRequest<ReviewCycle | null>({ url: "/api/reviews/cycles/active", method: "GET" });
}

export async function createReviewCycle(dto: CreateReviewCycleDTO): Promise<ReviewCycle> {
  return makeRequest<ReviewCycle>({ url: "/api/reviews/cycles", method: "POST", data: dto });
}

export async function updateReviewCycle(
  id: number,
  dto: UpdateReviewCycleDTO
): Promise<ReviewCycle> {
  return makeRequest<ReviewCycle>({
    url: `/api/reviews/cycles/${id}`,
    method: "PATCH",
    data: dto,
  });
}

export async function deleteReviewCycle(id: number): Promise<ReviewCycle> {
  return makeRequest<ReviewCycle>({ url: `/api/reviews/cycles/${id}`, method: "DELETE" });
}

// --- Submissions ---

export interface SelfReviewSubmission {
  id: number;
  employeeId: number;
  reviewCycleId: number;
  answers: Record<string, string>;
  status: "draft" | "submitted";
  submittedAt: string | null;
  updatedAt: string | null;
}

export interface ManagerReviewSubmission {
  id: number;
  employeeId: number;
  managerId: number;
  reviewCycleId: number;
  answers: Record<string, any>;
  status: "draft" | "submitted";
  submittedAt: string | null;
  updatedAt: string | null;
}

export interface SubmitSelfReviewDTO {
  employeeId: number;
  reviewCycleId: number;
  answers: Record<string, string>;
  status?: "draft" | "submitted";
}

export interface SubmitManagerReviewDTO {
  employeeId: number;
  managerId: number;
  reviewCycleId: number;
  answers: Record<string, any>;
  status?: "draft" | "submitted";
}

export async function submitSelfReview(dto: SubmitSelfReviewDTO): Promise<SelfReviewSubmission> {
  return makeRequest<SelfReviewSubmission>({
    url: "/api/reviews/submissions/self",
    method: "POST",
    data: dto,
  });
}

export async function submitManagerReview(
  dto: SubmitManagerReviewDTO
): Promise<ManagerReviewSubmission> {
  return makeRequest<ManagerReviewSubmission>({
    url: "/api/reviews/submissions/manager",
    method: "POST",
    data: dto,
  });
}

export async function getSelfReviewSubmission(
  cycleId: number,
  employeeId: number
): Promise<SelfReviewSubmission | null> {
  return makeRequest<SelfReviewSubmission | null>({
    url: `/api/reviews/submissions/self/${cycleId}/${employeeId}`,
    method: "GET",
  });
}

export async function getManagerReviewSubmission(
  cycleId: number,
  employeeId: number
): Promise<ManagerReviewSubmission | null> {
  return makeRequest<ManagerReviewSubmission | null>({
    url: `/api/reviews/submissions/manager/${cycleId}/${employeeId}`,
    method: "GET",
  });
}

export interface ReviewHistoryItem {
  cycleId: number;
  title: string;
  startDate: string | null;
  endDate: string | null;
  selfStatus: "draft" | "submitted" | null;
  managerStatus: "draft" | "submitted" | null;
}

export async function getReviewHistory(employeeId: number): Promise<ReviewHistoryItem[]> {
  return makeRequest<ReviewHistoryItem[]>({
    url: `/api/reviews/history/${employeeId}`,
    method: "GET",
  });
}
