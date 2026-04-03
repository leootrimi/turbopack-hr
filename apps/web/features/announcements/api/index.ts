import { makeRequest } from "../../../lib/axios";
import { AnnouncementData, AnnouncementTag } from "@repo/types";

export const getAnnouncements = async () => {
  return makeRequest<AnnouncementData[]>({
    url: "/announcements",
    method: "GET",
  });
};

export const createAnnouncement = async (data: any) => {
  return makeRequest({
    url: "/announcements",
    method: "POST",
    data,
  });
};
