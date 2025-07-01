import { Account, Transaction, Transfer, Credit, SavingsGoal } from "../types";

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}

export class GoogleSheetsService {
  private static instance: GoogleSheetsService;
  private spreadsheetId = "1ZKmwCB2Zxl3WWKUlWd6B5YUs0zCkb_5BWkQNNPgA3EA";
  private apiKey = import.meta.env.VITE_GOOGLE_API_KEY || "";
  private clientId =
    import.meta.env.VITE_GOOGLE_CLIENT_ID ||
    "123086634685-qsnpaosq3o3q5jompoq06n7o3ro81hkl.apps.googleusercontent.com";
  private discoveryDoc =
    "https://sheets.googleapis.com/$discovery/rest?version=v4";
  private scopes = "https://www.googleapis.com/auth/spreadsheets";
  private isInitialized = false;
  private isAuthenticated = false;

  static getInstance(): GoogleSheetsService {
    if (!GoogleSheetsService.instance) {
      GoogleSheetsService.instance = new GoogleSheetsService();
    }
    return GoogleSheetsService.instance;
  }

  async initialize(): Promise<boolean> {
    try {
      if (this.isInitialized) return true;

      // Check if API keys are provided
      if (!this.apiKey || !this.clientId) {
        console.log(
          "Google API keys not configured - Google Sheets integration disabled",
        );
        this.isInitialized = true; // Prevent repeated initialization attempts
        return false;
      }

      if (!window.gapi) {
        console.error("Google API not loaded");
        this.isInitialized = true; // Prevent repeated initialization attempts
        return false;
      }

      await new Promise<void>((resolve, reject) => {
        window.gapi.load("client:auth2", () => {
          resolve();
        });
      });

      await window.gapi.client.init({
        apiKey: this.apiKey,
        clientId: this.clientId,
        discoveryDocs: [this.discoveryDoc],
        scope: this.scopes,
      });

      this.isInitialized = true;
      this.isAuthenticated = window.gapi.auth2
        .getAuthInstance()
        .isSignedIn.get();

      return true;
    } catch (error) {
      console.error("Failed to initialize Google Sheets API:", error);
      this.isInitialized = true; // Prevent repeated initialization attempts
      return false;
    }
  }

  async authenticate(): Promise<boolean> {
    try {
      if (!this.isInitialized) {
        const initialized = await this.initialize();
        if (!initialized) return false;
      }

      const authInstance = window.gapi.auth2.getAuthInstance();

      if (!authInstance.isSignedIn.get()) {
        await authInstance.signIn();
      }

      this.isAuthenticated = authInstance.isSignedIn.get();
      return this.isAuthenticated;
    } catch (error) {
      console.error("Authentication failed:", error);
      return false;
    }
  }

  async disconnect(): Promise<boolean> {
    try {
      if (this.isAuthenticated) {
        const authInstance = window.gapi.auth2.getAuthInstance();
        await authInstance.signOut();
        this.isAuthenticated = false;
      }
      return true;
    } catch (error) {
      console.error("Failed to disconnect:", error);
      return false;
    }
  }

  async readSheet(range: string): Promise<any[][]> {
    try {
      if (!this.isAuthenticated) {
        throw new Error("Not authenticated");
      }

      const response = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: this.spreadsheetId,
        range: range,
      });

