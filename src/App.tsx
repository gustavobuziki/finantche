import { Toaster } from "sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Dashboard } from "./screens/dashboard";
import { useIsMobile } from "./hooks/use-mobile";

import "./App.css";

function App() {
  const queryClient = new QueryClient();
  const isMobile = useIsMobile();

  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
      <Toaster
        theme="dark"
        position={isMobile ? "top-center" : "bottom-right"}
      />
    </QueryClientProvider>
  );
}

export default App;
