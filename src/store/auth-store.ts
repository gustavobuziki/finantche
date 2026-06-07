import { supabase } from "@/utils/supabase";
import type { Session } from "@supabase/supabase-js";
import { create } from "zustand";

type AuthStore = {
  session: Session | null;
  setSession: (session: Session | null) => void;
  isLoadingAuth: boolean;
  setIsLoadingAuth: (isLoading: boolean) => void;
  initializeAuth: () => Promise<void>;
};

const initializeAuth = async () => {
  const { setSession, setIsLoadingAuth } = useAuthStore.getState();
  const { data } = await supabase.auth.getSession();

  const session = data.session;

  setSession(session);
  setIsLoadingAuth(false);
};

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  setSession: (session) => set({ session }),
  isLoadingAuth: true,
  setIsLoadingAuth: (isLoading) => set({ isLoadingAuth: isLoading }),
  initializeAuth,
}));
