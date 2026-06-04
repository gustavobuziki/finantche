import type { Expenses, FormDataExpenses } from "@/types/expenses";
import { getMonthRange } from "@/utils/date";
import { supabase } from "@/utils/supabase";

export const createExpense = async (values: FormDataExpenses) => {
  const { error, data } = await supabase
    .from("expenses")
    .insert(values)
    .select()
    .single();

  if (error) throw error;

  return data as Expenses;
};

export const getExpenses = async () => {
  const { error, data } = await supabase.from("expenses").select("*");

  if (error) throw error;

  return data as Expenses[];
};

export const getExpensesByMonth = async (year: number, month: number) => {
  const { startDate, endDate } = getMonthRange(year, month);

  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .gte("date", startDate)
    .lt("date", endDate);

  if (error) throw error;

  return data as Expenses[];
};
