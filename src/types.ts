export interface Transaction {
  date: Date;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
}

export interface CategorySummary {
  category: string;
  total: number;
  percentage: number;
}

export interface MonthlyAnalysis {
  month: string;
  income: number;
  expenses: number;
  savings: number;
}