'use client';

import React from 'react';
import { Cpu } from 'lucide-react';
import { InfoField } from './InfoCard';

interface SpecificationsCardProps {
  category: string;
  brand: string;
  model: string;
  location: 'Office' | 'Remote' | 'Warehouse';
}

export function SpecificationsCard({
  category,
  brand,
  model,
  location,
}: SpecificationsCardProps) {
  const getLocationColor = (loc: string) => {
    switch (loc) {
      case 'Office':
        return 'bg-indigo-50 border-indigo-200 text-indigo-700';
      case 'Remote':
        return 'bg-cyan-50 border-cyan-200 text-cyan-700';
      case 'Warehouse':
        return 'bg-orange-50 border-orange-200 text-orange-700';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 transition-shadow hover:shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-slate-50 rounded-lg">
          <Cpu size={18} className="text-slate-600" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">Specifications</h3>
      </div>

      <div className="space-y-4">
        <InfoField label="Category" value={category} />
        <InfoField label="Brand" value={brand} />
        <InfoField label="Model" value={model} />

        <div className="pt-2 border-t border-slate-100">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
              Current Location
            </p>
            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold border ${getLocationColor(location)}`}>
              📍 {location}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
