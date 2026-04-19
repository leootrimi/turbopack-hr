import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getReviewCycles,
  getActiveReviewCycle,
  createReviewCycle,
  updateReviewCycle,
  deleteReviewCycle,
  CreateReviewCycleDTO,
  UpdateReviewCycleDTO,
  submitSelfReview,
  submitManagerReview,
  getSelfReviewSubmission,
  getManagerReviewSubmission,
  getReviewHistory,
  SubmitSelfReviewDTO,
  SubmitManagerReviewDTO,
} from "../api";

export const reviewCyclesQueryKey = ["review-cycles"] as const;
export const activeReviewCycleQueryKey = ["review-cycles", "active"] as const;
export const reviewHistoryQueryKey = (employeeId: number) => ["review-history", employeeId] as const;
export const selfSubmissionQueryKey = (cycleId: number, employeeId: number) =>
  ["review-submissions", "self", cycleId, employeeId] as const;
export const managerSubmissionQueryKey = (cycleId: number, employeeId: number) =>
  ["review-submissions", "manager", cycleId, employeeId] as const;

export function useReviewCycles() {
  return useQuery({
    queryKey: reviewCyclesQueryKey,
    queryFn: getReviewCycles,
    staleTime: 1000 * 60,
  });
}

export function useActiveReviewCycle() {
  return useQuery({
    queryKey: activeReviewCycleQueryKey,
    queryFn: getActiveReviewCycle,
    staleTime: 1000 * 30,
  });
}

export function useCreateReviewCycle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateReviewCycleDTO) => createReviewCycle(dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: reviewCyclesQueryKey });
      qc.invalidateQueries({ queryKey: activeReviewCycleQueryKey });
    },
  });
}

export function useUpdateReviewCycle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateReviewCycleDTO }) =>
      updateReviewCycle(id, dto),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: reviewCyclesQueryKey });
      qc.invalidateQueries({ queryKey: activeReviewCycleQueryKey });
    },
  });
}

export function useDeleteReviewCycle() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteReviewCycle(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: reviewCyclesQueryKey });
      qc.invalidateQueries({ queryKey: activeReviewCycleQueryKey });
    },
  });
}

export function useSubmitSelfReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: SubmitSelfReviewDTO) => submitSelfReview(dto),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({
        queryKey: selfSubmissionQueryKey(variables.reviewCycleId, variables.employeeId),
      });
    },
  });
}

export function useSubmitManagerReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (dto: SubmitManagerReviewDTO) => submitManagerReview(dto),
    onSuccess: (_, variables) => {
      qc.invalidateQueries({
        queryKey: managerSubmissionQueryKey(variables.reviewCycleId, variables.employeeId),
      });
    },
  });
}

export function useSelfReviewSubmission(cycleId: number, employeeId: number) {
  return useQuery({
    queryKey: selfSubmissionQueryKey(cycleId, employeeId),
    queryFn: () => getSelfReviewSubmission(cycleId, employeeId),
    enabled: !!cycleId && !!employeeId,
  });
}

export function useManagerReviewSubmission(cycleId: number, employeeId: number) {
  return useQuery({
    queryKey: managerSubmissionQueryKey(cycleId, employeeId),
    queryFn: () => getManagerReviewSubmission(cycleId, employeeId),
    enabled: !!cycleId && !!employeeId,
  });
}

export function useReviewHistory(employeeId: number) {
  return useQuery({
    queryKey: reviewHistoryQueryKey(employeeId),
    queryFn: () => getReviewHistory(employeeId),
    enabled: !!employeeId,
  });
}
