// components/shared/RSVPButtons.tsx
import React, { useState } from 'react';
import { Check, X, Minus } from 'lucide-react';

interface RSVPButtonsProps {
  participantId: string;
  currentStatus?: string;
  onStatusChange?: (participantId: string, status: string) => void;
  size?: 'sm' | 'md';
}

export const RSVPButtons: React.FC<RSVPButtonsProps> = ({
  participantId,
  currentStatus = 'pending',
  onStatusChange,
  size = 'md',
}) => {
  const [status, setStatus] = useState(currentStatus);

  const handleRSVP = (newStatus: string) => {
    setStatus(newStatus);
    onStatusChange?.(participantId, newStatus);
  };

  const buttonSize = size === 'sm' ? 'p-0.5' : 'p-1';
  const iconSize = size === 'sm' ? 12 : 14;

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => handleRSVP('confirmed')}
        className={`${buttonSize} rounded-md transition-all ${
          status === 'confirmed'
            ? 'bg-emerald-100 text-emerald-700'
            : 'text-slate-400 hover:bg-slate-100'
        }`}
        title="Accept"
      >
        <Check size={iconSize} />
      </button>
      <button
        onClick={() => handleRSVP('declined')}
        className={`${buttonSize} rounded-md transition-all ${
          status === 'declined'
            ? 'bg-rose-100 text-rose-600'
            : 'text-slate-400 hover:bg-slate-100'
        }`}
        title="Decline"
      >
        <X size={iconSize} />
      </button>
      <button
        onClick={() => handleRSVP('pending')}
        className={`${buttonSize} rounded-md transition-all ${
          status === 'pending'
            ? 'bg-amber-100 text-amber-600'
            : 'text-slate-400 hover:bg-slate-100'
        }`}
        title="Tentative"
      >
        <Minus size={iconSize} />
      </button>
    </div>
  );
};