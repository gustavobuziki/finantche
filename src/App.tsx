import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import "./App.css";
import { FormCategories } from "./components/categories/form-categories";
import { FormExpenses } from "./components/expenses/form-expenses";
import { FormRecurrences } from "./components/recurrences/form-recurrences";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex w-full h-full items-center justify-center gap-4">
        <FormCategories />
        <FormRecurrences />
        <FormExpenses />
      </div>
    </QueryClientProvider>
  );
}

export default App;
