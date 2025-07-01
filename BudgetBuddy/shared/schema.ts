import { pgTable, text, serial, integer, boolean, varchar, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  current: decimal("current", { precision: 10, scale: 2 }).notNull().default('0'),
  projected: decimal("projected", { precision: 10, scale: 2 }).notNull().default('0'),
  type: varchar("type", { length: 50 }).default('Compte courant'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  date: varchar("date", { length: 10 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  description: text("description").notNull(),
  account: varchar("account", { length: 100 }).notNull(),
  type: varchar("type", { length: 10 }).notNull(), // 'income' | 'expense'
  isFixed: boolean("is_fixed").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transfers = pgTable("transfers", {
  id: serial("id").primaryKey(),
  date: varchar("date", { length: 10 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  fromAccount: varchar("from_account", { length: 100 }).notNull(),
  toAccount: varchar("to_account", { length: 100 }).notNull(),
  description: text("description").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const credits = pgTable("credits", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  monthlyPayment: decimal("monthly_payment", { precision: 10, scale: 2 }).notNull(),
  remainingMonths: integer("remaining_months").notNull(),
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }).notNull(),
  account: varchar("account", { length: 100 }).notNull(),
  startDate: varchar("start_date", { length: 10 }).notNull(),
  endDate: varchar("end_date", { length: 10 }).notNull(),
  remainingAmount: decimal("remaining_amount", { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const savings = pgTable("savings", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  targetAmount: decimal("target_amount", { precision: 10, scale: 2 }).notNull(),
  currentAmount: decimal("current_amount", { precision: 10, scale: 2 }).notNull().default('0'),
  targetDate: varchar("target_date", { length: 10 }).notNull(),
  account: varchar("account", { length: 100 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertAccountSchema = createInsertSchema(accounts).omit({
  id: true,
  createdAt: true,
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
});

export const insertTransferSchema = createInsertSchema(transfers).omit({
  id: true,
  createdAt: true,
});

export const insertCreditSchema = createInsertSchema(credits).omit({
  id: true,
  createdAt: true,
});

export const insertSavingsSchema = createInsertSchema(savings).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;
export type Transfer = typeof transfers.$inferSelect;
export type Credit = typeof credits.$inferSelect;
export type SavingsGoal = typeof savings.$inferSelect;

export type InsertAccount = z.infer<typeof insertAccountSchema>;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type InsertTransfer = z.infer<typeof insertTransferSchema>;
export type InsertCredit = z.infer<typeof insertCreditSchema>;
export type InsertSavingsGoal = z.infer<typeof insertSavingsSchema>;
