# Dashboard Financier Personnel

## Overview

This is a full-stack financial dashboard application that integrates with Google Sheets for data persistence. The application allows users to manage their personal finances, including accounts, transactions, transfers, credits, and savings goals. It's built with React on the frontend and Express with Node.js on the backend, featuring a mobile-first responsive design.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Components**: Custom components built with Radix UI primitives and Tailwind CSS
- **State Management**: React Context API with useReducer for global state
- **Styling**: Tailwind CSS with custom design system (shadcn/ui)
- **Data Fetching**: TanStack Query for server state management
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js 20 with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: Drizzle ORM with PostgreSQL support (configured but not yet implemented)
- **Authentication**: Placeholder storage interface with in-memory implementation
- **API**: RESTful API structure with `/api` prefix

### Database Schema
The application uses Drizzle ORM with PostgreSQL dialect. Currently defined schemas include:
- **Users table**: Basic user authentication with username/password
- **Schema location**: `shared/schema.ts` for shared type definitions

## Key Components

### Data Management
- **Local Storage**: Browser localStorage for offline data persistence
- **Google Sheets Integration**: Two-way sync with Google Sheets API for cloud backup
- **Memory Storage**: In-memory fallback storage for development/testing

### User Interface
- **Mobile-First Design**: Responsive layout optimized for mobile devices
- **Component Library**: Comprehensive UI components using Radix UI and Tailwind
- **Navigation**: Bottom navigation bar for mobile-friendly experience
- **Form Handling**: React Hook Form with Zod validation

### Financial Features
- **Account Management**: Track multiple financial accounts with current/projected balances
- **Transaction Tracking**: Record income and expenses with categorization
- **Transfer Management**: Handle money transfers between accounts
- **Credit Monitoring**: Track loans and credit payments
- **Savings Goals**: Set and monitor savings targets

## Data Flow

1. **User Interaction**: User interacts with React components
2. **State Updates**: Actions are dispatched to React context reducer
3. **Local Persistence**: Data is automatically saved to localStorage
4. **Google Sheets Sync**: Optional two-way synchronization with Google Sheets
5. **Server Communication**: API calls to Express backend (when implemented)
6. **Database Operations**: Drizzle ORM handles database interactions

## External Dependencies

### Google Services
- **Google Sheets API**: For cloud data synchronization
- **Google Auth**: For user authentication and API access
- **API Keys**: Requires VITE_GOOGLE_API_KEY and VITE_GOOGLE_CLIENT_ID

### Third-Party Libraries
- **UI Components**: Radix UI primitives for accessible components
- **Styling**: Tailwind CSS for utility-first styling
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date manipulation
- **Currency Formatting**: Built-in Intl.NumberFormat for localization

### Development Tools
- **Drizzle Kit**: Database schema management and migrations
- **ESBuild**: Server-side bundling for production
- **Vite**: Frontend build tool and development server

## Deployment Strategy

### Development Environment
- **Hot Reload**: Vite dev server with HMR support
- **Database**: PostgreSQL 16 module configured in Replit
- **Environment**: Node.js 20 runtime environment

### Production Deployment
- **Build Process**: 
  1. Frontend: Vite builds React app to `dist/public`
  2. Backend: ESBuild bundles server to `dist/index.js`
- **Server**: Express serves static files and API routes
- **Database**: PostgreSQL with connection pooling
- **Deployment Target**: Replit autoscale deployment

### Configuration Files
- **Drizzle Config**: Database connection and migration settings
- **Vite Config**: Frontend build and development configuration
- **TypeScript**: Shared configuration for client/server/shared code

## Changelog

```
Changelog:
- June 27, 2025. Initial setup and conversion to static site
- June 27, 2025. Added Google Sheets integration with OAuth setup
- June 27, 2025. Implemented delete functionality with confirmation dialogs
- June 27, 2025. Enhanced error handling and user guidance for Google Cloud setup
- June 27, 2025. Abandoned Google Sheets integration due to OAuth complexity
- June 27, 2025. Implemented full PostgreSQL database integration with Drizzle ORM
- June 27, 2025. Created comprehensive expense management with fixed/variable categorization
- June 27, 2025. Built credit tracking system with detailed progress monitoring
- June 27, 2025. Developed savings goals with automatic transfer synchronization
- June 27, 2025. Established real-time account balance synchronization across all modules
```

## User Preferences

```
Preferred communication style: Simple, everyday language in French.
Data persistence: PostgreSQL database for universal access and reliability.
Account structure: Thomas (main + Livret A), Mélissa, Compte Joint.
Expense categorization: Fixed vs variable expenses with account separation.
Credit monitoring: Complete lifecycle tracking (start date, end date, remaining amount).
Savings integration: Synchronized with transfers for real-time progress tracking.
Synchronization: Perfect real-time balance updates across all transaction types.
```