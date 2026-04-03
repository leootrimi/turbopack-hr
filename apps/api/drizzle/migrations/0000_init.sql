CREATE TYPE "public"."announcement_tag" AS ENUM('General', 'Urgent', 'HR', 'IT', 'Event');--> statement-breakpoint
CREATE TYPE "public"."document_category" AS ENUM('contracts', 'health', 'additional', 'other');--> statement-breakpoint
CREATE TYPE "public"."employment_type" AS ENUM('Full-time', 'Part-time', 'Contractor');--> statement-breakpoint
CREATE TYPE "public"."equipment_category" AS ENUM('Laptop', 'Monitor', 'Phone', 'Tablet', 'Keyboard', 'Mouse', 'Headset', 'Desk', 'Chair', 'Other');--> statement-breakpoint
CREATE TYPE "public"."equipment_condition" AS ENUM('New', 'Used', 'Refurbished');--> statement-breakpoint
CREATE TYPE "public"."equipment_location" AS ENUM('Office', 'Remote', 'Warehouse');--> statement-breakpoint
CREATE TYPE "public"."equipment_status" AS ENUM('Available', 'Assigned', 'Under Repair', 'Retired');--> statement-breakpoint
CREATE TYPE "public"."job_location_type" AS ENUM('On-site', 'Remote', 'Hybrid');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('Open', 'Closed', 'Draft');--> statement-breakpoint
CREATE TYPE "public"."job_type" AS ENUM('Full-time', 'Part-time', 'Contract', 'Internship');--> statement-breakpoint
CREATE TYPE "public"."leave_request_status" AS ENUM('Pending', 'Approved', 'Rejected');--> statement-breakpoint
CREATE TYPE "public"."meeting_status" AS ENUM('scheduled', 'canceled');--> statement-breakpoint
CREATE TYPE "public"."payment_frequency" AS ENUM('Monthly', 'Weekly');--> statement-breakpoint
CREATE TYPE "public"."payment_source" AS ENUM('manual', 'upload', 'both');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'processed', 'error');--> statement-breakpoint
CREATE TYPE "public"."salary_type" AS ENUM('Gross', 'Net');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('admin', 'hr', 'employee');--> statement-breakpoint
CREATE TYPE "public"."work_location" AS ENUM('Office', 'Remote', 'Hybrid');--> statement-breakpoint
CREATE TABLE "announcements" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"body" varchar(2048) NOT NULL,
	"tag" "announcement_tag" NOT NULL,
	"pinned" boolean DEFAULT false NOT NULL,
	"author_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "checkin_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer NOT NULL,
	"checkin_time" timestamp DEFAULT now(),
	"checkout_time" timestamp
);
--> statement-breakpoint
CREATE TABLE "compensation" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer NOT NULL,
	"salary_amount" integer,
	"salary_type" "salary_type",
	"currency" varchar(8),
	"payment_frequency" "payment_frequency",
	"bank_account" varchar(128),
	"bonus_eligible" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer NOT NULL,
	"name" varchar(256) NOT NULL,
	"type" varchar(64) NOT NULL,
	"size" varchar(64) NOT NULL,
	"url" varchar(1024) NOT NULL,
	"category" "document_category" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "employee" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(128) NOT NULL,
	"last_name" varchar(128) NOT NULL,
	"email" varchar(256) NOT NULL,
	"personal_email" varchar(256),
	"phone" varchar(32),
	"date_of_birth" timestamp,
	"personal_number" varchar(64),
	"address" varchar(512),
	"emergency_contact" varchar(256),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "employee_email_unique" UNIQUE("email"),
	CONSTRAINT "employee_personal_email_unique" UNIQUE("personal_email"),
	CONSTRAINT "employee_personal_number_unique" UNIQUE("personal_number")
);
--> statement-breakpoint
CREATE TABLE "equipment" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"category" "equipment_category" NOT NULL,
	"brand" varchar NOT NULL,
	"model" varchar NOT NULL,
	"serial_number" varchar DEFAULT '',
	"asset_tag" varchar DEFAULT '',
	"description" varchar DEFAULT '',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"assigned_to" integer,
	"location" "equipment_location" NOT NULL,
	"notes" varchar,
	"assignment_date" timestamp,
	"return_due_date" timestamp
);
--> statement-breakpoint
CREATE TABLE "job_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer NOT NULL,
	"job_title" varchar(256) NOT NULL,
	"department" varchar(256),
	"team_id" integer,
	"manager_id" integer,
	"employment_type" "employment_type" NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp,
	"work_location" "work_location" NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"department" varchar(256) NOT NULL,
	"location" varchar(256) NOT NULL,
	"location_type" "job_location_type" NOT NULL,
	"type" "job_type" NOT NULL,
	"salary" varchar(256) DEFAULT '' NOT NULL,
	"status" "job_status" DEFAULT 'Open' NOT NULL,
	"description" varchar(4096) NOT NULL,
	"responsibilities" varchar(1024)[] DEFAULT '{}' NOT NULL,
	"requirements" varchar(1024)[] DEFAULT '{}' NOT NULL,
	"nice_to_have" varchar(1024)[] DEFAULT '{}' NOT NULL,
	"applicants" integer DEFAULT 0 NOT NULL,
	"posted_at" timestamp DEFAULT now() NOT NULL,
	"closed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "leave_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer NOT NULL,
	"type" varchar(128) NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"days" numeric(4, 1) NOT NULL,
	"reason" varchar(1024),
	"status" "leave_request_status" DEFAULT 'Pending' NOT NULL,
	"attachment_name" varchar(256),
	"reviewed_by_id" integer,
	"manager_note" varchar(1024),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "meeting_participants" (
	"id" serial PRIMARY KEY NOT NULL,
	"meeting_id" integer NOT NULL,
	"employee_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "meetings" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(512) NOT NULL,
	"description" varchar(4096),
	"organizer_id" integer NOT NULL,
	"starts_at" timestamp with time zone NOT NULL,
	"duration_minutes" integer DEFAULT 30 NOT NULL,
	"timezone" varchar(64) DEFAULT 'UTC' NOT NULL,
	"status" "meeting_status" DEFAULT 'scheduled' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" serial PRIMARY KEY NOT NULL,
	"amount" numeric(12, 2) NOT NULL,
	"date" timestamp NOT NULL,
	"vendor" varchar(256) NOT NULL,
	"category" varchar(256) NOT NULL,
	"description" varchar(1024),
	"document_name" varchar(256),
	"document_url" varchar(1024),
	"source" "payment_source" NOT NULL,
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "purchase_info" (
	"id" serial PRIMARY KEY NOT NULL,
	"equipment_id" integer NOT NULL,
	"purchase_date" timestamp,
	"purchase_cost" integer,
	"supplier" varchar,
	"warranty_expiration" timestamp,
	"condition" "equipment_condition" NOT NULL,
	"status" "equipment_status" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" varchar(512),
	"created_at" timestamp DEFAULT now(),
	"leader_id" integer,
	"team_type" varchar(128)
);
--> statement-breakpoint
CREATE TABLE "time_off_balance" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer NOT NULL,
	"time_off_type_id" integer NOT NULL,
	"total" numeric(8, 2) DEFAULT '0.0' NOT NULL,
	"used" numeric(8, 2) DEFAULT '0.0' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "time_off_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(128) NOT NULL,
	"default_value" numeric(8, 2) DEFAULT '0' NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "time_off_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer NOT NULL,
	"email" varchar(256) NOT NULL,
	"password_hash" varchar(256),
	"role" "user_role" DEFAULT 'employee' NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_employee_id_unique" UNIQUE("employee_id"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_author_id_employee_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."employee"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "checkin_logs" ADD CONSTRAINT "checkin_logs_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compensation" ADD CONSTRAINT "compensation_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_assigned_to_employee_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."employee"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_info" ADD CONSTRAINT "job_info_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_info" ADD CONSTRAINT "job_info_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_info" ADD CONSTRAINT "job_info_manager_id_employee_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."employee"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_reviewed_by_id_employee_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."employee"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meeting_participants" ADD CONSTRAINT "meeting_participants_meeting_id_meetings_id_fk" FOREIGN KEY ("meeting_id") REFERENCES "public"."meetings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meeting_participants" ADD CONSTRAINT "meeting_participants_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "meetings" ADD CONSTRAINT "meetings_organizer_id_employee_id_fk" FOREIGN KEY ("organizer_id") REFERENCES "public"."employee"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_info" ADD CONSTRAINT "purchase_info_equipment_id_equipment_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_leader_id_employee_id_fk" FOREIGN KEY ("leader_id") REFERENCES "public"."employee"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_off_balance" ADD CONSTRAINT "time_off_balance_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "time_off_balance" ADD CONSTRAINT "time_off_balance_time_off_type_id_time_off_types_id_fk" FOREIGN KEY ("time_off_type_id") REFERENCES "public"."time_off_types"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "meeting_participants_meeting_employee_unique" ON "meeting_participants" USING btree ("meeting_id","employee_id");--> statement-breakpoint
CREATE UNIQUE INDEX "time_off_balance_emp_type_idx" ON "time_off_balance" USING btree ("employee_id","time_off_type_id");