'use client';

import React from 'react';
import { CreditCard } from 'lucide-react';

interface PageHeaderProps {
  totalAmount?: number;
  recordCount?: number;
}

export function PageHeader({ totalAmount = 0, recordCount = 0 }: PageHeaderProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="mb-8">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-indigo-100 rounded-lg">
              <CreditCard size={20} className="text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Payments & Receipts</h1>
          </div>
          <p className="text-slate-600">
            Manage company expenses and receipts. Upload scanned documents or manually add payment records.
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 border border-indigo-200">
          <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-1">
            Total Expenses
          </p>
          <p className="text-2xl font-bold text-indigo-900">{formatCurrency(totalAmount)}</p>
        </div>
        <div className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl p-4 border border-slate-200">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1">
            Records
          </p>
          <p className="text-2xl font-bold text-slate-900">{recordCount}</p>
        </div>
      </div>
    </div>
  );
}
