CREATE TYPE "public"."document_category" AS ENUM('contracts', 'health', 'additional', 'other');--> statement-breakpoint
CREATE TABLE "documents" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer NOT NULL,
	"name" varchar(256) NOT NULL,
	"type" varchar(64) NOT NULL,
	"size" varchar(64) NOT NULL,
	"url" varchar(1024) NOT NULL,
	"category" "document_category" NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE cascade ON UPDATE no action;