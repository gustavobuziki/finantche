import type { Expenses, FormDataExpenses } from "@/types/expenses";
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
