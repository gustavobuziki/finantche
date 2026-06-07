import type { Category, FormDataCategory } from "@/types/categories";
import { supabase } from "@/utils/supabase";

export const createCategory = async (values: FormDataCategory) => {
  const { error, data } = await supabase
    .from("categories")
    .insert(values)
    .select()
    .single();

  if (error) throw error;

  return data as Category;
};

export const getCategories = async () => {
  const { error, data } = await supabase.from("categories").select("*");

  if (error) throw error;

  return data as Category[];
};

export const deleteCategory = async (id: string) => {
  const { error, data } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data as Category;
};
