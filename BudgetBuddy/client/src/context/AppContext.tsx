import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, Transaction, Transfer, Credit, SavingsGoal, Account } from '../types';
import { LocalStorage } from '../services/storage';

interface AppContextType {
  state: AppState;
  addAccount: (account: Omit<Account, 'id'>) => void;
  deleteAccount: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  addTransfer: (transfer: Omit<Transfer, 'id'>) => void;
  addCredit: (credit: Omit<Credit, 'id'>) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  deleteTransfer: (id: string) => void;
  deleteCredit: (id: string) => void;
  deleteSavingsGoal: (id: string) => void;
  updateSyncStatus: (status: boolean) => void;
  updateConnectionStatus: (status: boolean) => void;
  clearAllData: () => void;
  loadData: (data: Partial<AppState>) => void;
}

type AppAction =
  | { type: 'ADD_ACCOUNT'; payload: Account }
  | { type: 'DELETE_ACCOUNT'; payload: string }
  | { type: 'ADD_TRANSACTION'; payload: Transaction }
  | { type: 'ADD_TRANSFER'; payload: Transfer }
  | { type: 'ADD_CREDIT'; payload: Credit }
  | { type: 'ADD_SAVINGS_GOAL'; payload: SavingsGoal }
  | { type: 'DELETE_TRANSACTION'; payload: string }
  | { type: 'DELETE_TRANSFER'; payload: string }
  | { type: 'DELETE_CREDIT'; payload: string }
  | { type: 'DELETE_SAVINGS_GOAL'; payload: string }
  | { type: 'UPDATE_SYNC_STATUS'; payload: boolean }
  | { type: 'UPDATE_CONNECTION_STATUS'; payload: boolean }
  | { type: 'CLEAR_ALL_DATA' }
  | { type: 'LOAD_DATA'; payload: Partial<AppState> }
  | { type: 'LOAD_INITIAL_DATA'; payload: AppState };

