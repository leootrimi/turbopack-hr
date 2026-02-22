import { z } from "zod";
export declare const EmploymentTypeSchema: z.ZodEnum<{
    "Full-time": "Full-time";
    "Part-time": "Part-time";
    Contractor: "Contractor";
}>;
export declare const WorkLocationSchema: z.ZodEnum<{
    Office: "Office";
    Remote: "Remote";
    Hybrid: "Hybrid";
}>;
export declare const SalaryTypeSchema: z.ZodEnum<{
    Gross: "Gross";
    Net: "Net";
}>;
export declare const PaymentFrequencySchema: z.ZodEnum<{
    Monthly: "Monthly";
    Weekly: "Weekly";
}>;
export declare const CurrencySchema: z.ZodEnum<{
    EUR: "EUR";
    USD: "USD";
    GBP: "GBP";
    RSD: "RSD";
    CHF: "CHF";
}>;
export declare const EmployeeRowSchema: z.ZodObject<{
    id: z.ZodNumber;
    fullName: z.ZodString;
    jobTitle: z.ZodString;
    department: z.ZodString;
}, z.core.$strip>;
export type EmployeeRow = z.infer<typeof EmployeeRowSchema>;
export declare const CreateEmployeeDtoSchema: z.ZodObject<{
    personal: z.ZodObject<{
        firstName: z.ZodString;
        lastName: z.ZodString;
        email: z.ZodString;
        phone: z.ZodString;
        dateOfBirth: z.ZodString;
        personalNumber: z.ZodString;
        address: z.ZodString;
        emergencyContact: z.ZodString;
    }, z.core.$strip>;
    job: z.ZodObject<{
        jobTitle: z.ZodString;
        department: z.ZodString;
        teamId: z.ZodNumber;
        managerId: z.ZodOptional<z.ZodNumber>;
        employmentType: z.ZodEnum<{
            "Full-time": "Full-time";
            "Part-time": "Part-time";
            Contractor: "Contractor";
        }>;
        startDate: z.ZodString;
        endDate: z.ZodOptional<z.ZodString>;
        workLocation: z.ZodEnum<{
            Office: "Office";
            Remote: "Remote";
            Hybrid: "Hybrid";
        }>;
    }, z.core.$strip>;
    compensation: z.ZodObject<{
        salaryAmount: z.ZodNumber;
        salaryType: z.ZodEnum<{
            Gross: "Gross";
            Net: "Net";
        }>;
        currency: z.ZodEnum<{
            EUR: "EUR";
            USD: "USD";
            GBP: "GBP";
            RSD: "RSD";
            CHF: "CHF";
        }>;
        paymentFrequency: z.ZodEnum<{
            Monthly: "Monthly";
            Weekly: "Weekly";
        }>;
        bankAccount: z.ZodString;
        bonusEligible: z.ZodBoolean;
    }, z.core.$strip>;
}, z.core.$strip>;
export type CreateEmployeeDto = z.infer<typeof CreateEmployeeDtoSchema>;
export declare const PersonalInfoSchema: z.ZodObject<{
    firstName: z.ZodString;
    lastName: z.ZodString;
    email: z.ZodString;
    phone: z.ZodString;
    dateOfBirth: z.ZodString;
    personalNumber: z.ZodString;
    address: z.ZodString;
    emergencyContact: z.ZodString;
}, z.core.$strip>;
export declare const JobInfoSchema: z.ZodObject<{
    jobTitle: z.ZodString;
    department: z.ZodString;
    team: z.ZodString;
    manager: z.ZodString;
    employmentType: z.ZodEnum<{
        "Full-time": "Full-time";
        "Part-time": "Part-time";
        Contractor: "Contractor";
    }>;
    startDate: z.ZodString;
    endDate: z.ZodString;
    workLocation: z.ZodEnum<{
        Office: "Office";
        Remote: "Remote";
        Hybrid: "Hybrid";
    }>;
}, z.core.$strip>;
export declare const CompensationInfoSchema: z.ZodObject<{
    salaryAmount: z.ZodString;
    salaryType: z.ZodEnum<{
        Gross: "Gross";
        Net: "Net";
    }>;
    currency: z.ZodEnum<{
        EUR: "EUR";
        USD: "USD";
        GBP: "GBP";
        RSD: "RSD";
        CHF: "CHF";
    }>;
    paymentFrequency: z.ZodEnum<{
        Monthly: "Monthly";
        Weekly: "Weekly";
    }>;
    bankAccount: z.ZodString;
    bonusEligible: z.ZodBoolean;
}, z.core.$strip>;
export declare const EmployeeFormSchema: z.ZodObject<{
    personal: z.ZodObject<{
        firstName: z.ZodString;
        lastName: z.ZodString;
        email: z.ZodString;
        phone: z.ZodString;
        dateOfBirth: z.ZodString;
        personalNumber: z.ZodString;
        address: z.ZodString;
        emergencyContact: z.ZodString;
    }, z.core.$strip>;
    job: z.ZodObject<{
        jobTitle: z.ZodString;
        department: z.ZodString;
        team: z.ZodString;
        manager: z.ZodString;
        employmentType: z.ZodEnum<{
            "Full-time": "Full-time";
            "Part-time": "Part-time";
            Contractor: "Contractor";
        }>;
        startDate: z.ZodString;
        endDate: z.ZodString;
        workLocation: z.ZodEnum<{
            Office: "Office";
            Remote: "Remote";
            Hybrid: "Hybrid";
        }>;
    }, z.core.$strip>;
    compensation: z.ZodObject<{
        salaryAmount: z.ZodString;
        salaryType: z.ZodEnum<{
            Gross: "Gross";
            Net: "Net";
        }>;
        currency: z.ZodEnum<{
            EUR: "EUR";
            USD: "USD";
            GBP: "GBP";
            RSD: "RSD";
            CHF: "CHF";
        }>;
        paymentFrequency: z.ZodEnum<{
            Monthly: "Monthly";
            Weekly: "Weekly";
        }>;
        bankAccount: z.ZodString;
        bonusEligible: z.ZodBoolean;
    }, z.core.$strip>;
}, z.core.$strip>;
export type EmployeeForm = z.infer<typeof EmployeeFormSchema>;
export type PersonalInfo = z.infer<typeof PersonalInfoSchema>;
export type JobInfo = z.infer<typeof JobInfoSchema>;
export type CompensationInfo = z.infer<typeof CompensationInfoSchema>;
export declare const DEPARTMENTS: readonly ["Engineering", "Design", "Product", "Sales", "HR", "Finance", "Marketing"];
export declare const CURRENCIES: ("EUR" | "USD" | "GBP" | "RSD" | "CHF")[];
export declare const StepSchema: z.ZodObject<{
    id: z.ZodNumber;
    title: z.ZodString;
    subtitle: z.ZodString;
}, z.core.$strip>;
export declare const StepsSchema: z.ZodArray<z.ZodObject<{
    id: z.ZodNumber;
    title: z.ZodString;
    subtitle: z.ZodString;
}, z.core.$strip>>;
export type Step = z.infer<typeof StepSchema>;
export declare const STEPS: Step[];
export declare const INITIAL_FORM: EmployeeForm;
//# sourceMappingURL=index.d.ts.map