import { useQuery } from "@tanstack/react-query";

import { ChartAnnual } from "@/components/expenses/chart-annual";
import { Header } from "@/components/ui/header";
import { Buckets } from "@/components/expenses/buckets";
import { TableExpenses } from "@/components/expenses/table-expenses";
import { getExpensesByMonth } from "@/services/expenses";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useGlobalStore } from "@/store/global-store";

export function Dashboard() {
  const { monthSelected, yearSelected } = useGlobalStore();

  const { data: expenses } = useQuery({
    queryFn: () => getExpensesByMonth(yearSelected, monthSelected),
    queryKey: [QUERY_KEYS.EXPENSES, yearSelected, monthSelected],
  });

  return (
    <div className="flex flex-col w-full gap-6 p-6">
      <Header />
      <main className="flex flex-col gap-3 pb-6 -mt-3">
        <div className="flex gap-3">
          <Buckets expenses={expenses} />
          <ChartAnnual />
        </div>
        <TableExpenses expenses={expenses} />
      </main>
    </div>
  );
}
