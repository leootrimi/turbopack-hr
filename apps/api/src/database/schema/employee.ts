import { pgTable, serial, varchar, timestamp } from "drizzle-orm/pg-core";

export const employee = pgTable("employee", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  email: varchar("email", { length: 256 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
});