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