const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const initialState: AppState = {
  accounts: [
    {
      id: '1',
      name: 'Thomas',
      current: 2500,
      projected: 2500,
      type: 'Compte courant'
    },
    {
      id: '2',
      name: 'Thomas Livret A',
      current: 5000,
      projected: 5000,
      type: 'Livret A'
    },
    {
      id: '3',
      name: 'Mélissa',
      current: 1800,
      projected: 1800,
      type: 'Compte courant'
    },
    {
      id: '4',
      name: 'Compte Joint',
      current: 3200,
      projected: 3200,
      type: 'Compte joint'
    }
  ],
  transactions: [],
  transfers: [],
  credits: [],
  savings: [
    {
      id: '1',
      name: 'Livret A Thomas',
      targetAmount: 5000,
      currentAmount: 0,
      targetDate: new Date(new Date().getFullYear() + 1, 11, 31).toISOString().split('T')[0],
      account: 'Thomas'
    }
  ],
  isConnectedToSheets: false,
  syncInProgress: false
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOAD_INITIAL_DATA':
      return action.payload;

    case 'ADD_ACCOUNT':
      return {
        ...state,
        accounts: [action.payload, ...state.accounts]
      };

    case 'DELETE_ACCOUNT':
      return {
        ...state,
        accounts: state.accounts.filter(account => account.id !== action.payload)
      };

    case 'ADD_TRANSACTION':
      const updatedAccountsAfterTransaction = state.accounts.map(account => {
        if (account.name === action.payload.account) {
          const amount = action.payload.type === 'income' ? action.payload.amount : -action.payload.amount;
          return {
            ...account,
            current: account.current + amount,
            projected: account.projected + amount
          };
        }
        return account;
      });
      
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
        accounts: updatedAccountsAfterTransaction
      };

    case 'ADD_TRANSFER':
      const updatedAccountsAfterTransfer = state.accounts.map(account => {
        if (account.name === action.payload.fromAccount) {
          return {
            ...account,
            current: account.current - action.payload.amount,
            projected: account.projected - action.payload.amount
          };
        }
        if (account.name === action.payload.toAccount) {
          return {
            ...account,
            current: account.current + action.payload.amount,
            projected: account.projected + action.payload.amount
          };
        }
        return account;
      });
      
      return {
        ...state,
        transfers: [action.payload, ...state.transfers],
        accounts: updatedAccountsAfterTransfer
      };

    case 'ADD_CREDIT':
      const updatedAccountsAfterCredit = state.accounts.map(account => {
        if (account.name === action.payload.account) {
          return {
            ...account,
            current: account.current + action.payload.totalAmount,
            projected: account.projected + action.payload.totalAmount
          };
        }
        return account;
      });
      
      return {
        ...state,
        credits: [action.payload, ...state.credits],
        accounts: updatedAccountsAfterCredit
      };

    case 'ADD_SAVINGS_GOAL':
      const updatedAccountsAfterSavings = state.accounts.map(account => {
        if (account.name === action.payload.account) {
          return {
            ...account,
            current: account.current - action.payload.currentAmount,
            projected: account.projected - action.payload.currentAmount
          };
        }
        return account;
      });
      
      return {
        ...state,
        savings: [action.payload, ...state.savings],
        accounts: updatedAccountsAfterSavings
      };

    case 'DELETE_TRANSACTION':
      const transactionToDelete = state.transactions.find(t => t.id === action.payload);
      let accountsAfterTransactionDelete = state.accounts;
      
      if (transactionToDelete) {
        accountsAfterTransactionDelete = state.accounts.map(account => {
          if (account.name === transactionToDelete.account) {
            // Inverse de l'opération originale
            const amount = transactionToDelete.type === 'income' ? -transactionToDelete.amount : transactionToDelete.amount;
            return {
              ...account,
              current: account.current + amount,
              projected: account.projected + amount
            };
          }
          return account;
        });
      }
      
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
        accounts: accountsAfterTransactionDelete
      };

    case 'DELETE_TRANSFER':
      const transferToDelete = state.transfers.find(t => t.id === action.payload);
      let accountsAfterTransferDelete = state.accounts;
      
      if (transferToDelete) {
        accountsAfterTransferDelete = state.accounts.map(account => {
          if (account.name === transferToDelete.fromAccount) {
            // Restaurer l'argent dans le compte source
            return {
              ...account,
              current: account.current + transferToDelete.amount,
              projected: account.projected + transferToDelete.amount
            };
          }
          if (account.name === transferToDelete.toAccount) {
            // Retirer l'argent du compte destination
            return {
              ...account,
              current: account.current - transferToDelete.amount,
              projected: account.projected - transferToDelete.amount
            };
          }
          return account;
        });
      }
      
      return {
        ...state,
        transfers: state.transfers.filter(t => t.id !== action.payload),
        accounts: accountsAfterTransferDelete
      };

    case 'DELETE_CREDIT':
      const creditToDelete = state.credits.find(c => c.id === action.payload);
      let accountsAfterCreditDelete = state.accounts;
      
      if (creditToDelete) {
        accountsAfterCreditDelete = state.accounts.map(account => {
          if (account.name === creditToDelete.account) {
            // Retirer le montant du crédit qui avait été ajouté
            return {
              ...account,
              current: account.current - creditToDelete.totalAmount,
              projected: account.projected - creditToDelete.totalAmount
            };
          }
          return account;
        });
      }
      
      return {
        ...state,
        credits: state.credits.filter(c => c.id !== action.payload),
        accounts: accountsAfterCreditDelete
      };

    case 'DELETE_SAVINGS_GOAL':
      const savingsToDelete = state.savings.find(s => s.id === action.payload);
      let accountsAfterSavingsDelete = state.accounts;
      
      if (savingsToDelete) {
        accountsAfterSavingsDelete = state.accounts.map(account => {
          if (account.name === savingsToDelete.account) {
            // Remettre l'argent dans le compte principal
            return {
              ...account,
              current: account.current + savingsToDelete.currentAmount,
              projected: account.projected + savingsToDelete.currentAmount
            };
          }
          return account;
        });
      }
      
      return {
        ...state,
        savings: state.savings.filter(s => s.id !== action.payload),
        accounts: accountsAfterSavingsDelete
      };

    case 'UPDATE_SYNC_STATUS':
      return {
        ...state,
        syncInProgress: action.payload
      };

    case 'UPDATE_CONNECTION_STATUS':
      return {
        ...state,
        isConnectedToSheets: action.payload
      };

    case 'CLEAR_ALL_DATA':
      return {
        ...initialState,
        isConnectedToSheets: state.isConnectedToSheets
      };

    case 'LOAD_DATA':
      return {
        ...state,
        ...action.payload
      };

    default:
      return state;
  }
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const savedData = LocalStorage.load();
    dispatch({ type: 'LOAD_INITIAL_DATA', payload: savedData });
  }, []);

  useEffect(() => {
    LocalStorage.save(state);
  }, [state]);

  const addAccount = (accountData: Omit<Account, 'id'>) => {
    const account: Account = {
      ...accountData,
      id: generateId()
    };
    dispatch({ type: 'ADD_ACCOUNT', payload: account });
  };

  const addTransaction = (transactionData: Omit<Transaction, 'id'>) => {
    const transaction: Transaction = {
      ...transactionData,
      id: generateId()
    };
    dispatch({ type: 'ADD_TRANSACTION', payload: transaction });
  };

  const addTransfer = (transferData: Omit<Transfer, 'id'>) => {
    const transfer: Transfer = {
      ...transferData,
      id: generateId()
    };
    dispatch({ type: 'ADD_TRANSFER', payload: transfer });
  };

  const addCredit = (creditData: Omit<Credit, 'id'>) => {
    const credit: Credit = {
      ...creditData,
      id: generateId()
    };
    dispatch({ type: 'ADD_CREDIT', payload: credit });
  };

  const addSavingsGoal = (goalData: Omit<SavingsGoal, 'id'>) => {
    const goal: SavingsGoal = {
      ...goalData,
      id: generateId()
    };
    dispatch({ type: 'ADD_SAVINGS_GOAL', payload: goal });
  };

  const deleteTransaction = (id: string) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  const deleteTransfer = (id: string) => {
    dispatch({ type: 'DELETE_TRANSFER', payload: id });
  };

  const deleteCredit = (id: string) => {
    dispatch({ type: 'DELETE_CREDIT', payload: id });
  };

  const deleteSavingsGoal = (id: string) => {
    dispatch({ type: 'DELETE_SAVINGS_GOAL', payload: id });
  };

  const updateSyncStatus = (status: boolean) => {
    dispatch({ type: 'UPDATE_SYNC_STATUS', payload: status });
  };

  const updateConnectionStatus = (status: boolean) => {
    dispatch({ type: 'UPDATE_CONNECTION_STATUS', payload: status });
  };

  const clearAllData = () => {
    dispatch({ type: 'CLEAR_ALL_DATA' });
    LocalStorage.clear();
  };

  const loadData = (data: Partial<AppState>) => {
    dispatch({ type: 'LOAD_DATA', payload: data });
  };

  const deleteAccount = (id: string) => {
    dispatch({ type: 'DELETE_ACCOUNT', payload: id });
  };

  return (
    <AppContext.Provider value={{
      state,
      addAccount,
      deleteAccount,
      addTransaction,
      addTransfer,
      addCredit,
      addSavingsGoal,
      deleteTransaction,
      deleteTransfer,
      deleteCredit,
      deleteSavingsGoal,
      updateSyncStatus,
      updateConnectionStatus,
      clearAllData,
      loadData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
