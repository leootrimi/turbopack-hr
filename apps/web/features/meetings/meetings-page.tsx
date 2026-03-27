'use client';

import React, { useState } from 'react';
import { Plus, Calendar, CheckCircle2, Clock, X, Edit2, Eye } from 'lucide-react';
import CreateMeetingModal from './components/components-CreateMeetingModal';
import MeetingDetailsModal from './components/components-MeetingDetailsModal';
import MeetingTable from './components/components-MeetingTable';
import SummaryCards from './components/components-SummaryCards';
import { CreateMeetingFormData, Meeting } from './types';

export default function MeetingsPage() {
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

    const handleCreateMeeting = (meetingData: CreateMeetingFormData) => {
        console.log('Creating meeting:', meetingData);
        setIsCreateModalOpen(false);
    };

    const handleViewMeeting = (meeting: Meeting) => {
        setSelectedMeeting(meeting);
        setIsDetailsModalOpen(true);
    };

    const handleEditMeeting = (meeting: Meeting) => {
        console.log('Edit meeting:', meeting);
    };

    const handleDeleteMeeting = (meetingId: number) => {
        console.log('Delete meeting:', meetingId);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            {/* Header Section */}
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
                            onClick={() => setIsCreateModalOpen(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 text-white text-sm font-medium rounded-xl hover:from-indigo-600 hover:to-blue-600 transition-all duration-200 shadow-lg shadow-indigo-500/20 hover:shadow-xl hover:shadow-indigo-500/30"
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
                            <button className="text-xs text-indigo-600 hover:text-indigo-700 font-medium transition-colors">
                                View All →
                            </button>
                        </div>

                        <MeetingTable
                            onView={handleViewMeeting}
                            onEdit={handleEditMeeting}
                            onDelete={handleDeleteMeeting}
                        />
                    </div>

                    {/* RIGHT: Summary Cards */}
                    <div className="lg:col-span-1 space-y-4">
                        <SummaryCards />
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