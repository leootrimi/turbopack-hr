CREATE TYPE "public"."review_status" AS ENUM('draft', 'submitted');--> statement-breakpoint
CREATE TABLE "manager_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer NOT NULL,
	"manager_id" integer NOT NULL,
	"review_cycle_id" integer NOT NULL,
	"answers" jsonb NOT NULL,
	"submitted_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"status" "review_status" DEFAULT 'submitted' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "self_reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"employee_id" integer NOT NULL,
	"review_cycle_id" integer NOT NULL,
	"answers" jsonb NOT NULL,
	"submitted_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	"status" "review_status" DEFAULT 'submitted' NOT NULL
);
--> statement-breakpoint
ALTER TABLE "manager_reviews" ADD CONSTRAINT "manager_reviews_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manager_reviews" ADD CONSTRAINT "manager_reviews_manager_id_employee_id_fk" FOREIGN KEY ("manager_id") REFERENCES "public"."employee"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manager_reviews" ADD CONSTRAINT "manager_reviews_review_cycle_id_review_cycles_id_fk" FOREIGN KEY ("review_cycle_id") REFERENCES "public"."review_cycles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "self_reviews" ADD CONSTRAINT "self_reviews_employee_id_employee_id_fk" FOREIGN KEY ("employee_id") REFERENCES "public"."employee"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "self_reviews" ADD CONSTRAINT "self_reviews_review_cycle_id_review_cycles_id_fk" FOREIGN KEY ("review_cycle_id") REFERENCES "public"."review_cycles"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "manager_reviews_mgr_emp_cycle_idx" ON "manager_reviews" USING btree ("employee_id","manager_id","review_cycle_id");--> statement-breakpoint
CREATE UNIQUE INDEX "self_reviews_emp_cycle_idx" ON "self_reviews" USING btree ("employee_id","review_cycle_id");