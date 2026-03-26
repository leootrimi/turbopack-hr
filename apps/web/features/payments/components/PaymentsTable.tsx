'use client';

import React from 'react';
import { MoreVertical, FileText, Download, Trash2, Edit2, Eye } from 'lucide-react';
import { useState } from 'react';

export interface PaymentRecord {
  id: string;
  date: string;
  amount: number;
  vendor: string;
  category: string;
  description?: string;
  document?: {
    name: string;
    url: string;
  };
  uploadedFile?: File;
  status: 'pending' | 'processed';
  source: 'manual' | 'upload' | 'both';
}

interface PaymentsTableProps {
  payments: PaymentRecord[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onViewDocument?: (document: { name: string; url: string }) => void;
}

const getCategoryColor = (category: string) => {
  const colors: Record<string, { bg: string; text: string; border: string }> = {
    'Office Supplies': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    'Travel & Transportation': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
    'Meals & Entertainment': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
    'Software & Subscriptions': { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    'Utilities': { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    'Equipment & Hardware': { bg: 'bg-pink-50', text: 'text-pink-700', border: 'border-pink-200' },
    'Maintenance & Repairs': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
    'Professional Services': { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' },
    'Other': { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
  };
  return colors[category] || colors['Other'];
};

export function PaymentsTable({
  payments,
  onEdit,
  onDelete,
  onViewDocument,
}: PaymentsTableProps) {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (payments.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-12 text-center">
        <FileText size={48} className="text-slate-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-slate-900 mb-1">No payments added yet</h3>
        <p className="text-slate-500 text-sm">
          Upload receipts or add payment records manually to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      {/* Table for Desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider">
                Vendor
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider">
                Document
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-slate-900 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-slate-900 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {payments.map(payment => {
              const categoryStyle = getCategoryColor(payment.category);
              return (
                <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">
                    {formatDate(payment.date)}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-slate-900">
                    {formatCurrency(payment.amount)}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-900">{payment.vendor}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${categoryStyle?.bg} ${categoryStyle?.text} ${categoryStyle?.border}`}
                    >
                      {payment.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 max-w-xs truncate">
                    {payment.description || '-'}
                  </td>
                  <td className="px-6 py-4">
                    {payment.document ? (
                      <button
                        onClick={() => onViewDocument?.(payment.document!)}
                        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <FileText size={14} />
                        View
                      </button>
                    ) : (
                      <span className="text-slate-400 text-sm">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        payment.status === 'processed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      {payment.status === 'processed' ? '✓ Processed' : '⏳ Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === payment.id ? null : payment.id)}
                        className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
                      >
                        <MoreVertical size={16} className="text-slate-400" />
                      </button>

                      {openMenu === payment.id && (
                        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-slate-200 z-10">
                          <button
                            onClick={() => {
                              onEdit(payment.id);
                              setOpenMenu(null);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 flex items-center gap-2 transition-colors"
                          >
                            <Edit2 size={14} />
                            Edit
                          </button>
                          {payment.document && (
                            <button
                              onClick={() => {
                                onViewDocument?.(payment.document!);
                                setOpenMenu(null);
                              }}
                              className="w-full px-4 py-2 text-left text-sm text-slate-900 hover:bg-slate-50 flex items-center gap-2 transition-colors border-t border-slate-200"
                            >
                              <Download size={14} />
                              Download
                            </button>
                          )}
                          <button
                            onClick={() => setDeleteConfirm(payment.id)}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors border-t border-slate-200"
                          >
                            <Trash2 size={14} />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Card View for Mobile */}
      <div className="md:hidden divide-y divide-slate-200">
        {payments.map(payment => {
          const categoryStyle = getCategoryColor(payment.category);
          return (
            <div key={payment.id} className="p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{payment.vendor}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{formatDate(payment.date)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-900">{formatCurrency(payment.amount)}</p>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${
                      payment.status === 'processed'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {payment.status === 'processed' ? '✓' : '⏳'}
                  </span>
                </div>
              </div>

              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border mb-3 ${categoryStyle?.bg} ${categoryStyle?.text} ${categoryStyle?.border}`}
              >
                {payment.category}
              </span>

              {payment.description && (
                <p className="text-xs text-slate-600 mb-3">{payment.description}</p>
              )}

              <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
                {payment.document && (
                  <button
                    onClick={() => onViewDocument?.(payment.document!)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                  >
                    <FileText size={14} />
                    View
                  </button>
                )}
                <button
                  onClick={() => onEdit(payment.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  <Edit2 size={14} />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm(payment.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Delete Payment?</h3>
            <p className="text-sm text-slate-600 mb-6">
              Are you sure you want to delete this payment record? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onDelete(deleteConfirm);
                  setDeleteConfirm(null);
                }}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
