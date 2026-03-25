CREATE TABLE "time_off_balance" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer NOT NULL,
	"vacation_total" integer DEFAULT 20 NOT NULL,
	"vacation_used" integer DEFAULT 0 NOT NULL,
	"sick_total" integer DEFAULT 10 NOT NULL,
	"sick_used" integer DEFAULT 0 NOT NULL,
	"personal_total" integer DEFAULT 5 NOT NULL,
	"personal_used" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "time_off_balance_employee_id_unique" UNIQUE("employee_id")
);
--> statement-breakpoint
ALTER TABLE "time_off_balance" ADD CONSTRAINT "time_off_balance_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE cascade ON UPDATE no action;