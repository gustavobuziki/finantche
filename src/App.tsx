import { useEffect } from "react";
import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useIsMobile } from "./hooks/use-mobile";

import { AppRoutes } from "./routes/routes";
import { useAuthStore } from "./store/auth-store";

import "./App.css";

function App() {
  const queryClient = new QueryClient();
  const isMobile = useIsMobile();
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AppRoutes />
      <Toaster
        theme="dark"
        richColors
        position={isMobile ? "top-center" : "bottom-right"}
      />
    </QueryClientProvider>
  );
}

export default App;
