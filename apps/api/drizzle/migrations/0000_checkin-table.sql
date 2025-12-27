CREATE TABLE "checkin_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" serial NOT NULL,
	"checkin_time" timestamp DEFAULT now(),
	"checkout_time" timestamp
);
--> statement-breakpoint
CREATE TABLE "employee" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "employee_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "checkin_logs" ADD CONSTRAINT "checkin_logs_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE no action ON UPDATE no action;