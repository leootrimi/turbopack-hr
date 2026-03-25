ALTER TABLE "time_off_balance" ALTER COLUMN "vacation_total" SET DATA TYPE numeric(4, 1);--> statement-breakpoint
ALTER TABLE "time_off_balance" ALTER COLUMN "vacation_total" SET DEFAULT '20.0';--> statement-breakpoint
ALTER TABLE "time_off_balance" ALTER COLUMN "vacation_used" SET DATA TYPE numeric(4, 1);--> statement-breakpoint
ALTER TABLE "time_off_balance" ALTER COLUMN "vacation_used" SET DEFAULT '0.0';--> statement-breakpoint
ALTER TABLE "time_off_balance" ALTER COLUMN "sick_total" SET DATA TYPE numeric(4, 1);--> statement-breakpoint
ALTER TABLE "time_off_balance" ALTER COLUMN "sick_total" SET DEFAULT '10.0';--> statement-breakpoint
ALTER TABLE "time_off_balance" ALTER COLUMN "sick_used" SET DATA TYPE numeric(4, 1);--> statement-breakpoint
ALTER TABLE "time_off_balance" ALTER COLUMN "sick_used" SET DEFAULT '0.0';--> statement-breakpoint
ALTER TABLE "time_off_balance" ALTER COLUMN "personal_total" SET DATA TYPE numeric(4, 1);--> statement-breakpoint
ALTER TABLE "time_off_balance" ALTER COLUMN "personal_total" SET DEFAULT '5.0';--> statement-breakpoint
ALTER TABLE "time_off_balance" ALTER COLUMN "personal_used" SET DATA TYPE numeric(4, 1);--> statement-breakpoint
ALTER TABLE "time_off_balance" ALTER COLUMN "personal_used" SET DEFAULT '0.0';