export interface Account {
  id: string;
  name: string;
  current: number;
  projected: number;
  type?: string;
}

export interface Transaction {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  account: string;
  type: 'income' | 'expense';
  isFixed?: boolean; // Pour distinguer dépenses fixes/variables
}

export interface Transfer {
  id: string;
  date: string;
  amount: number;
  fromAccount: string;
  toAccount: string;
  description: string;
}

export interface Credit {
  id: string;
  name: string;
  totalAmount: number;
  monthlyPayment: number;
  remainingMonths: number;
  interestRate: number;
  account: string;
  startDate: string;
  endDate: string;
  remainingAmount: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  account: string;
}

export interface AppState {
  accounts: Account[];
  transactions: Transaction[];
  transfers: Transfer[];
  credits: Credit[];
  savings: SavingsGoal[];
  isConnectedToSheets: boolean;
  syncInProgress: boolean;
  lastSync?: string;
}

export interface GoogleSheetsConfig {
  spreadsheetId: string;
  apiKey?: string;
  clientId?: string;
  isAuthenticated: boolean;
}
