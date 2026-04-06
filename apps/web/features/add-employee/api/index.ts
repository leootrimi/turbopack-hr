import { EmployeeForm, CreateEmployeeDto } from "@repo/types";
import { makeRequest } from "../../../lib/axios";

export async function postEmployee(form: EmployeeForm) {
  try {
    // Transform EmployeeForm to CreateEmployeeDto
    const dto: CreateEmployeeDto = {
      personal: form.personal,
      job: {
        jobTitle: form.job.jobTitle,
        department: form.job.department,
        teamId: Number(form.job.teamId),
        managerId: form.job.managerId ? Number(form.job.managerId) : undefined,
        startDate: form.job.startDate,
        endDate: form.job.endDate || undefined,
      },
      compensation: {
        salaryAmount: form.compensation.salaryAmount ? Number(form.compensation.salaryAmount) : undefined,
        salaryType: form.compensation.salaryType,
        bankAccount: form.compensation.bankAccount || undefined,
        bonusEligible: form.compensation.bonusEligible,
      },
    };

    const data = await makeRequest({
      url: "/api/employee",
      method: "POST",
      data: dto,
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
