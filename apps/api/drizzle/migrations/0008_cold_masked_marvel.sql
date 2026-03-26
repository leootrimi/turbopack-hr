CREATE TYPE "public"."payment_source" AS ENUM('manual', 'upload', 'both');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'processed', 'error');--> statement-breakpoint
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
