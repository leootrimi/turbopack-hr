import {
  pgTable,
  serial,
  varchar,
  timestamp,
  integer,
  pgEnum,
  boolean,
} from 'drizzle-orm/pg-core';

export const employee = pgTable('employee', {
  id: serial('id').primaryKey(),
  firstName: varchar('first_name', { length: 128 }).notNull(),
  lastName: varchar('last_name', { length: 128 }).notNull(),
  email: varchar('email', { length: 256 }).notNull().unique(),
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
  employmentType: employmentTypeEnum('employment_type').notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date'),
  workLocation: workLocationEnum('work_location').notNull(),
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
