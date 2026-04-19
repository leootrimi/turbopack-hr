import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  pgEnum,
  boolean,
  numeric,
  uniqueIndex,
  jsonb,
} from 'drizzle-orm/pg-core';

export const employee = pgTable('employee', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 128 }).notNull(),
  lastName: varchar('last_name', { length: 128 }).notNull(),
  email: varchar('email', { length: 256 }).notNull().unique(),
  // Email used for sending account/HR notifications (optional; falls back to `email`).
  personalEmail: varchar('personal_email', { length: 256 }).unique(),
  phone: varchar('phone', { length: 32 }),
  dateOfBirth: timestamp('date_of_birth'),
  personalNumber: varchar('personal_number', { length: 64 }).unique(),
  address: varchar('address', { length: 512 }),
  emergencyContact: varchar('emergency_contact', { length: 256 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const employmentTypeEnum = pgEnum('employment_type', [
  'Full-time',
  'Part-time',
  'Contractor',
]);

export const workLocationEnum = pgEnum('work_location', [
  'Office',
  'Remote',
  'Hybrid',
]);

export const jobInfo = pgTable('job_info', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id')
    .notNull()
    .references(() => employee.id, { onDelete: 'cascade' }),
  jobTitle: varchar('job_title', { length: 256 }).notNull(),
  department: varchar('department', { length: 256 }),
  teamId: integer('team_id').references(() => teams.id),
  managerId: integer('manager_id').references(() => employee.id),
  employmentType: employmentTypeEnum('employment_type'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  workLocation: workLocationEnum('work_location'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const salaryTypeEnum = pgEnum('salary_type', ['Gross', 'Net']);

export const paymentFrequencyEnum = pgEnum('payment_frequency', [
  'Monthly',
  'Weekly',
]);

export const compensation = pgTable('compensation', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id')
    .notNull()
    .references(() => employee.id, { onDelete: 'cascade' }),
  salaryAmount: integer('salary_amount'),
  salaryType: salaryTypeEnum('salary_type'),
  currency: varchar('currency', { length: 8 }),
  paymentFrequency: paymentFrequencyEnum('payment_frequency'),
  bankAccount: varchar('bank_account', { length: 128 }),
  bonusEligible: boolean('bonus_eligible').default(false),

  createdAt: timestamp('created_at').defaultNow(),
});

export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 256 }).notNull(),
  description: varchar('description', { length: 512 }),
  createdAt: timestamp('created_at').defaultNow(),
  leaderId: integer('leader_id').references(() => employee.id),
  team_type: varchar('team_type', { length: 128 }),
});

export const checkinLogs = pgTable('checkin_logs', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id')
    .notNull()
    .references(() => employee.id),
  checkinTime: timestamp('checkin_time').defaultNow(),
  checkoutTime: timestamp('checkout_time'),
});

export const equipmentConditionEnum = pgEnum('equipment_condition', [
  'New',
  'Used',
  'Refurbished',
]);

export const equipmentStatusEnum = pgEnum('equipment_status', [
  'Available',
  'Assigned',
  'Under Repair',
  'Retired',
]);

export const equipmentLocationEnum = pgEnum('equipment_location', [
  'Office',
  'Remote',
  'Warehouse',
]);

export const equipmentCategoryEnum = pgEnum('equipment_category', [
  'Laptop',
  'Monitor',
  'Phone',
  'Tablet',
  'Keyboard',
  'Mouse',
  'Headset',
  'Desk',
  'Chair',
  'Other',
]);

export const equipment = pgTable('equipment', {
  id: serial('id').primaryKey(),
  name: varchar('name').notNull(),
  category: equipmentCategoryEnum('category').notNull(),
  brand: varchar('brand').notNull(),
  model: varchar('model').notNull(),
  serialNumber: varchar('serial_number').default(''),
  assetTag: varchar('asset_tag').default(''),
  description: varchar('description').default(''),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
  assignedTo: integer('assigned_to').references(() => employee.id, {
    onDelete: 'cascade',
  }),
  location: equipmentLocationEnum('location').notNull(),
  notes: varchar('notes'),
  assignmentDate: timestamp('assignment_date'),
  returnDueDate: timestamp('return_due_date'),
});

export const purchaseInfo = pgTable('purchase_info', {
  id: serial('id').primaryKey(),
  equipmentId: integer('equipment_id')
    .notNull()
    .references(() => equipment.id, { onDelete: 'cascade' }),
  purchaseDate: timestamp('purchase_date'),
  purchaseCost: integer('purchase_cost'),
  supplier: varchar('supplier'),
  warrantyExpiration: timestamp('warranty_expiration'),
  condition: equipmentConditionEnum('condition').notNull(),
  status: equipmentStatusEnum('status').notNull(),
});

