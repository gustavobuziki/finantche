import type { Recurrence, RecurrencePayload } from "@/types/recurrences";
import { supabase } from "@/utils/supabase";

export const createRecurrence = async (values: RecurrencePayload) => {
  const { error, data } = await supabase
    .from("recurrences")
    .insert(values)
    .select()
    .single();

  if (error) throw error;

  return data as Recurrence;
};

export const getRecurrences = async () => {
  const { data, error } = await supabase.from("recurrences").select("*");

  if (error) throw error;

  return data as Recurrence[];
};
