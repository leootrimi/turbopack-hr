import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTimeOffRequest,
  CreateTimeOffRequestDTO,
  getTimeOffRequests,
  getTimeOffBalance,
  getDashboardTimeOffRequests,
  updateLeaveRequestStatus,
} from "../api";

export function useCreateTimeOff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTimeOffRequestDTO) => createTimeOffRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time-off"] });
      queryClient.invalidateQueries({ queryKey: ["time-off-balance"] });
      queryClient.invalidateQueries({ queryKey: ["time-off-dashboard"] });
    },
  });
}

export function useUpdateLeaveRequestStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: "Approved" | "Rejected";
    }) => updateLeaveRequestStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time-off"] });
      queryClient.invalidateQueries({ queryKey: ["time-off-balance"] });
      queryClient.invalidateQueries({ queryKey: ["time-off-dashboard"] });
    },
  });
}


export function useTimeOffRequests() {
  return useQuery({
    queryKey: ["time-off"],
    queryFn: getTimeOffRequests,
  });
}

export function useTimeOffBalance() {
  return useQuery({
    queryKey: ["time-off-balance"],
    queryFn: getTimeOffBalance,
  });
}

export function useDashboardTimeOffRequests(page: number, perPage: number) {
  return useQuery({
    queryKey: ["time-off-dashboard", page, perPage],
    queryFn: () => getDashboardTimeOffRequests({ page, perPage }),
  });
}


