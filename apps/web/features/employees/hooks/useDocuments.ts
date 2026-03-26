import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getEmployeeDocuments,
  uploadEmployeeDocument,
  deleteEmployeeDocument,
} from "../api/documents";

export const useDocuments = (employeeId: string, category?: string) => {
  return useQuery({
    queryKey: ["employee-documents", employeeId, category],
    queryFn: () => getEmployeeDocuments(employeeId, category),
  });
};

export const useUploadDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      employeeId,
      file,
      category,
    }: {
      employeeId: string;
      file: File;
      category: string;
    }) => uploadEmployeeDocument(employeeId, file, category),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["employee-documents", variables.employeeId],
      });
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ employeeId, id }: { employeeId: string; id: string }) =>
      deleteEmployeeDocument(employeeId, id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["employee-documents", variables.employeeId],
      });
    },
  });
};
