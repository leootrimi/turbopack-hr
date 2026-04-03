"use client";

import React, { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import CreateMeetingModal from "./components/components-CreateMeetingModal";
import MeetingDetailsModal from "./components/components-MeetingDetailsModal";
import MeetingTable from "./components/components-MeetingTable";
import SummaryCards from "./components/components-SummaryCards";
import {
  useCreateMeeting,
  useDeleteMeeting,
  useMeetings,
} from "./hooks/queries";
import {
  combineDateAndTimeToIso,
  mapMeetingApiToMeeting,
} from "./lib/map-meeting";
import { CreateMeetingForm, Meeting } from "@repo/types";

export default function MeetingsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  const { data: meetingRows, isLoading } = useMeetings();
  const { mutateAsync: createMeetingAsync, isPending: creating } =
    useCreateMeeting();
  const { mutateAsync: deleteMeetingAsync, isPending: isDeleting } =
    useDeleteMeeting();

  const meetings = useMemo(
    () => (meetingRows ?? []).map(mapMeetingApiToMeeting),
    [meetingRows],
  );

  const stats = useMemo(() => {
    return {
      total: meetings.length,
      upcoming: meetings.filter((m) => m.status === "upcoming").length,
      completed: meetings.filter((m) => m.status === "completed").length,
      canceled: meetings.filter((m) => m.status === "canceled").length,
    };
  }, [meetings]);

  const handleCreateMeeting = async (formData: CreateMeetingForm) => {
    await createMeetingAsync({
      title: formData.title,
      description: formData.description || undefined,
      startsAt: combineDateAndTimeToIso(formData.date, formData.time),
      durationMinutes: parseInt(formData.duration, 10) || 30,
      timezone: formData.timezone,
      participantEmployeeIds: formData.participantEmployeeIds ?? [],
    });
    setIsCreateModalOpen(false);
  };

  const handleViewMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setIsDetailsModalOpen(true);
  };

  const handleEditMeeting = (meeting: Meeting) => {
    console.log("Edit meeting:", meeting);
  };

  const handleDeleteMeeting = async (meetingId: number) => {
    if (!confirm("Delete this meeting?")) return;
    await deleteMeetingAsync(meetingId);
  };

  return (
    <div className="min-h-screenbg-linear-to-br from-slate-50 via-blue-50 to-indigo-50">
      <header className="border-b border-blue-100/50 bg-white/50 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
                Meetings
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Manage and schedule team meetings
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              disabled={creating}
              className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-xl hover:from-indigo-600 hover:to-blue-600 transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30 disabled:opacity-50"
            >
              <Plus size={16} />
              Create Meeting
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* LEFT: Meeting Table */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Upcoming Meetings
              </h2>
            </div>

            <MeetingTable
              meetings={meetings}
              isLoading={isLoading}
              isDeleting={isDeleting}
              onView={handleViewMeeting}
              onEdit={handleEditMeeting}
              onDelete={handleDeleteMeeting}
            />
          </div>

          {/* RIGHT: Summary Cards */}
          <div className="lg:col-span-1 space-y-4">
            <SummaryCards stats={stats} />
          </div>
        </div>
      </main>

      {/* Modals */}
      {isCreateModalOpen && (
        <CreateMeetingModal
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={handleCreateMeeting}
        />
      )}

      {isDetailsModalOpen && selectedMeeting && (
        <MeetingDetailsModal
          meeting={selectedMeeting}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}
    </div>
  );
}
