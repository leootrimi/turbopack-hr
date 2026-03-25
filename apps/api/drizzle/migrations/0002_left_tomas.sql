CREATE TYPE "public"."announcement_tag" AS ENUM('General', 'Urgent', 'HR', 'IT', 'Event');--> statement-breakpoint
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
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_author_id_employee_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."employee"("id") ON DELETE cascade ON UPDATE no action;