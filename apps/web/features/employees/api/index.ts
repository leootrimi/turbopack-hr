
export async function getEmployees() {
  try {
    const response = await fetch("http://localhost:3000/api/employee", {
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
    console.log("✅ Employee fetched successfully:", data);
    return data;
  } catch (error) {
    console.error("❌ Error getting employee:", error);
    throw error;
  }
}