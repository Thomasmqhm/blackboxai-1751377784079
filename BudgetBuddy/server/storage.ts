import { users, accounts, transactions, transfers, credits, savings, type User, type InsertUser, type Account, type InsertAccount, type Transaction, type InsertTransaction, type Transfer, type InsertTransfer, type Credit, type InsertCredit, type SavingsGoal, type InsertSavingsGoal } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Accounts
  getAllAccounts(): Promise<Account[]>;
  createAccount(account: InsertAccount): Promise<Account>;
  deleteAccount(id: number): Promise<void>;
  updateAccountBalance(name: string, current: number, projected: number): Promise<void>;
  
  // Transactions
  getAllTransactions(): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  deleteTransaction(id: number): Promise<void>;
  
  // Transfers
  getAllTransfers(): Promise<Transfer[]>;
  createTransfer(transfer: InsertTransfer): Promise<Transfer>;
  deleteTransfer(id: number): Promise<void>;
  
  // Credits
  getAllCredits(): Promise<Credit[]>;
  createCredit(credit: InsertCredit): Promise<Credit>;
  deleteCredit(id: number): Promise<void>;
  
  // Savings
  getAllSavings(): Promise<SavingsGoal[]>;
  createSavingsGoal(savings: InsertSavingsGoal): Promise<SavingsGoal>;
  deleteSavingsGoal(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // Accounts
  async getAllAccounts(): Promise<Account[]> {
    return await db.select().from(accounts);
  }

  async createAccount(account: InsertAccount): Promise<Account> {
    const [newAccount] = await db
      .insert(accounts)
      .values(account)
      .returning();
    return newAccount;
  }

  async deleteAccount(id: number): Promise<void> {
    await db.delete(accounts).where(eq(accounts.id, id));
  }

  async updateAccountBalance(name: string, current: number, projected: number): Promise<void> {
    await db
      .update(accounts)
      .set({ current: current.toString(), projected: projected.toString() })
      .where(eq(accounts.name, name));
  }

  // Transactions
  async getAllTransactions(): Promise<Transaction[]> {
    return await db.select().from(transactions);
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db
      .insert(transactions)
      .values(transaction)
      .returning();
    return newTransaction;
  }

  async deleteTransaction(id: number): Promise<void> {
    await db.delete(transactions).where(eq(transactions.id, id));
  }

  // Transfers
  async getAllTransfers(): Promise<Transfer[]> {
    return await db.select().from(transfers);
  }

  async createTransfer(transfer: InsertTransfer): Promise<Transfer> {
    const [newTransfer] = await db
      .insert(transfers)
      .values(transfer)
      .returning();
    return newTransfer;
  }

  async deleteTransfer(id: number): Promise<void> {
    await db.delete(transfers).where(eq(transfers.id, id));
  }

  // Credits
  async getAllCredits(): Promise<Credit[]> {
    return await db.select().from(credits);
  }

  async createCredit(credit: InsertCredit): Promise<Credit> {
    const [newCredit] = await db
      .insert(credits)
      .values(credit)
      .returning();
    return newCredit;
  }

  async deleteCredit(id: number): Promise<void> {
    await db.delete(credits).where(eq(credits.id, id));
  }

  // Savings
  async getAllSavings(): Promise<SavingsGoal[]> {
    return await db.select().from(savings);
  }

  async createSavingsGoal(savingsGoal: InsertSavingsGoal): Promise<SavingsGoal> {
    const [newSavings] = await db
      .insert(savings)
      .values(savingsGoal)
      .returning();
    return newSavings;
  }

  async deleteSavingsGoal(id: number): Promise<void> {
    await db.delete(savings).where(eq(savings.id, id));
  }
}

export const storage = new DatabaseStorage();
