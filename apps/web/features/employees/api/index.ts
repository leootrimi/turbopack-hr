import { makeRequest } from "../../../lib/axios";

export async function getEmployees() {
  try {
    const data = await makeRequest<any>({
      url: "/api/employee",
      method: "GET",
    });

    console.log("✅ Employee fetched successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ Error getting employee:", error);
    throw error;
  }
}

export async function getEmployee(id: string) {
  try {
    const data = await makeRequest<any>({
      url: `/api/employee/${id}`,
      method: "GET",
    });

    console.log("✅ Employee fetched successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ Error getting employee:", error);
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
    console.error("❌ Error getting employee team:", error);
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
    console.log("✅ Employee team updated:", data);
    return data;
  } catch (error) {
    console.error("❌ Error updating employee team:", error);
    throw error;
  }
}