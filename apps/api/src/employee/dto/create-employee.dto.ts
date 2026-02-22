export class CreateEmployeeDto {
  personal: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    dateOfBirth: string;
    personalNumber: string;
    address: string;
    emergencyContact: string;
  };

  job: {
    jobTitle: string;
    department: string;
    teamId: number;      // important: use ID, not name
    managerId?: number;  // optional
    employmentType: "Full-time" | "Part-time" | "Contractor";
    startDate: string;
    endDate?: string;
    workLocation: "Office" | "Remote" | "Hybrid";
  };

  compensation: {
    salaryAmount: number; // must match integer schema
    salaryType: "Gross" | "Net";
    currency: string;
    paymentFrequency: "Monthly" | "Weekly";
    bankAccount: string;
    bonusEligible: boolean;
  };
}