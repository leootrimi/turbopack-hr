import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTimeOffRequest, CreateTimeOffRequestDTO, getTimeOffRequests } from "../api";

export function useCreateTimeOff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTimeOffRequestDTO) => createTimeOffRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["time-off"] });
    },
  });
}

export function useTimeOffRequests() {
  return useQuery({
    queryKey: ["time-off"],
    queryFn: getTimeOffRequests,
  });
}
