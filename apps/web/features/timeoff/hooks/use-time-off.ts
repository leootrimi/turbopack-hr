import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTimeOffRequest, CreateTimeOffRequestDTO } from "../api";

export function useCreateTimeOff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTimeOffRequestDTO) => createTimeOffRequest(data),
    onSuccess: () => {
      // Invalidate relevant queries if any (e.g., leave balances, request list)
      // queryClient.invalidateQueries({ queryKey: ["leave-requests"] });
    },
  });
}
