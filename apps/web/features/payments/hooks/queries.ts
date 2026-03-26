import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadFile } from '../api';

export const useUploadFile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadFile(file),
    onSuccess: () => {
      // Invalidate relevant queries if needed
      // queryClient.invalidateQueries({ queryKey: ['payments'] });
    },
  });
};
