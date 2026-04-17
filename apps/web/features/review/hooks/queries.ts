import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getReviewCycles,
  getActiveReviewCycle,
  createReviewCycle,
  updateReviewCycle,
  deleteReviewCycle,
  CreateReviewCycleDTO,
  UpdateReviewCycleDTO,
} from "../api";

export const reviewCyclesQueryKey = ["review-cycles"] as const;
export const activeReviewCycleQueryKey = ["review-cycles", "active"] as const;

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
