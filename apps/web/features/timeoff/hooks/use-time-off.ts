import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTimeOffRequest,
  CreateTimeOffRequestDTO,
  getTimeOffRequests,
  getDashboardTimeOffRequests,
} from "../api";

export function useCreateTimeOff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTimeOffRequestDTO) => createTimeOffRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time-off"] });
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

export function useDashboardTimeOffRequests(page: number, perPage: number) {
  return useQuery({
    queryKey: ["time-off-dashboard", page, perPage],
    queryFn: () => getDashboardTimeOffRequests({ page, perPage }),
  });
}


