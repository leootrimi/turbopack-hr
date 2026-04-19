CREATE TABLE "review_cycles" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" varchar(1024),
	"enabled" boolean DEFAULT false NOT NULL,
	"start_date" timestamp,
	"end_date" timestamp,
	"self_review_questions" jsonb,
	"manager_review_questions" jsonb,
	"created_by_id" integer,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "review_cycles" ADD CONSTRAINT "review_cycles_created_by_id_employee_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."employee"("id") ON DELETE set null ON UPDATE no action;