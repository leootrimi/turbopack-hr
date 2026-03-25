'use client';

import React, { useState, useRef } from 'react';
import { PageHeader } from './components/PageHeader';
import { DragDropUpload } from './components/DragDropUpload';
import { ManualPaymentForm } from './components/ManualPaymentForm';
import { PaymentsTable, PaymentRecord } from './components/PaymentsTable';
import { Upload as UploadIcon } from 'lucide-react';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState<'upload' | 'manual'>('upload');

  // Handle uploaded files
  const handleFileUpload = (files: File[]) => {
    setUploadedFiles(files);

    files.forEach(file => {
      const newPayment: PaymentRecord = {
        id: uuidv4(),
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        vendor: file.name.replace(/\.[^.]+$/, ''),
        category: 'Other',
        source: 'upload',
        status: 'pending',
        document: {
          name: file.name,
          url: URL.createObjectURL(file),
        },
        uploadedFile: file,
      };
      setPayments(prev => [newPayment, ...prev]);
    });
  };

  // Handle manual form submission
  const handleManualSubmit = (formData: {
    amount: string;
    date: string;
    vendor: string;
    category: string;
    description: string;
  }) => {
    const newPayment: PaymentRecord = {
      id: uuidv4(),
      date: formData.date,
      amount: parseFloat(formData.amount),
      vendor: formData.vendor,
      category: formData.category,
      description: formData.description,
      source: 'manual',
      status: 'pending',
    };

    setPayments(prev => [newPayment, ...prev]);
  };

  const handleEdit = (id: string) => {
    console.log('Edit payment:', id);
  };

  // Handle delete payment
  const handleDelete = (id: string) => {
    setPayments(prev => prev.filter(payment => payment.id !== id));
  };

  // Handle document view
  const handleViewDocument = (document: { name: string; url: string }) => {
    window.open(document.url, '_blank');
  };

  // Calculate totals
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
  const recordCount = payments.length;

  return (
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <PageHeader totalAmount={totalAmount} recordCount={recordCount} />

        {/* Upload & Manual Entry Section */}
        <div className="mb-8">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-3 font-medium text-sm transition-colors border-b-2 ${
                activeTab === 'upload'
                  ? 'text-indigo-600 border-indigo-600'
                  : 'text-slate-600 border-transparent hover:text-slate-900'
              }`}
            >
              <div className="flex items-center gap-2">
                <UploadIcon size={16} />
                Upload Receipt
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
            {/* Upload Section - Always Visible on Large Screens */}
            <div className={`${activeTab === 'upload' ? '' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Upload Receipt / Document</h2>
                <DragDropUpload onFileSelect={handleFileUpload} />
              </div>
            </div>

            {/* Manual Entry Section - Always Visible on Large Screens */}
            <div className={`${activeTab === 'manual' ? '' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                <h2 className="text-lg font-bold text-slate-900 mb-4">Add Payment Manually</h2>
                <ManualPaymentForm onSubmit={handleManualSubmit} />
              </div>
            </div>

            {/* Mobile Tab Content */}
            {activeTab === 'upload' && (
              <div className="lg:hidden">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Upload Receipt / Document</h2>
                  <DragDropUpload onFileSelect={handleFileUpload} />
                </div>
              </div>
            )}

            {activeTab === 'manual' && (
              <div className="lg:hidden">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                  <h2 className="text-lg font-bold text-slate-900 mb-4">Add Payment Manually</h2>
                  <ManualPaymentForm onSubmit={handleManualSubmit} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Payments Table Section */}
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">Payment Records</h2>
          <PaymentsTable
            payments={payments}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDocument={handleViewDocument}
          />
        </div>
      </div>
    </div>
  );
}