      return response.result.values || [];
    } catch (error) {
      console.error("Failed to read sheet:", error);
      throw error;
    }
  }

  async writeSheet(range: string, values: any[][]): Promise<boolean> {
    try {
      if (!this.isAuthenticated) {
        throw new Error("Not authenticated");
      }

      await window.gapi.client.sheets.spreadsheets.values.update({
        spreadsheetId: this.spreadsheetId,
        range: range,
        valueInputOption: "USER_ENTERED",
        resource: {
          values: values,
        },
      });

      return true;
    } catch (error) {
      console.error("Failed to write to sheet:", error);
      throw error;
    }
  }

  async clearSheet(range: string): Promise<boolean> {
    try {
      if (!this.isAuthenticated) {
        throw new Error("Not authenticated");
      }

      await window.gapi.client.sheets.spreadsheets.values.clear({
        spreadsheetId: this.spreadsheetId,
        range: range,
      });

      return true;
    } catch (error) {
      console.error("Failed to clear sheet:", error);
      throw error;
    }
  }

  async syncAccounts(accounts: Account[]): Promise<boolean> {
    try {
      const headers = ["ID", "Nom", "Solde Actuel", "Solde Prévu", "Type"];
      const data = accounts.map((account) => [
        account.id,
        account.name,
        account.current,
        account.projected,
        account.type || "",
      ]);

      await this.clearSheet("Comptes!A:E");
      await this.writeSheet("Comptes!A1:E" + (data.length + 1), [
        headers,
        ...data,
      ]);
      return true;
    } catch (error) {
      console.error("Failed to sync accounts:", error);
      return false;
    }
  }

  async syncTransactions(transactions: Transaction[]): Promise<boolean> {
    try {
      const headers = [
        "ID",
        "Date",
        "Montant",
        "Catégorie",
        "Description",
        "Compte",
        "Type",
      ];
      const data = transactions.map((transaction) => [
        transaction.id,
        transaction.date,
        transaction.amount,
        transaction.category,
        transaction.description,
        transaction.account,
        transaction.type,
      ]);

      await this.clearSheet("Transactions!A:G");
      await this.writeSheet("Transactions!A1:G" + (data.length + 1), [
        headers,
        ...data,
      ]);
      return true;
    } catch (error) {
      console.error("Failed to sync transactions:", error);
      return false;
    }
  }

  async syncTransfers(transfers: Transfer[]): Promise<boolean> {
    try {
      const headers = [
        "ID",
        "Date",
        "Montant",
        "Compte Source",
        "Compte Destination",
        "Description",
      ];
      const data = transfers.map((transfer) => [
        transfer.id,
        transfer.date,
        transfer.amount,
        transfer.fromAccount,
        transfer.toAccount,
        transfer.description,
      ]);

      await this.clearSheet("Virements!A:F");
      await this.writeSheet("Virements!A1:F" + (data.length + 1), [
        headers,
        ...data,
      ]);
      return true;
    } catch (error) {
      console.error("Failed to sync transfers:", error);
      return false;
    }
  }

  async syncCredits(credits: Credit[]): Promise<boolean> {
    try {
      const headers = [
        "ID",
        "Nom",
        "Montant Total",
        "Mensualité",
        "Mois Restants",
        "Taux",
        "Compte",
      ];
      const data = credits.map((credit) => [
        credit.id,
        credit.name,
        credit.totalAmount,
        credit.monthlyPayment,
        credit.remainingMonths,
        credit.interestRate,
        credit.account,
      ]);

      await this.clearSheet("Crédits!A:G");
      await this.writeSheet("Crédits!A1:G" + (data.length + 1), [
        headers,
        ...data,
      ]);
      return true;
    } catch (error) {
      console.error("Failed to sync credits:", error);
      return false;
    }
  }

  async syncSavings(savings: SavingsGoal[]): Promise<boolean> {
    try {
      const headers = [
        "ID",
        "Nom",
        "Objectif",
        "Montant Actuel",
        "Date Cible",
        "Compte",
      ];
      const data = savings.map((goal) => [
        goal.id,
        goal.name,
        goal.targetAmount,
        goal.currentAmount,
        goal.targetDate,
        goal.account,
      ]);

      await this.clearSheet("Épargnes!A:F");
      await this.writeSheet("Épargnes!A1:F" + (data.length + 1), [
        headers,
        ...data,
      ]);
      return true;
    } catch (error) {
      console.error("Failed to sync savings:", error);
      return false;
    }
  }

  async readAccounts(): Promise<Account[]> {
    try {
      const data = await this.readSheet("Comptes!A2:E");
      return data.map((row) => ({
        id: row[0] || "",
        name: row[1] || "",
        current: parseFloat(row[2]) || 0,
        projected: parseFloat(row[3]) || 0,
        type: row[4] || "",
      }));
    } catch (error) {
      console.error("Failed to read accounts:", error);
      return [];
    }
  }

  async readTransactions(): Promise<Transaction[]> {
    try {
      const data = await this.readSheet("Transactions!A2:G");
      return data.map((row) => ({
        id: row[0] || "",
        date: row[1] || "",
        amount: parseFloat(row[2]) || 0,
        category: row[3] || "",
        description: row[4] || "",
        account: row[5] || "",
        type: (row[6] as "income" | "expense") || "expense",
      }));
    } catch (error) {
      console.error("Failed to read transactions:", error);
      return [];
    }
  }

  isConnected(): boolean {
    return this.isAuthenticated;
  }
}
