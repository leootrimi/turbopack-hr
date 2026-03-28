import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createMeeting,
  CreateMeetingPayload,
  deleteMeeting,
  getMeetings,
} from "../api";

export function useMeetings() {
  return useQuery({
    queryKey: ["meetings"],
    queryFn: getMeetings,
  });
}

export function useCreateMeeting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateMeetingPayload) => createMeeting(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
    },
  });
}

export function useDeleteMeeting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteMeeting(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meetings"] });
    },
  });
}
