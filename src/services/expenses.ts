import type {
  Expenses,
  ExpensesChart,
  ExpensesPayload,
} from "@/types/expenses";
import { getDateLast12Months, getMonthRange } from "@/utils/date";
import { supabase } from "@/utils/supabase";

export const createExpense = async (values: ExpensesPayload) => {
  const { error, data } = await supabase
    .from("expenses")
    .insert(values)
    .select()
    .single();

  if (error) throw error;

  return data as Expenses;
};

export const getExpensesByMonth = async (date: Date) => {
  const { startDate, endDate } = getMonthRange(date);

  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .gte("date", startDate)
    .lt("date", endDate);

  if (error) throw error;

  return data as Expenses[];
};

export const getExpensesTotalByMonth = async (date: Date) => {
  const { startDate, endDate } = getMonthRange(date);

  const { data, error } = await supabase
    .from("expenses")
    .select("amount")
    .gte("date", startDate)
    .lt("date", endDate);

  if (error) throw error;

  return data.reduce((total, expense) => {
    return total + Number(expense.amount);
  }, 0);
};

export const getBiggestExpenseByMonth = async (date: Date) => {
  const { startDate, endDate } = getMonthRange(date);

  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .gte("date", startDate)
    .lt("date", endDate)
    .order("amount", { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }

  return data as Expenses;
};

export const getLast12MonthsExpensesTotal = async (date: Date) => {
  const { startDate, endDate } = getDateLast12Months(date);

  const { data, error } = await supabase
    .from("expenses")
    .select("amount, date")
    .gte("date", startDate)
    .lte("date", endDate);

  if (error) throw error;

  return data as ExpensesChart[];
};
