CREATE TABLE "teams" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(256) NOT NULL,
	"description" varchar(512),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "checkin_logs" ALTER COLUMN "employee_id" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "employee" ADD COLUMN "work_email" varchar(256);--> statement-breakpoint
ALTER TABLE "employee" ADD COLUMN "address" varchar(512);--> statement-breakpoint
ALTER TABLE "employee" ADD COLUMN "phone" varchar(32);--> statement-breakpoint
ALTER TABLE "employee" ADD COLUMN "work_phone" varchar(32);--> statement-breakpoint
ALTER TABLE "employee" ADD COLUMN "birthday" timestamp;--> statement-breakpoint
ALTER TABLE "employee" ADD COLUMN "team_id" integer;--> statement-breakpoint
ALTER TABLE "employee" ADD CONSTRAINT "employee_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "employee" ADD CONSTRAINT "employee_work_email_unique" UNIQUE("work_email");