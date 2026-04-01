ALTER TABLE "public"."employee" ADD COLUMN "personal_email" varchar(256);
--> statement-breakpoint
UPDATE "public"."employee" SET "personal_email" = "email" WHERE "personal_email" IS NULL;
--> statement-breakpoint
CREATE UNIQUE INDEX "employee_personal_email_unique" ON "public"."employee" ("personal_email");

