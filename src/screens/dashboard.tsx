import { useQuery } from "@tanstack/react-query";

import { Buckets } from "@/components/expenses/buckets";
import { ChartAnnual } from "@/components/expenses/chart-annual";
import { TableExpenses } from "@/components/expenses/table-expenses";
import { Header } from "@/components/ui/header";
import { QUERY_KEYS } from "@/constants/query-keys";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePeriod } from "@/hooks/use-period";
import { getExpensesByMonth } from "@/services/expenses";

export function Dashboard() {
  const { period } = usePeriod();
  const isMobile = useIsMobile();

  const { data: expenses } = useQuery({
    queryFn: () => getExpensesByMonth(period),
    queryKey: [QUERY_KEYS.EXPENSES, period],
  });

  return (
    <div className="flex w-full flex-col gap-6 p-6">
      <Header />
      <main className="-mt-3 flex flex-col gap-3 pb-6">
        <div className="flex flex-col gap-3 lg:flex-row">
          <Buckets expenses={expenses} />
          {!isMobile && <ChartAnnual />}
        </div>
        <TableExpenses expenses={expenses} />
      </main>
    </div>
  );
}
