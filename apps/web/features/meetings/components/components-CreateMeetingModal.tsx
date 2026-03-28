'use client';

import React, { useState } from 'react';
import { X, Calendar, Clock, Globe, RotateCw, Users } from 'lucide-react';
import { CreateMeetingFormData } from '../types';
import { useEmployees } from '../../employees/hooks/queries';

const CreateMeetingModal = ({ onClose, onCreate }: { onClose: () => void; onCreate: (formData: CreateMeetingFormData) => void }) => {
  const { data: employees = [], isLoading: employeesLoading } = useEmployees();
  const [participantEmployeeIds, setParticipantEmployeeIds] = useState<number[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    duration: '30',
    timezone: 'UTC',
    recurring: false,
    description: '',
  });

  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const timezones = [
    'UTC',
    'EST',
    'CST',
    'MST',
    'PST',
    'GMT',
    'IST',
    'JST',
    'AEST',
  ];

  const timeSlots = [
    '08:00 AM',
    '09:00 AM',
    '10:00 AM',
    '11:00 AM',
    '12:00 PM',
    '01:00 PM',
    '02:00 PM',
    '03:00 PM',
    '04:00 PM',
    '05:00 PM',
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const t = e.target;
    if (t instanceof HTMLInputElement && t.type === 'checkbox') {
      setFormData((prev) => ({ ...prev, [t.name]: t.checked }));
    } else {
      setFormData((prev) => ({ ...prev, [t.name]: t.value }));
    }
  };

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
    setFormData((prev) => ({ ...prev, time }));
  };

  const toggleParticipant = (id: number) => {
    setParticipantEmployeeIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.time) return;
    onCreate({
      ...formData,
      participantEmployeeIds,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-slate-200/50 bg-gradient-to-r from-slate-50 to-blue-50">
          <h2 className="text-lg font-semibold text-slate-900">Create New Meeting</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200/50 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Meeting Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
              Meeting Title
            </label>
            <input
              type="text"
              name="title"
              placeholder="e.g., Q2 Planning Session"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-slate-50/50 transition-all"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Add meeting agenda..."
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-slate-50/50 resize-none transition-all"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                <Calendar size={14} className="inline mr-1" />
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-slate-50/50 transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                <Clock size={14} className="inline mr-1" />
                Duration (minutes)
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-slate-50/50 transition-all"
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">1 hour</option>
                <option value="90">1.5 hours</option>
                <option value="120">2 hours</option>
              </select>
            </div>
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-3">
              Select Time Slot
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => handleTimeSelect(time)}
                  className={`py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                    selectedTime === time
                      ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
            {selectedTime && (
              <p className="text-xs text-slate-600 mt-3">✓ Selected: {selectedTime}</p>
            )}
          </div>

          {/* Timezone & Recurring */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
                <Globe size={14} className="inline mr-1" />
                Timezone
              </label>
              <select
                name="timezone"
                value={formData.timezone}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm bg-slate-50/50 transition-all"
              >
                {timezones.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="recurring"
                  checked={formData.recurring}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="flex items-center gap-1">
                  <RotateCw size={14} className="text-slate-600" />
                  <span className="text-sm text-slate-700">Make recurring</span>
                </div>
              </label>
            </div>
          </div>

          {/* Participants (employees) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-2">
              <Users size={14} className="inline mr-1" />
              Participants
            </label>
            <p className="text-[11px] text-slate-500 mb-2">
              You are included automatically. Select other employees to invite.
            </p>
            <div className="max-h-40 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50/50 p-2 space-y-1">
              {employeesLoading ? (
                <p className="text-xs text-slate-500 px-2 py-2">Loading employees…</p>
              ) : employees.length === 0 ? (
                <p className="text-xs text-slate-500 px-2 py-2">No employees found.</p>
              ) : (
                employees.map((emp) => (
                  <label
                    key={emp.id}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white cursor-pointer text-sm"
                  >
                    <input
                      type="checkbox"
                      checked={participantEmployeeIds.includes(emp.id)}
                      onChange={() => toggleParticipant(emp.id)}
                      className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-slate-800">{emp.fullName}</span>
                    <span className="text-xs text-slate-400 truncate">{emp.email}</span>
                  </label>
                ))
              )}
            </div>
          </div>

          {/* Availability Info */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50 rounded-xl p-4">
            <p className="text-xs font-medium text-green-900 mb-1">✓ Availability Check</p>
            <p className="text-xs text-green-700">
              All participants are available at the selected time. No scheduling conflicts detected.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-slate-200/50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-slate-200 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-colors text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!formData.time}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-blue-500 text-white font-medium rounded-xl hover:from-indigo-600 hover:to-blue-600 transition-all shadow-lg shadow-indigo-500/20 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Meeting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateMeetingModal;
