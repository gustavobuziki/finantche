import { ChartAnnual } from "@/components/expenses/chart-annual";
import { Header } from "@/components/ui/header";
import { Buckets } from "@/components/expenses/buckets";
import { TableExpenses } from "@/components/expenses/table-expenses";

export function Dashboard() {
  return (
    <div className="flex flex-col w-full gap-6 p-6">
      <Header />
      <main className="flex flex-col gap-3">
        <div className="flex gap-3">
          <Buckets />
          <ChartAnnual />
        </div>
        <TableExpenses />
      </main>
    </div>
  );
}
