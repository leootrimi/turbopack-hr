import { api } from "../../../lib/axios";

export async function getEmployeeDocuments(employeeId: string, category?: string) {
  const response = await api.get(`/employees/${employeeId}/documents`, {
    params: { category: category === 'all' ? undefined : category },
  });
  return response.data;
}

export async function uploadEmployeeDocument(
  employeeId: string,
  file: File,
  category: string
) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post(
    `/employees/${employeeId}/documents?category=${category}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

export async function deleteEmployeeDocument(employeeId: string, id: string) {
  const response = await api.delete(`/employees/${employeeId}/documents/${id}`);
  return response.data;
}
