import { EmployeeForm } from "@repo/types";
import { makeRequest } from "../../../lib/axios";

export async function postEmployee(employee: EmployeeForm) {
  try {
    const data = await makeRequest({
      url: "/api/employee",
      method: "POST",
      data: employee,
    });

    console.log("✅ Employee created successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ Error posting employee:", error);
    throw error;
  }
}

export async function getTeams() {
  try {
    const data = await makeRequest<any>({
      url: "/api/teams",
      method: "GET",
    });

    console.log("✅ Teams fetched successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ Error posting employee:", error);
    throw error;
  }
}
