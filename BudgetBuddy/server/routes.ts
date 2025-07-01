import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAccountSchema, insertTransactionSchema, insertTransferSchema, insertCreditSchema, insertSavingsSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  const httpServer = createServer(app);

  // Financial data endpoints
  app.get("/api/accounts", async (req, res) => {
    try {
      const accounts = await storage.getAllAccounts();
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch accounts" });
    }
  });

  app.post("/api/accounts", async (req, res) => {
    try {
      const validatedData = insertAccountSchema.parse(req.body);
      const account = await storage.createAccount(validatedData);
      res.json(account);
    } catch (error) {
      res.status(400).json({ error: "Invalid account data" });
    }
  });

  app.delete("/api/accounts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteAccount(id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete account" });
    }
  });

  app.get("/api/transactions", async (req, res) => {
    try {
      const transactions = await storage.getAllTransactions();
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(validatedData);
      
      // Update account balance
      const amount = validatedData.type === 'income' ? parseFloat(validatedData.amount) : -parseFloat(validatedData.amount);
      const accounts = await storage.getAllAccounts();
      const account = accounts.find(a => a.name === validatedData.account);
      
      if (account) {
        const newCurrent = parseFloat(account.current) + amount;
        const newProjected = parseFloat(account.projected) + amount;
        await storage.updateAccountBalance(account.name, newCurrent, newProjected);
      }
      
      res.json(transaction);
    } catch (error) {
      res.status(400).json({ error: "Invalid transaction data" });
    }
  });

  app.delete("/api/transactions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Get transaction details before deletion for balance update
      const transactions = await storage.getAllTransactions();
      const transaction = transactions.find(t => t.id === id);
      
      if (transaction) {
        await storage.deleteTransaction(id);
        
        // Reverse the balance update
        const amount = transaction.type === 'income' ? -parseFloat(transaction.amount) : parseFloat(transaction.amount);
        const accounts = await storage.getAllAccounts();
        const account = accounts.find(a => a.name === transaction.account);
        
        if (account) {
          const newCurrent = parseFloat(account.current) + amount;
          const newProjected = parseFloat(account.projected) + amount;
          await storage.updateAccountBalance(account.name, newCurrent, newProjected);
        }
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete transaction" });
    }
  });

  app.get("/api/transfers", async (req, res) => {
    try {
      const transfers = await storage.getAllTransfers();
      res.json(transfers);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transfers" });
    }
  });

  app.post("/api/transfers", async (req, res) => {
    try {
      const validatedData = insertTransferSchema.parse(req.body);
      const transfer = await storage.createTransfer(validatedData);
      
      // Update both account balances
      const accounts = await storage.getAllAccounts();
      const fromAccount = accounts.find(a => a.name === validatedData.fromAccount);
      const toAccount = accounts.find(a => a.name === validatedData.toAccount);
      const transferAmount = parseFloat(validatedData.amount);
      
      if (fromAccount) {
        const newCurrent = parseFloat(fromAccount.current) - transferAmount;
        const newProjected = parseFloat(fromAccount.projected) - transferAmount;
        await storage.updateAccountBalance(fromAccount.name, newCurrent, newProjected);
      }
      
      if (toAccount) {
        const newCurrent = parseFloat(toAccount.current) + transferAmount;
        const newProjected = parseFloat(toAccount.projected) + transferAmount;
        await storage.updateAccountBalance(toAccount.name, newCurrent, newProjected);
      }
      
      res.json(transfer);
    } catch (error) {
      res.status(400).json({ error: "Invalid transfer data" });
    }
  });

  app.delete("/api/transfers/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Get transfer details before deletion for balance update
      const transfers = await storage.getAllTransfers();
      const transfer = transfers.find(t => t.id === id);
      
      if (transfer) {
        await storage.deleteTransfer(id);
        
        // Reverse the balance updates
        const accounts = await storage.getAllAccounts();
        const fromAccount = accounts.find(a => a.name === transfer.fromAccount);
        const toAccount = accounts.find(a => a.name === transfer.toAccount);
        const transferAmount = parseFloat(transfer.amount);
        
        if (fromAccount) {
          const newCurrent = parseFloat(fromAccount.current) + transferAmount;
          const newProjected = parseFloat(fromAccount.projected) + transferAmount;
          await storage.updateAccountBalance(fromAccount.name, newCurrent, newProjected);
        }
        
        if (toAccount) {
          const newCurrent = parseFloat(toAccount.current) - transferAmount;
          const newProjected = parseFloat(toAccount.projected) - transferAmount;
          await storage.updateAccountBalance(toAccount.name, newCurrent, newProjected);
        }
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete transfer" });
    }
  });

  app.get("/api/credits", async (req, res) => {
    try {
      const credits = await storage.getAllCredits();
      res.json(credits);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch credits" });
    }
  });

  app.post("/api/credits", async (req, res) => {
    try {
      const validatedData = insertCreditSchema.parse(req.body);
      const credit = await storage.createCredit(validatedData);
      
      // Update account balance with credit amount
      const accounts = await storage.getAllAccounts();
      const account = accounts.find(a => a.name === validatedData.account);
      
      if (account) {
        const creditAmount = parseFloat(validatedData.totalAmount);
        const newCurrent = parseFloat(account.current) + creditAmount;
        const newProjected = parseFloat(account.projected) + creditAmount;
        await storage.updateAccountBalance(account.name, newCurrent, newProjected);
      }
      
      res.json(credit);
    } catch (error) {
      res.status(400).json({ error: "Invalid credit data" });
    }
  });

  app.delete("/api/credits/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Get credit details before deletion for balance update
      const credits = await storage.getAllCredits();
      const credit = credits.find(c => c.id === id);
      
      if (credit) {
        await storage.deleteCredit(id);
        
        // Reverse the balance update
        const accounts = await storage.getAllAccounts();
        const account = accounts.find(a => a.name === credit.account);
        
        if (account) {
          const creditAmount = parseFloat(credit.totalAmount);
          const newCurrent = parseFloat(account.current) - creditAmount;
          const newProjected = parseFloat(account.projected) - creditAmount;
          await storage.updateAccountBalance(account.name, newCurrent, newProjected);
        }
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete credit" });
    }
  });

  app.get("/api/savings", async (req, res) => {
    try {
      const savings = await storage.getAllSavings();
      res.json(savings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch savings" });
    }
  });

  app.post("/api/savings", async (req, res) => {
    try {
      const validatedData = insertSavingsSchema.parse(req.body);
      const savingsGoal = await storage.createSavingsGoal(validatedData);
      
      // Update account balance by removing the current amount
      const accounts = await storage.getAllAccounts();
      const account = accounts.find(a => a.name === validatedData.account);
      
      if (account && validatedData.currentAmount) {
        const currentAmount = parseFloat(validatedData.currentAmount);
        const newCurrent = parseFloat(account.current) - currentAmount;
        const newProjected = parseFloat(account.projected) - currentAmount;
        await storage.updateAccountBalance(account.name, newCurrent, newProjected);
      }
      
      res.json(savingsGoal);
    } catch (error) {
      res.status(400).json({ error: "Invalid savings goal data" });
    }
  });

  app.delete("/api/savings/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      
      // Get savings details before deletion for balance update
      const savings = await storage.getAllSavings();
      const savingsGoal = savings.find(s => s.id === id);
      
      if (savingsGoal) {
        await storage.deleteSavingsGoal(id);
        
        // Return the current amount to the account
        const accounts = await storage.getAllAccounts();
        const account = accounts.find(a => a.name === savingsGoal.account);
        
        if (account) {
          const currentAmount = parseFloat(savingsGoal.currentAmount);
          const newCurrent = parseFloat(account.current) + currentAmount;
          const newProjected = parseFloat(account.projected) + currentAmount;
          await storage.updateAccountBalance(account.name, newCurrent, newProjected);
        }
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete savings goal" });
    }
  });

  // Initialize database with default accounts if empty
  app.post("/api/init", async (req, res) => {
    try {
      const accounts = await storage.getAllAccounts();
      
      if (accounts.length === 0) {
        const defaultAccounts = [
          { name: 'Thomas', current: '2500', projected: '2500', type: 'Compte courant' },
          { name: 'Thomas Livret A', current: '5000', projected: '5000', type: 'Livret A' },
          { name: 'Mélissa', current: '1800', projected: '1800', type: 'Compte courant' },
          { name: 'Compte Joint', current: '3200', projected: '3200', type: 'Compte joint' }
        ];
        
        for (const account of defaultAccounts) {
          await storage.createAccount(account);
        }
      }
      
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to initialize database" });
    }
  });

  return httpServer;
}