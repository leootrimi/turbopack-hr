import { makeRequest } from "../../../lib/axios";

export interface MeetingParticipantApi {
  employeeId: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface MeetingOrganizerApi {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface MeetingApi {
  id: number;
  title: string;
  description: string | null;
  organizerId: number;
  startsAt: string;
  durationMinutes: number;
  timezone: string;
  status: "scheduled" | "canceled";
  createdAt: string;
  updatedAt: string;
  organizer: MeetingOrganizerApi | null;
  participants: MeetingParticipantApi[];
}

export interface CreateMeetingPayload {
  title: string;
  description?: string;
  startsAt: string;
  durationMinutes: number;
  timezone?: string;
  participantEmployeeIds?: number[];
}

export async function getMeetings() {
  return makeRequest<MeetingApi[]>({
    url: "/meetings",
    method: "GET",
  });
}

export async function createMeeting(data: CreateMeetingPayload) {
  return makeRequest<MeetingApi>({
    url: "/meetings",
    method: "POST",
    data,
  });
}

export async function deleteMeeting(id: number) {
  return makeRequest<{ success: boolean }>({
    url: `/meetings/${id}`,
    method: "DELETE",
  });
}