export const userRoleEnum = pgEnum('user_role', ['admin', 'hr', 'employee']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id')
    .notNull()
    .unique()
    .references(() => employee.id, { onDelete: 'cascade' }),
  email: varchar('email', { length: 256 }).notNull().unique(),
  passwordHash: varchar('password_hash', { length: 256 }),
  role: userRoleEnum('role').default('employee').notNull(),
  isActive: boolean('is_active').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const announcementTagEnum = pgEnum('announcement_tag', [
  'General',
  'Urgent',
  'HR',
  'IT',
  'Event',
]);

export const announcements = pgTable('announcements', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 256 }).notNull(),
  body: varchar('body', { length: 2048 }).notNull(),
  tag: announcementTagEnum('tag').notNull(),
  pinned: boolean('pinned').default(false).notNull(),
  authorId: integer('author_id')
    .notNull()
    .references(() => employee.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const leaveRequestStatusEnum = pgEnum('leave_request_status', [
  'Pending',
  'Approved',
  'Rejected',
]);

export const timeOffTypes = pgTable('time_off_types', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 128 }).notNull().unique(),
  defaultValue: numeric('default_value', { precision: 8, scale: 2 })
    .default('0')
    .notNull(),
  enabled: boolean('enabled').default(true).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const leaveRequests = pgTable('leave_requests', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id')
    .notNull()
    .references(() => employee.id, { onDelete: 'cascade' }),
  type: varchar('type', { length: 128 }).notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  days: numeric('days', { precision: 4, scale: 1 }).notNull(),
  reason: varchar('reason', { length: 1024 }),
  status: leaveRequestStatusEnum('status').default('Pending').notNull(),
  attachmentName: varchar('attachment_name', { length: 256 }),
  reviewedById: integer('reviewed_by_id').references(() => employee.id),
  managerNote: varchar('manager_note', { length: 1024 }),
  createdAt: timestamp('created_at').defaultNow(),
});

export const timeOffBalance = pgTable('time_off_balance', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id')
    .notNull()
    .references(() => employee.id, { onDelete: 'cascade' }),
  timeOffTypeId: integer('time_off_type_id')
    .notNull()
    .references(() => timeOffTypes.id, { onDelete: 'cascade' }),
  total: numeric('total', { precision: 8, scale: 2 })
    .default('0.0')
    .notNull(),
  used: numeric('used', { precision: 8, scale: 2 })
    .default('0.0')
    .notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({
  employeeTimeOffTypeUnique: uniqueIndex('time_off_balance_emp_type_idx').on(
    t.employeeId,
    t.timeOffTypeId,
  ),
}));

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'processed',
  'error',
]);
export const paymentSourceEnum = pgEnum('payment_source', [
  'manual',
  'upload',
  'both',
]);

export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  amount: numeric('amount', { precision: 12, scale: 2 }).notNull(),
  date: timestamp('date').notNull(),
  vendor: varchar('vendor', { length: 256 }).notNull(),
  category: varchar('category', { length: 256 }).notNull(),
  description: varchar('description', { length: 1024 }),
  documentName: varchar('document_name', { length: 256 }),
  documentUrl: varchar('document_url', { length: 1024 }),
  source: paymentSourceEnum('source').notNull(),
  status: paymentStatusEnum('status').default('pending').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const documentCategoryEnum = pgEnum('document_category', [
  'contracts',
  'health',
  'additional',
  'other',
]);

export const jobStatusEnum = pgEnum('job_status', ['Open', 'Closed', 'Draft']);
export const jobTypeEnum = pgEnum('job_type', [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
]);
export const jobLocationTypeEnum = pgEnum('job_location_type', [
  'On-site',
  'Remote',
  'Hybrid',
]);

