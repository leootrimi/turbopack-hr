CREATE TYPE "public"."application_stage" AS ENUM('Applied', 'Screening', 'Interview', 'Offer', 'Hired', 'Rejected');--> statement-breakpoint
CREATE TABLE "application_timelines" (
	"id" serial PRIMARY KEY NOT NULL,
	"application_id" integer NOT NULL,
	"action" varchar(256) NOT NULL,
	"date" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_applications" (
	"id" serial PRIMARY KEY NOT NULL,
	"job_id" integer,
	"name" varchar(256) NOT NULL,
	"email" varchar(256) NOT NULL,
	"phone" varchar(64),
	"location" varchar(256),
	"cv_url" varchar(1024),
	"notes" varchar(2048),
	"stage" "application_stage" DEFAULT 'Applied' NOT NULL,
	"applied_date" timestamp DEFAULT now() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "application_timelines" ADD CONSTRAINT "application_timelines_application_id_job_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."job_applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;