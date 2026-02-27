CREATE TYPE "public"."employment_type" AS ENUM('Full-time', 'Part-time', 'Contractor');--> statement-breakpoint
CREATE TYPE "public"."equipment_category" AS ENUM('Laptop', 'Monitor', 'Phone', 'Tablet', 'Keyboard', 'Mouse', 'Headset', 'Desk', 'Chair', 'Other');--> statement-breakpoint
CREATE TYPE "public"."equipment_condition" AS ENUM('New', 'Used', 'Refurbished');--> statement-breakpoint
CREATE TYPE "public"."equipment_location" AS ENUM('Office', 'Remote', 'Warehouse');--> statement-breakpoint
CREATE TYPE "public"."equipment_status" AS ENUM('Available', 'Assigned', 'Under Repair', 'Retired');--> statement-breakpoint
CREATE TYPE "public"."payment_frequency" AS ENUM('Monthly', 'Weekly');--> statement-breakpoint
CREATE TYPE "public"."salary_type" AS ENUM('Gross', 'Net');--> statement-breakpoint
CREATE TYPE "public"."work_location" AS ENUM('Office', 'Remote', 'Hybrid');--> statement-breakpoint
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
CREATE TABLE "employee" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" varchar(128) NOT NULL,
	"last_name" varchar(128) NOT NULL,
	"email" varchar(256) NOT NULL,
	"phone" varchar(32),
	"date_of_birth" timestamp,
	"personal_number" varchar(64),
	"address" varchar(512),
	"emergency_contact" varchar(256),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "employee_email_unique" UNIQUE("email"),
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
ALTER TABLE "checkin_logs" ADD CONSTRAINT "checkin_logs_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "compensation" ADD CONSTRAINT "compensation_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "equipment" ADD CONSTRAINT "equipment_assigned_to_employee_id_fk" FOREIGN KEY ("assigned_to") REFERENCES "public"."employee"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_info" ADD CONSTRAINT "job_info_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_info" ADD CONSTRAINT "job_info_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_info" ADD CONSTRAINT "job_info_manager_id_employee_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."employee"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "purchase_info" ADD CONSTRAINT "purchase_info_equipment_id_equipment_id_fk" FOREIGN KEY ("equipment_id") REFERENCES "public"."equipment"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" ADD CONSTRAINT "teams_leader_id_employee_id_fk" FOREIGN KEY ("leader_id") REFERENCES "public"."employee"("id") ON DELETE no action ON UPDATE no action;