export const jobs = pgTable('jobs', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 256 }).notNull(),
  department: varchar('department', { length: 256 }).notNull(),
  location: varchar('location', { length: 256 }).notNull(),
  locationType: jobLocationTypeEnum('location_type').notNull(),
  type: jobTypeEnum('type').notNull(),
  salary: varchar('salary', { length: 256 }).default('').notNull(),
  status: jobStatusEnum('status').default('Open').notNull(),
  description: varchar('description', { length: 4096 }).notNull(),
  responsibilities: varchar('responsibilities', { length: 1024 })
    .array()
    .default([])
    .notNull(),
  requirements: varchar('requirements', { length: 1024 })
    .array()
    .default([])
    .notNull(),
  niceToHave: varchar('nice_to_have', { length: 1024 })
    .array()
    .default([])
    .notNull(),
  applicants: integer('applicants').default(0).notNull(),
  postedAt: timestamp('posted_at').defaultNow().notNull(),
  closedAt: timestamp('closed_at'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const documents = pgTable('documents', {
  id: serial('id').primaryKey(),
  employeeId: integer('employee_id')
    .notNull()
    .references(() => employee.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 256 }).notNull(),
  type: varchar('type', { length: 64 }).notNull(),
  size: varchar('size', { length: 64 }).notNull(),
  url: varchar('url', { length: 1024 }).notNull(),
  category: documentCategoryEnum('category').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

/** Scheduled = active; canceled = explicitly canceled. Completed/upcoming are derived from time + scheduled. */
export const meetingStatusEnum = pgEnum('meeting_status', ['scheduled', 'canceled']);

export const meetings = pgTable('meetings', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 512 }).notNull(),
  description: varchar('description', { length: 4096 }),
  /** Employee who created the meeting (always included as a participant row). */
  organizerId: integer('organizer_id')
    .notNull()
    .references(() => employee.id, { onDelete: 'cascade' }),
  startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
  durationMinutes: integer('duration_minutes').notNull().default(30),
  timezone: varchar('timezone', { length: 64 }).default('UTC').notNull(),
  status: meetingStatusEnum('status').default('scheduled').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const meetingParticipants = pgTable(
  'meeting_participants',
  {
    id: serial('id').primaryKey(),
    meetingId: integer('meeting_id')
      .notNull()
      .references(() => meetings.id, { onDelete: 'cascade' }),
    employeeId: integer('employee_id')
      .notNull()
      .references(() => employee.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow(),
  },
  (t) => ({
    meetingEmployeeUnique: uniqueIndex('meeting_participants_meeting_employee_unique').on(
      t.meetingId,
      t.employeeId,
    ),
  }),
);

export const applicationStageEnum = pgEnum('application_stage', [
  'Applied',
  'Screening',
  'Interview',
  'Offer',
  'Hired',
  'Rejected'
]);

export const jobApplications = pgTable('job_applications', {
  id: serial('id').primaryKey(),
  jobId: integer('job_id').references(() => jobs.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 256 }).notNull(),
  email: varchar('email', { length: 256 }).notNull(),
  phone: varchar('phone', { length: 64 }),
  location: varchar('location', { length: 256 }),
  cvUrl: varchar('cv_url', { length: 1024 }),
  notes: varchar('notes', { length: 2048 }),
  stage: applicationStageEnum('stage').default('Applied').notNull(),
  appliedDate: timestamp('applied_date').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const applicationTimelines = pgTable('application_timelines', {
  id: serial('id').primaryKey(),
  applicationId: integer('application_id')
    .notNull()
    .references(() => jobApplications.id, { onDelete: 'cascade' }),
  action: varchar('action', { length: 256 }).notNull(),
  date: timestamp('date').defaultNow().notNull(),
});

/** Custom prompts for self / manager overview sections (stored as JSON arrays). */
export type ReviewCycleQuestionJson = {
  id: string;
  label: string;
  prompt: string;
  placeholder?: string;
  tip?: string;
};

export const reviewCycles = pgTable('review_cycles', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 256 }).notNull(),
  description: varchar('description', { length: 1024 }),
  enabled: boolean('enabled').default(false).notNull(),
  startDate: timestamp('start_date'),
  endDate: timestamp('end_date'),
  /** Employee self-reflection form sections */
  selfReviewQuestions: jsonb('self_review_questions').$type<ReviewCycleQuestionJson[] | null>(),
  /** Manager written overview sections (excludes competency matrix) */
  managerReviewQuestions: jsonb('manager_review_questions').$type<ReviewCycleQuestionJson[] | null>(),
  createdById: integer('created_by_id').references(() => employee.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const reviewStatusEnum = pgEnum('review_status', ['draft', 'submitted']);

export const selfReviews = pgTable(
  'self_reviews',
  {
    id: serial('id').primaryKey(),
    employeeId: integer('employee_id')
      .notNull()
      .references(() => employee.id, { onDelete: 'cascade' }),
    reviewCycleId: integer('review_cycle_id')
      .notNull()
      .references(() => reviewCycles.id, { onDelete: 'cascade' }),
    answers: jsonb('answers').notNull(),
    submittedAt: timestamp('submitted_at').defaultNow(),
    updatedAt: timestamp('updated_at'),
    status: reviewStatusEnum('status').default('submitted').notNull(),
  },
  (t) => ({
    employeeCycleUnique: uniqueIndex('self_reviews_emp_cycle_idx').on(t.employeeId, t.reviewCycleId),
  }),
);

export const managerReviews = pgTable(
  'manager_reviews',
  {
    id: serial('id').primaryKey(),
    employeeId: integer('employee_id')
      .notNull()
      .references(() => employee.id, { onDelete: 'cascade' }),
    managerId: integer('manager_id')
      .notNull()
      .references(() => employee.id, { onDelete: 'cascade' }),
    reviewCycleId: integer('review_cycle_id')
      .notNull()
      .references(() => reviewCycles.id, { onDelete: 'cascade' }),
    answers: jsonb('answers').notNull(),
    submittedAt: timestamp('submitted_at').defaultNow(),
    updatedAt: timestamp('updated_at'),
    status: reviewStatusEnum('status').default('submitted').notNull(),
  },
  (t) => ({
    managerEmpCycleUnique: uniqueIndex('manager_reviews_mgr_emp_cycle_idx').on(
      t.employeeId,
      t.managerId,
      t.reviewCycleId,
    ),
  }),
);
