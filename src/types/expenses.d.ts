export type FormDataExpenses = {
  description: string;
  amount: number;
  month: number;
  year: number;
  category_id: string;
  is_recurring: boolean;
  recurrence_id?: string;
};

export type ExpensesPayload = {
  description: string;
  amount: number;
  date: string;
  category_id?: string;
  reccurence_id?: string;
};

export type Expenses = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category_id?: string;
  is_recurring: boolean;
  recurrence_id?: string;
  user_id: string;
  created_at: string;
};

export type ExpensesChart = {
  date: string;
  amount: number;
};
