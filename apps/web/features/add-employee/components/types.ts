export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  personalNumber: string;
  address: string;
  emergencyContact: string;
}

export interface JobInfo {
  jobTitle: string;
  department: string;
  team: string;
  manager: string;
  employmentType: "Full-time" | "Part-time" | "Contractor";
  startDate: string;
  endDate: string;
  workLocation: "Office" | "Remote" | "Hybrid";
}

export interface CompensationInfo {
  salaryAmount: string;
  salaryType: "Gross" | "Net";
  currency: string;
  paymentFrequency: "Monthly" | "Weekly";
  bankAccount: string;
  bonusEligible: boolean;
}

export interface EmployeeForm {
  personal: PersonalInfo;
  job: JobInfo;
  compensation: CompensationInfo;
}

export const INITIAL_FORM: EmployeeForm = {
  personal: {
    firstName: "", lastName: "", email: "", phone: "",
    dateOfBirth: "", personalNumber: "", address: "", emergencyContact: "",
  },
  job: {
    jobTitle: "", department: "", team: "", manager: "",
    employmentType: "Full-time", startDate: "", endDate: "",
    workLocation: "Office",
  },
  compensation: {
    salaryAmount: "", salaryType: "Gross", currency: "EUR",
    paymentFrequency: "Monthly", bankAccount: "", bonusEligible: false,
  },
};

export const DEPARTMENTS = ["Engineering", "Design", "Product", "Sales", "HR", "Finance", "Marketing"];
export const TEAMS = ["Frontend", "Backend", "Mobile", "DevOps", "Growth", "Support", "Operations"];
export const MANAGERS = ["Sarah Johnson", "Marcus Lee", "Aisha Mohammed", "Tom Nguyen", "Elena Ruiz"];
export const CURRENCIES = ["EUR", "USD", "GBP", "RSD", "CHF"];

export interface Step {
  id: number;
  title: string;
  subtitle: string;
}

export const STEPS: Step[] = [
  { id: 1, title: "Personal Information", subtitle: "Basic details & contact info"    },
  { id: 2, title: "Job Information",      subtitle: "Role, team & employment terms"   },
  { id: 3, title: "Compensation",         subtitle: "Salary, payroll & benefits"      },
];
