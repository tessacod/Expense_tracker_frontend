// src/app/models/expense.model.ts
export interface Expense {
    _id?: string;        // Optional since it's assigned by MongoDB
    userId: string;      // Instead of mongoose ObjectId, use string
    category: string;    // Use TypeScript types (lowercase)
    amount: number;      // Use TypeScript types (lowercase)
    date: Date;         // Date can stay as is
    description?: string; // Optional field with TypeScript types
}