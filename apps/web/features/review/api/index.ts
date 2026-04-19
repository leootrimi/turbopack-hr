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
