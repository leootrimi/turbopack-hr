import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { uploadPayment, getPayments } from '../api';

export const useUploadFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => uploadPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
};

export const usePayments = (page: number = 1, limit: number = 10) => {
  return useQuery({
    queryKey: ['payments', page, limit],
    queryFn: () => getPayments(page, limit),
  });
};
