'use client';

import React, { useState } from 'react';
import { Field, Input, Select, Textarea } from './PaymentFormComponents';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface PaymentFormData {
  amount: string;
  date: string;
  vendor: string;
  category: string;
  description: string;
}

interface ManualPaymentFormProps {
  onSubmit: (data: PaymentFormData) => void;
  isLoading?: boolean;
}

const PAYMENT_CATEGORIES = [
  'Office Supplies',
  'Travel & Transportation',
  'Meals & Entertainment',
  'Software & Subscriptions',
  'Utilities',
  'Equipment & Hardware',
  'Maintenance & Repairs',
  'Professional Services',
  'Other',
];

export function ManualPaymentForm({ onSubmit, isLoading = false }: ManualPaymentFormProps) {
  const [formData, setFormData] = useState<PaymentFormData>({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    vendor: '',
    category: 'Office Supplies',
    description: '',
  });

  const [errors, setErrors] = useState<Partial<PaymentFormData>>({});
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<PaymentFormData> = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (!formData.vendor.trim()) {
      newErrors.vendor = 'Vendor name is required';
    }
    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof PaymentFormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      setFeedback({
        type: 'error',
        message: 'Please fill in all required fields correctly',
      });
      return;
    }

    try {
      onSubmit(formData);
      setFeedback({
        type: 'success',
        message: 'Payment record added successfully!',
      });
      setFormData({
        amount: '',
        date: new Date().toISOString().split('T')[0],
        vendor: '',
        category: 'Office Supplies',
        description: '',
      });

      setTimeout(() => setFeedback(null), 3000);
    } catch (error) {
      setFeedback({
        type: 'error',
        message: 'Failed to add payment record',
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Feedback Messages */}
      {feedback && (
        <div
          className={`flex items-start gap-3 p-4 rounded-lg border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle size={18} className="flex-shrink-0 mt-0.5" />
          ) : (
            <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
          )}
          <p className="text-sm font-medium">{feedback.message}</p>
        </div>
      )}

      {/* Main Form Grid */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Amount" required hint="Enter the payment amount">
            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium">$</span>
              <Input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                className={errors.amount ? 'border-red-400 focus:ring-red-500/20 focus:border-red-400' : ''}
              />
            </div>
            {errors.amount && (
              <p className="text-xs text-red-600 mt-1">{errors.amount}</p>
            )}
          </Field>

          <Field label="Date" required hint="Payment date">
            <Input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={errors.date ? 'border-red-400 focus:ring-red-500/20 focus:border-red-400' : ''}
            />
            {errors.date && (
              <p className="text-xs text-red-600 mt-1">{errors.date}</p>
            )}
          </Field>
        </div>

        <Field label="Vendor / Payee" required hint="Name of the vendor or payee">
          <Input
            type="text"
            name="vendor"
            value={formData.vendor}
            onChange={handleChange}
            placeholder="e.g., Apple Inc., Office Depot"
            className={errors.vendor ? 'border-red-400 focus:ring-red-500/20 focus:border-red-400' : ''}
          />
          {errors.vendor && (
            <p className="text-xs text-red-600 mt-1">{errors.vendor}</p>
          )}
        </Field>

        <Field label="Category" required hint="Select the expense category">
          <Select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={errors.category ? 'border-red-400 focus:ring-red-500/20 focus:border-red-400' : ''}
          >
            {PAYMENT_CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </Select>
          {errors.category && (
            <p className="text-xs text-red-600 mt-1">{errors.category}</p>
          )}
        </Field>

        <Field label="Description / Notes" hint="Optional details about this payment">
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add any additional notes..."
            rows={3}
          />
        </Field>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-slate-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Adding Payment...' : 'Add Payment Record'}
      </button>
    </form>
  );
}
