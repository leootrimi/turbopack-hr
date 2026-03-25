'use client';

import React from 'react';
import { ArrowLeft, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface EquipmentHeaderProps {
  name: string;
  assetTag: string;
  serialNumber: string;
  onBack?: () => void;
}

export function EquipmentHeader({ name, assetTag, serialNumber, onBack }: EquipmentHeaderProps) {
  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-6">
        {onBack && (
          <button
            onClick={onBack}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
        )}
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{name}</h1>
          <p className="text-slate-500 text-sm mt-1">Equipment Details</p>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="bg-slate-50 rounded-lg px-4 py-2 border border-slate-200 flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Asset Tag:</span>
          <span className="text-sm font-mono text-slate-900">{assetTag || 'N/A'}</span>
          {assetTag && (
            <button
              onClick={() => copyToClipboard(assetTag, 'asset')}
              className="ml-1 p-1 hover:bg-slate-200 rounded transition-colors"
            >
              {copied === 'asset' ? (
                <CheckCircle size={14} className="text-green-600" />
              ) : (
                <Copy size={14} className="text-slate-400" />
              )}
            </button>
          )}
        </div>

        <div className="bg-slate-50 rounded-lg px-4 py-2 border border-slate-200 flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Serial:</span>
          <span className="text-sm font-mono text-slate-900">{serialNumber || 'N/A'}</span>
          {serialNumber && (
            <button
              onClick={() => copyToClipboard(serialNumber, 'serial')}
              className="ml-1 p-1 hover:bg-slate-200 rounded transition-colors"
            >
              {copied === 'serial' ? (
                <CheckCircle size={14} className="text-green-600" />
              ) : (
                <Copy size={14} className="text-slate-400" />
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
