// components/calendar/SimpleCalendar.tsx
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SimpleCalendarProps {
  meetingDates?: string[];
  onDateClick?: (date: Date) => void;
}

export const SimpleCalendar: React.FC<SimpleCalendarProps> = ({
  meetingDates = [],
  onDateClick,
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'day' | 'week' | 'month'>('month');

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  const isToday = (date: Date) => date.toDateString() === today.toDateString();

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const hasMeeting = (date: Date) => {
    const dateString = date.toISOString().split('T')[0] || '';
    return meetingDates.includes(dateString);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="text-xs px-2 py-1 rounded-md bg-slate-100 text-slate-700 hover:bg-slate-200"
          >
            Today
          </button>
          <div className="flex gap-1">
            <button
              onClick={goToPreviousMonth}
              className="p-1 rounded-md hover:bg-slate-100"
            >
              <ChevronLeft size={16} />
            </button>
            <button onClick={goToNextMonth} className="p-1 rounded-md hover:bg-slate-100">
              <ChevronRight size={16} />
            </button>
          </div>
          <span className="text-sm font-medium text-slate-800 ml-2">
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </span>
        </div>
        <div className="flex gap-1">
          {(['day', 'week', 'month'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`text-xs px-2 py-1 rounded-md transition-colors ${
                view === v
                  ? 'bg-indigo-50 text-indigo-700 font-medium'
                  : 'text-slate-500 hover:bg-slate-100'
              }`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-7 text-center border-b border-slate-100">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
          <div key={day} className="py-2 text-xs font-medium text-slate-500">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 auto-rows-[70px]">
        {days.map((day, idx) => (
          <div
            key={idx}
            className={`border-b border-r border-slate-100 p-1 cursor-pointer hover:bg-slate-50 transition-colors ${
              !day ? 'bg-slate-50' : ''
            }`}
            onClick={() => day && onDateClick?.(day)}
          >
            {day && (
              <div className="flex flex-col h-full">
                <span
                  className={`text-xs w-5 h-5 flex items-center justify-center rounded-full ${
                    isToday(day)
                      ? 'bg-gradient-to-r from-indigo-500 to-blue-500 text-white'
                      : 'text-slate-600'
                  }`}
                >
                  {day.getDate()}
                </span>
                {hasMeeting(day) && (
                  <div className="mt-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mx-auto" />
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};