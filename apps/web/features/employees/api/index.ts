import { makeRequest } from "../../../lib/axios";

export async function getEmployees() {
  try {
    const data = await makeRequest<any>({
      url: "/api/employee",
      method: "GET",
    });

    return data;
  } catch (error) {
    throw error;
  }
}

export async function getEmployee(id: string) {
  try {
    const data = await makeRequest<any>({
      url: `/api/employee/${id}`,
      method: "GET",
    });

    return data;
  } catch (error) {
    throw error;
  }
}

export async function getEmployeeTeam(id: string) {
  try {
    const data = await makeRequest<any>({
      url: `/api/employee/${id}/team`,
      method: "GET",
    });
    return data;
  } catch (error) {
    throw error;
  }
}

export async function updateEmployeeTeam(id: string, teamId: number | null) {
  try {
    const data = await makeRequest<any>({
      url: `/api/employee/${id}/team`,
      method: "PATCH",
      data: { teamId },
    });
    return data;
  } catch (error) {
    throw error;
  }
}

export async function updateEmployee(id: string, data: any) {
  try {
    const result = await makeRequest<any>({
      url: `/api/employee/${id}`,
      method: "PATCH",
      data,
    });
    return result;
  } catch (error) {
    throw error;
  }
}