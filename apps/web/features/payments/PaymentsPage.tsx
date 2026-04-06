'use client';

import React, { useState } from 'react';
import { PageHeader } from './components/PageHeader';
import { DragDropUpload } from './components/DragDropUpload';
import { ManualPaymentForm } from './components/ManualPaymentForm';
import { PaymentsTable, PaymentRecord } from './components/PaymentsTable';
import { Upload as UploadIcon, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useUploadFile, usePayments } from './hooks/queries';

export default function PaymentsPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data: paymentsData, isLoading } = usePayments(page, limit);
  const { mutateAsync: uploadPayment, isPending: isUploading } = useUploadFile();
  const [activeTab, setActiveTab ] = useState<'upload' | 'manual'>('upload');

  // Map backend record to frontend interface
  const payments: PaymentRecord[] = paymentsData?.data.map((p: any) => ({
    id: String(p.id),
    date: new Date(p.date).toISOString().split('T')[0] ?? "",
    amount: parseFloat(p.amount),
    vendor: p.vendor,
    category: p.category,
    description: p.description,
    source: p.source,
    status: p.status,
    document: p.documentUrl ? { name: p.documentName || 'Document', url: p.documentUrl } : undefined,
  })) || [];

  // Handle uploaded files
  const handleFileUpload = async (files: File[]) => {
    for (const file of files) {
      try {
        await uploadPayment({
          amount: '0',
          date: new Date().toISOString(),
          vendor: file.name.replace(/\.[^.]+$/, ''),
          category: 'Other',
          source: 'upload',
          status: 'processed',
          file,
        });
      } catch (error) {
        console.error("Upload failed for file:", file.name, error);
      }
    }
  };

  // Handle manual form submission
  const handleManualSubmit = async (formData: {
    amount: string;
    date: string;
    vendor: string;
    category: string;
    description: string;
    file?: File;
  }) => {
    try {
      await uploadPayment({
        ...formData,
        source: formData.file ? 'both' : 'manual',
        status: 'processed',
      });
    } catch (error) {
      console.error("Manual submission failed:", error);
    }
  };

  const handleEdit = (id: string) => {
    console.log('Edit payment:', id);
  };

  // Handle delete payment
  const handleDelete = (id: string) => {
    console.log('Delete payment:', id);
  };

  // Handle document view
  const handleViewDocument = (document: { name: string; url: string }) => {
    window.open(document.url, '_blank');
  };

  // Calculate totals (ideally this should be an aggregate from backend, but for now we use the visible count/total)
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const recordCount = paymentsData?.total || 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <PageHeader totalAmount={totalAmount} recordCount={recordCount} />

        {/* Upload & Manual Entry Section */}
        <div className="mb-8">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('upload')}
              disabled={isUploading}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                activeTab === 'upload'
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-slate-600 border-transparent hover:text-slate-900'
              } ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="flex items-center gap-2">
                {isUploading ? <Loader2 size={16} className="animate-spin text-indigo-600" /> : <UploadIcon size={16} />}
                {isUploading ? 'Uploading...' : 'Upload Receipt'}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('manual')}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                activeTab === 'manual'
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <span>+</span>
                Manual Entry
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Upload Section */}
            <div className={`${activeTab === 'upload' ? '' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-full">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Upload Receipt / Document</h2>
                <DragDropUpload onFileSelect={handleFileUpload} />
              </div>
            </div>

            {/* Manual Entry Section */}
            <div className={`${activeTab === 'manual' ? '' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 h-full">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Add Payment Manually</h2>
                <ManualPaymentForm onSubmit={handleManualSubmit} isLoading={isUploading} />
              </div>
            </div>
          </div>
        </div>

        {/* Payments Table Section */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Payment Records</h2>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 size={40} className="animate-spin text-indigo-600" />
                <p className="text-slate-500 font-medium">Loading payments...</p>
              </div>
            ) : (
              <>
                <PaymentsTable
                  payments={payments}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onViewDocument={handleViewDocument}
                />
                
                {/* Pagination Controls */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <p className="text-sm text-slate-500">
                    Showing <span className="font-medium text-slate-900">{(page - 1) * limit + 1}</span> to <span className="font-medium text-slate-900">{Math.min(page * limit, recordCount)}</span> of <span className="font-medium text-slate-900">{recordCount}</span> records
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, paymentsData?.totalPages || 0) }, (_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                              page === pageNum
                                ? 'bg-indigo-600 text-white'
                                : 'text-slate-600 hover:bg-white hover:border-slate-200 border border-transparent'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setPage(p => Math.min(paymentsData?.totalPages || 1, p + 1))}
                      disabled={page >= (paymentsData?.totalPages || 1)}
                      className="p-2 text-slate-600 hover:text-indigo-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
