import { EmployeeForm } from "@repo/types";

export async function postEmployee(employee: EmployeeForm) {
  try {
    const response = await fetch("http://localhost:3000/api/employee", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(employee),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to post employee: ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Employee created successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ Error posting employee:", error);
    throw error;
  }
}

export async function getTeams() {
  try {
    const response = await fetch("http://localhost:3000/api/teams", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to post employee: ${errorText}`);
    }

    const data = await response.json();
    console.log("✅ Employee created successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ Error posting employee:", error);
    throw error;
  }
}
