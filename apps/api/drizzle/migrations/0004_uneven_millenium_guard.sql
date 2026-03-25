ALTER TABLE "leave_requests" ADD COLUMN "reviewed_by_id" integer;--> statement-breakpoint
ALTER TABLE "leave_requests" ADD COLUMN "manager_note" varchar(1024);--> statement-breakpoint
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_reviewed_by_id_employee_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."employee"("id") ON DELETE no action ON UPDATE no action;