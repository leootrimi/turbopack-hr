'use client';

import React from 'react';
import { ShoppingCart, Wrench } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import { InfoField } from './InfoCard';

interface PurchaseInfoCardProps {
  purchaseDate?: Date;
  purchaseCost?: number;
  supplier?: string;
  warrantyExpiration?: Date;
  condition: 'New' | 'Used' | 'Refurbished';
  status: 'Available' | 'Assigned' | 'Under Repair' | 'Retired';
  currency?: string;
}

export function PurchaseInfoCard({
  purchaseDate,
  purchaseCost,
  supplier,
  warrantyExpiration,
  condition,
  status,
  currency = 'USD',
}: PurchaseInfoCardProps) {
  const formatDate = (date: Date | undefined) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isWarrantyExpired = warrantyExpiration && new Date(warrantyExpiration) < new Date();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 transition-shadow hover:shadow-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-slate-50 rounded-lg">
          <ShoppingCart size={18} className="text-slate-600" />
        </div>
        <h3 className="text-sm font-bold text-slate-900">Purchase & Warranty</h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <InfoField
            label="Condition"
            value={<StatusBadge status={condition} type="condition" />}
          />
          <InfoField
            label="Status"
            value={<StatusBadge status={status} type="status" />}
          />
        </div>

        {purchaseDate && (
          <InfoField label="Purchase Date" value={formatDate(purchaseDate)} />
        )}

        {purchaseCost && (
          <InfoField
            label="Purchase Cost"
            value={`${currency} ${purchaseCost.toLocaleString()}`}
          />
        )}

        {supplier && (
          <InfoField label="Supplier" value={supplier} />
        )}

        {warrantyExpiration && (
          <div className={`p-3 rounded-lg ${isWarrantyExpired ? 'bg-red-50 border border-red-200' : 'bg-emerald-50 border border-emerald-200'}`}>
            <div className="flex items-start gap-2">
              <Wrench size={16} className={`mt-0.5 ${isWarrantyExpired ? 'text-red-600' : 'text-emerald-600'}`} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide mb-1 text-slate-600">
                  Warranty Expiration
                </p>
                <p className={`text-sm font-medium ${isWarrantyExpired ? 'text-red-700' : 'text-emerald-700'}`}>
                  {formatDate(warrantyExpiration)}
                </p>
                {isWarrantyExpired && (
                  <p className="text-xs text-red-600 mt-1 font-medium">Warranty has expired</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
