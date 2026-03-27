// components/shared/ParticipantAvatar.tsx
import React from 'react';

interface ParticipantAvatarProps {
  initial: string;
  name: string;
  colorIndex?: number;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'w-5 h-5 text-[10px]',
  md: 'w-7 h-7 text-xs',
  lg: 'w-8 h-8 text-sm',
};

export const ParticipantAvatar: React.FC<ParticipantAvatarProps> = ({
  initial,
  name,
  colorIndex = 0,
  size = 'md',
}) => {
  const colors = [
    'bg-indigo-500',
    'bg-blue-500',
    'bg-violet-500',
    'bg-cyan-500',
    'bg-emerald-500',
    'bg-rose-500',
  ];

  return (
    <div
      className={`${sizeClasses[size]} rounded-full ${colors[colorIndex % colors.length]} text-white flex items-center justify-center font-semibold`}
      title={name}
    >
      {initial}
    </div>
  );
};