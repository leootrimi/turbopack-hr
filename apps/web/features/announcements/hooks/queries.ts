import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAnnouncements, createAnnouncement } from "../api";
import { AnnouncementData } from "@repo/types";

export const useAnnouncements = () => {
  return useQuery<AnnouncementData[]>({
    queryKey: ["announcements"],
    queryFn: getAnnouncements,
  });
};

export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAnnouncement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["announcements"] });
    },
  });
};
