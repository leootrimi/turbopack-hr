import { api } from '../../../lib/axios';

export const uploadPayment = async (data: {
  amount: string;
  date: string;
  vendor: string;
  category: string;
  description?: string;
  source: 'manual' | 'upload' | 'both';
  status: 'pending' | 'processed' | 'error';
  file?: File;
}): Promise<any> => {
  const formData = new FormData();
  if (data.file) formData.append('file', data.file);
  formData.append('amount', data.amount);
  formData.append('date', data.date);
  formData.append('vendor', data.vendor);
  formData.append('category', data.category);
  if (data.description) formData.append('description', data.description);
  formData.append('source', data.source);
  formData.append('status', data.status);

  const response = await api.post('/payments', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const getPayments = async (page: number = 1, limit: number = 10): Promise<any> => {
  const response = await api.get('/payments', {
    params: { page, limit },
  });
  return response.data;
};
