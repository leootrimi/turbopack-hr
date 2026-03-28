CREATE TABLE "time_off_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(128) NOT NULL,
	"default_value" numeric(8, 2) DEFAULT '0' NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "time_off_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
INSERT INTO "time_off_types" ("name", "default_value", "enabled") VALUES
('Vacation', 20, true),
('Work From Home', 0, true),
('Sick Leave', 10, true),
('Personal Day', 5, true),
('Marriage', 3, true),
('Bereavement', 3, true),
('Unpaid', 0, true)
ON CONFLICT ("name") DO NOTHING;
--> statement-breakpoint
ALTER TABLE "leave_requests" ALTER COLUMN "type" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "leave_requests" ALTER COLUMN "type" TYPE varchar(128) USING ("type"::text);
--> statement-breakpoint
DROP TYPE "public"."leave_type";
