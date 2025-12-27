import { pgTable, serial, varchar, timestamp, integer } from "drizzle-orm/pg-core";

export const employee = pgTable("employee", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  work_email: varchar("work_email", { length: 256 }).unique(),
  address: varchar("address", { length: 512 }),
  phone: varchar("phone", { length: 32 }),
  work_phone: varchar("work_phone", { length: 32 }),
  birthday: timestamp("birthday"),
  teamId: integer("team_id").references(() => teams.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const teams = pgTable("teams", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  description: varchar("description", { length: 512 }),
  createdAt: timestamp("created_at").defaultNow(),
  leaderId: integer("leader_id").references(() => employee.id),
  team_type: varchar("team_type", { length: 128 }),
});

export const checkinLogs = pgTable("checkin_logs", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id")
    .notNull()
    .references(() => employee.id),
  checkinTime: timestamp("checkin_time").defaultNow(),
  checkoutTime: timestamp("checkout_time"),
});