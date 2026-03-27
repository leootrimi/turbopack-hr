// components/participants-calendar/NotificationsPanel.tsx
import React from 'react';
import { Bell, Clock, RefreshCw, XCircle, AlertCircle } from 'lucide-react';

interface Notification {
  id: string;
  meetingId: string;
  type: 'upcoming' | 'reminder' | 'rescheduled' | 'canceled';
  minutesBefore?: number;
  message: string;
  sent: boolean;
  createdAt: string;
}

interface NotificationsPanelProps {
  notifications: Notification[];
  remindersEnabled: boolean;
  onRemindersToggle: () => void;
}

const NotificationItem: React.FC<{ notification: Notification }> = ({ notification }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'upcoming':
        return <Clock size={14} className="text-amber-500" />;
      case 'reminder':
        return <Bell size={14} className="text-indigo-500" />;
      case 'rescheduled':
        return <RefreshCw size={14} className="text-blue-500" />;
      case 'canceled':
        return <XCircle size={14} className="text-rose-500" />;
      default:
        return <AlertCircle size={14} className="text-slate-500" />;
    }
  };

  const timeAgo = () => {
    const date = new Date(notification.createdAt);
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins} min ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} hr ago`;
    return `${Math.floor(hours / 24)} days ago`;
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
      <div className="mt-0.5">{getIcon()}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-slate-700">{notification.message}</p>
        <p className="text-xs text-slate-400 mt-1">{timeAgo()}</p>
      </div>
    </div>
  );
};

export const NotificationsPanel: React.FC<NotificationsPanelProps> = ({
  notifications,
  remindersEnabled,
  onRemindersToggle,
}) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-slate-100">
        <h2 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
          <Bell size={16} className="text-amber-500" />
          Notifications & Reminders
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">Reminders</span>
          <button
            onClick={onRemindersToggle}
            className={`w-8 h-4 rounded-full transition-colors ${
              remindersEnabled ? 'bg-indigo-500' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full bg-white transition-transform ${
                remindersEnabled ? 'translate-x-4' : 'translate-x-1'
              } mt-0.5`}
            />
          </button>
        </div>
      </div>
      <div className="divide-y divide-slate-100 max-h-[320px] overflow-y-auto">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </div>
    </div>
  );
};