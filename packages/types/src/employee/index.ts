import { z } from "zod";

export const EmploymentTypeSchema = z.enum([
  "Full-time",
  "Part-time",
  "Contractor",
]);

export const WorkLocationSchema = z.enum([
  "Office",
  "Remote",
  "Hybrid",
]);

export const SalaryTypeSchema = z.enum(["Gross", "Net"]);

export const PaymentFrequencySchema = z.enum([
  "Monthly",
  "Weekly",
]);

export const CurrencySchema = z.enum([
  "EUR",
  "USD",
  "GBP",
  "RSD",
  "CHF",
]);

export const EmployeeRowSchema = z.object({
  id: z.number(),
  fullName: z.string(),
  email: z.string(),
  jobTitle: z.string(),
  department: z.string(),
});

export type EmployeeRow = z.infer<typeof EmployeeRowSchema>;

export const CreateEmployeeDtoSchema = z.object({
  personal: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    // Email to send onboarding/HR notifications (optional).
    // Accepts empty string to avoid breaking existing forms that may send "".
    personalEmail: z.union([z.string().email(), z.literal("")]).optional(),
    phone: z.string(),
    dateOfBirth: z.string(),
    personalNumber: z.string(),
    address: z.string(),
    emergencyContact: z.string(),
  }),

  job: z.object({
    jobTitle: z.string(),
    department: z.string(),
    teamId: z.number(),
    managerId: z.number().optional(),
    employmentType: EmploymentTypeSchema,
    startDate: z.string(),
    endDate: z.string().optional(),
    workLocation: WorkLocationSchema,
  }),

  compensation: z.object({
    salaryAmount: z.number(),
    salaryType: SalaryTypeSchema,
    currency: CurrencySchema,
    paymentFrequency: PaymentFrequencySchema,
    bankAccount: z.string(),
    bonusEligible: z.boolean(),
  }),
});

export type CreateEmployeeDto = z.infer<typeof CreateEmployeeDtoSchema>;

export const PersonalInfoSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  personalEmail: z.union([z.string().email(), z.literal("")]).optional(),
  phone: z.string().min(1, "Phone number is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  personalNumber: z.string().min(1, "Personal number is required"),
  address: z.string().min(1, "Address is required"),
  emergencyContact: z.string().min(1, "Emergency contact is required"),
});

export const JobInfoSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  department: z.string().min(1, "Department is required"),
  team: z.string().min(1, "Team is required"),
  manager: z.string().min(1, "Manager is required"),
  employmentType: EmploymentTypeSchema,
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional(),
  workLocation: WorkLocationSchema,
});

export const CompensationInfoSchema = z.object({
  salaryAmount: z.string().min(1, "Salary amount is required"),
  salaryType: SalaryTypeSchema,
  currency: CurrencySchema,
  paymentFrequency: PaymentFrequencySchema,
  bankAccount: z.string().min(1, "Bank account is required"),
  bonusEligible: z.boolean(),
});

export const EmployeeFormSchema = z.object({
  personal: PersonalInfoSchema,
  job: JobInfoSchema,
  compensation: CompensationInfoSchema,
});

export type EmployeeForm = z.infer<typeof EmployeeFormSchema>;
export type PersonalInfo = z.infer<typeof PersonalInfoSchema>;
export type JobInfo = z.infer<typeof JobInfoSchema>;
export type CompensationInfo = z.infer<typeof CompensationInfoSchema>;

export const DEPARTMENTS = [
  "Engineering",
  "Design",
  "Product",
  "Sales",
  "HR",
  "Finance",
  "Marketing",
] as const;

export const CURRENCIES = CurrencySchema.options;

export const StepSchema = z.object({
  id: z.number(),
  title: z.string(),
  subtitle: z.string(),
});

export const StepsSchema = z.array(StepSchema);

export type Step = z.infer<typeof StepSchema>;

export const STEPS: Step[] = [
  {
    id: 1,
    title: "Personal Information",
    subtitle: "Basic details & contact info",
  },
  {
    id: 2,
    title: "Job Information",
    subtitle: "Role, team & employment terms",
  },
  {
    id: 3,
    title: "Compensation",
    subtitle: "Salary, payroll & benefits",
  },
];

export const INITIAL_FORM: EmployeeForm = {
  personal: {
    firstName: "",
    lastName: "",
    email: "",
    personalEmail: "",
    phone: "",
    dateOfBirth: "",
    personalNumber: "",
    address: "",
    emergencyContact: "",
  },
  job: {
    jobTitle: "",
    department: "",
    team: "",
    manager: "",
    employmentType: "Full-time",
    startDate: "",
    endDate: "",
    workLocation: "Office",
  },
  compensation: {
    salaryAmount: "",
    salaryType: "Gross",
    currency: "EUR",
    paymentFrequency: "Monthly",
    bankAccount: "",
    bonusEligible: false,
  },
};