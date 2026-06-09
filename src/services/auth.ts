import { supabase } from "@/utils/supabase";

export const postRegister = async (
  name: string,
  email: string,
  password: string,
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
      emailRedirectTo: `${window.location.origin}/confirm-account`,
    },
  });

  if (error) throw error;

  return data;
};

export const postLogin = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
};

export const postLogout = async () => {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
};
