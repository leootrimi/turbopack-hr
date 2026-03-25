import { useQuery } from "@tanstack/react-query";
import { getAnnouncements, AnnouncementData } from "../api";

export const useAnnouncements = () => {
  return useQuery<AnnouncementData[]>({
    queryKey: ["announcements"],
    queryFn: getAnnouncements,
  });
};
