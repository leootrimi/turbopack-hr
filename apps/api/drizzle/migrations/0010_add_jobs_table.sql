CREATE TYPE "public"."job_location_type" AS ENUM('On-site', 'Remote', 'Hybrid');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('Open', 'Closed', 'Draft');--> statement-breakpoint
CREATE TYPE "public"."job_type" AS ENUM('Full-time', 'Part-time', 'Contract', 'Internship');--> statement-breakpoint
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
