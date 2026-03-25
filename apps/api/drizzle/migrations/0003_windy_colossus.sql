CREATE TYPE "public"."leave_request_status" AS ENUM('Pending', 'Approved', 'Rejected');--> statement-breakpoint
CREATE TYPE "public"."leave_type" AS ENUM('Vacation', 'Work From Home', 'Sick Leave', 'Marriage', 'Bereavement', 'Unpaid');--> statement-breakpoint
CREATE TABLE "leave_requests" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer NOT NULL,
	"type" "leave_type" NOT NULL,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"days" numeric(4, 1) NOT NULL,
	"reason" varchar(1024),
	"status" "leave_request_status" DEFAULT 'Pending' NOT NULL,
	"attachment_name" varchar(256),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE cascade ON UPDATE no action;