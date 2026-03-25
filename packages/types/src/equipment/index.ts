import { z } from "zod";

export const EquipmentCategoryEnum = z.enum([
  "Laptop",
  "Monitor",
  "Phone",
  "Tablet",
  "Keyboard",
  "Mouse",
  "Headset",
  "Desk",
  "Chair",
  "Other",
]);

export const EquipmentConditionEnum = z.enum([
  "New",
  "Used",
  "Refurbished",
]);

export const EquipmentStatusEnum = z.enum([
  "Available",
  "Assigned",
  "Under Repair",
  "Retired",
]);

export const EquipmentLocationEnum = z.enum([
  "Office",
  "Remote",
  "Warehouse",
]);

export type EquipmentCategory = z.infer<typeof EquipmentCategoryEnum>;
export type EquipmentCondition = z.infer<typeof EquipmentConditionEnum>;
export type EquipmentStatus = z.infer<typeof EquipmentStatusEnum>;
export type EquipmentLocation = z.infer<typeof EquipmentLocationEnum>;

export const BasicInfoSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: EquipmentCategoryEnum.or(z.literal("")),
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  serialNumber: z.string().optional().default(""),
  assetTag: z.string().optional().default(""),
  description: z.string().optional().default(""),
});

export type BasicInfo = z.infer<typeof BasicInfoSchema>;


export const PurchaseInfoSchema = z.object({
  purchaseDate: z.string().optional().default(""),
  purchaseCost: z.string().optional().default(""),
  supplier: z.string().optional().default(""),
  warrantyExpiration: z.string().optional().default(""),
  condition: EquipmentConditionEnum,
  status: EquipmentStatusEnum,
});

export type PurchaseInfo = z.infer<typeof PurchaseInfoSchema>;

export const AssignmentInfoSchema = z.object({
  assignedTo: z.string().optional().default(""),
  assignmentDate: z.string().optional().default(""),
  returnDueDate: z.string().optional().default(""),
  location: EquipmentLocationEnum,
  notes: z.string().optional().default(""),
});

export type AssignmentInfo = z.infer<typeof AssignmentInfoSchema>;

export const EquipmentFormSchema = z.object({
  basic: BasicInfoSchema,
  purchase: PurchaseInfoSchema,
  assignment: AssignmentInfoSchema,
});

export type EquipmentForm = z.infer<typeof EquipmentFormSchema>;

export const INITIAL_EQUIPMENT_FORM: EquipmentForm = {
  basic: {
    name: "",
    category: "",
    brand: "",
    model: "",
    serialNumber: "",
    assetTag: "",
    description: "",
  },
  purchase: {
    purchaseDate: "",
    purchaseCost: "",
    supplier: "",
    warrantyExpiration: "",
    condition: "New",
    status: "Available",
  },
  assignment: {
    assignedTo: "",
    assignmentDate: "",
    returnDueDate: "",
    location: "Office",
    notes: "",
  },
};

export const StatusConfigSchema = z.record(
  EquipmentStatusEnum,
  z.object({
    bg: z.string(),
    text: z.string(),
    dot: z.string(),
  })
);

export const ConditionConfigSchema = z.record(
  EquipmentConditionEnum,
  z.object({
    bg: z.string(),
    text: z.string(),
  })
);

export const EquipmentRowSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: EquipmentCategoryEnum,
  brand: z.string(),
  model: z.string(),
  assetTag: z.string().nullable(),
  assignedTo: z.number().nullable(),
  status: z.string().nullable(),
  condition: z.string().nullable(),
});

export type EquipmentRow = z.infer<typeof EquipmentRowSchema>;

export const EquipmentDetailSchema = z.object({
  id: z.number(),
  name: z.string(),
  category: EquipmentCategoryEnum,
  brand: z.string(),
  model: z.string(),
  serialNumber: z.string().nullable(),
  assetTag: z.string().nullable(),
  description: z.string().nullable(),
  location: EquipmentLocationEnum,
  notes: z.string().nullable(),
  assignmentDate: z.union([z.date(), z.string()]).nullable(),
  returnDueDate: z.union([z.date(), z.string()]).nullable(),
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]),
  assignedTo: z.object({
    id: z.number(),
    name: z.string(),
    email: z.string(),
  }).nullable(),
  purchaseInfo: z.object({
    purchaseDate: z.union([z.date(), z.string()]).nullable(),
    purchaseCost: z.union([z.number(), z.string()]).nullable(),
    supplier: z.string().nullable(),
    warrantyExpiration: z.union([z.date(), z.string()]).nullable(),
    condition: EquipmentConditionEnum,
    status: EquipmentStatusEnum,
  }).nullable(),
});

export type EquipmentDetail = z.infer<typeof EquipmentDetailSchema>;