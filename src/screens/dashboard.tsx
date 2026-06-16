import { useQuery } from "@tanstack/react-query";

import { Header } from "@/components/ui/header";
import { Buckets } from "@/components/expenses/buckets";
import { TableExpenses } from "@/components/expenses/table-expenses";

import { getExpensesByMonth } from "@/services/expenses";
import { usePeriod } from "@/hooks/use-period";

import { QUERY_KEYS } from "@/constants/query-keys";
import { useIsMobile } from "@/hooks/use-mobile";
import { ChartAnnual } from "@/components/expenses/chart-annual";

export function Dashboard() {
  const { period } = usePeriod();
  const isMobile = useIsMobile();

  const { data: expenses } = useQuery({
    queryFn: () => getExpensesByMonth(period),
    queryKey: [QUERY_KEYS.EXPENSES, period],
  });

  return (
    <div className="flex flex-col w-full gap-6 p-6">
      <Header />
      <main className="flex flex-col gap-3 pb-6 -mt-3">
        <div className="flex flex-col lg:flex-row gap-3">
          <Buckets expenses={expenses} />
          {!isMobile && <ChartAnnual />}
        </div>
        <TableExpenses expenses={expenses} />
      </main>
    </div>
  );
}
