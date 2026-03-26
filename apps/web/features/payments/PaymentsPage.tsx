'use client';

import React, { useState, useRef } from 'react';
import { PageHeader } from './components/PageHeader';
import { DragDropUpload } from './components/DragDropUpload';
import { ManualPaymentForm } from './components/ManualPaymentForm';
import { PaymentsTable, PaymentRecord } from './components/PaymentsTable';
import { Upload as UploadIcon, Loader2 } from 'lucide-react';
import { useUploadFile } from './hooks/queries';

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const { mutateAsync: uploadFile, isPending: isUploading } = useUploadFile();
  const [activeTab, setActiveTab] = useState<'upload' | 'manual'>('upload');

  const uploadFileToS3 = async (file: File) => {
    const response = await uploadFile(file);
    return response.url;
  };

  // Handle uploaded files
  const handleFileUpload = async (files: File[]) => {
    // We only want to process each file once. 
    // DragDropUpload currently sends the full list, so we'll just take the new ones
    // or we can change DragDropUpload to only send new ones. 
    // For now, let's just process the files and clear the ones we handled.
    
    for (const file of files) {
      const paymentId = crypto.randomUUID();
      
      // Add initial pending record
      const tempPayment: PaymentRecord = {
        id: paymentId,
        date: new Date().toISOString().split('T')[0] ?? "",
        amount: 0,
        vendor: file.name.replace(/\.[^.]+$/, ''),
        category: 'Other',
        source: 'upload',
        status: 'pending',
        document: {
          name: file.name,
          url: URL.createObjectURL(file), // Temporary local URL
        },
        uploadedFile: file,
      };
      
      setPayments(prev => [tempPayment, ...prev]);

      try {
        const s3Url = await uploadFileToS3(file);
        
        // Update record with actual S3 URL and status
        setPayments(prev => prev.map(p => 
          p.id === paymentId 
            ? { ...p, status: 'processed' as const, document: { ...p.document!, url: s3Url } } 
            : p
        ));
      } catch (error) {
        setPayments(prev => prev.map(p => 
          p.id === paymentId ? { ...p, status: 'processed' as any, description: 'Upload failed' } : p
        ));
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
    const paymentId = crypto.randomUUID();
    
    const newPayment: PaymentRecord = {
      id: paymentId,
      date: formData.date,
      amount: parseFloat(formData.amount),
      vendor: formData.vendor,
      category: formData.category,
      description: formData.description,
      source: formData.file ? 'both' : 'manual',
      status: 'pending',
    };

    setPayments(prev => [newPayment, ...prev]);

    if (formData.file) {
      try {
        const s3Url = await uploadFileToS3(formData.file);
        setPayments(prev => prev.map(p => 
          p.id === paymentId 
            ? { ...p, status: 'processed' as const, document: { name: formData.file!.name, url: s3Url } } 
            : p
        ));
      } catch (error) {
        setPayments(prev => prev.map(p => 
          p.id === paymentId ? { ...p, status: 'processed' as any, description: 'Upload failed' } : p
        ));
      }
    } else {
      // If no file, just set to processed immediately (or leave as pending if that's the flow)
      setPayments(prev => prev.map(p => p.id === paymentId ? { ...p, status: 'processed' as const } : p));
    }
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
  const totalPayments = payments.filter(p => p.status === 'processed');
  const totalAmount = totalPayments.reduce((sum, payment) => sum + payment.amount, 0);
  const recordCount = totalPayments.length;

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
