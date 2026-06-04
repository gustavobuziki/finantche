import {
  BadgeDollarSign,
  BanknoteArrowUp,
  CalendarFold,
  TrendingUp,
} from "lucide-react";

import { Card } from "../ui/card";
import type { Expenses } from "@/types/expenses";
import { currencyFormatter } from "@/utils/currency";
import { useGlobalStore } from "@/store/global-store";
import { useQuery } from "@tanstack/react-query";
import { getBiggestExpenseByMonth } from "@/services/expenses";
import { QUERY_KEYS } from "@/constants/query-keys";

interface Props {
  expenses: Expenses[] | undefined;
}

export function Buckets({ expenses }: Props) {
  const { monthSelected, yearSelected } = useGlobalStore();

  const { data: biggestExpense } = useQuery({
    queryKey: [QUERY_KEYS.BIGGEST_EXPENSE, yearSelected, monthSelected],
    queryFn: () => getBiggestExpenseByMonth(yearSelected, monthSelected),
  });

  const getMonthTotal = () => {
    return expenses?.reduce((total, expense) => {
      return total + Number(expense.amount);
    }, 0);
  };

  return (
    <div className="flex flex-col h-full gap-3">
      <div className="flex h-full gap-3 items-center">
        <Card className="w-sm bg-primary/30 border border-primary p-6 gap-2">
          <div className="flex items-center gap-2">
            <BadgeDollarSign
              size={18}
              className="text-gray-500 dark:text-gray-300"
            />
            <span className="text-gray-500 dark:text-gray-300 font-medium">
              Total do mês
            </span>
          </div>
          <span className="text-xl font-semibold">
            {currencyFormatter(getMonthTotal() || 0)}
          </span>
          <span className="text-gray-400 dark:text-gray-400">
            {expenses?.length || 0} despesas registradas
          </span>
        </Card>
        <Card className="w-2xs border border-input p-6 gap-2">
          <div className="flex items-center gap-2">
            <TrendingUp
              size={18}
              className="text-gray-500 dark:text-gray-300"
            />
            <span className="text-gray-500 dark:text-gray-300 font-medium">
              vs mês anterior
            </span>
          </div>
          <span className="text-xl font-semibold text-red-400">+18%</span>
          <span className="text-red-400">R$ 181,00 a mais que maio</span>
        </Card>
      </div>
      <div className="flex gap-3 h-full items-center">
        <Card className="w-2xs border border-input p-6 gap-2">
          <div className="flex items-center gap-2">
            <BanknoteArrowUp
              size={18}
              className="text-gray-500 dark:text-gray-300"
            />
            <span className="text-gray-500 dark:text-gray-300 font-medium">
              Maior gasto
            </span>
          </div>
          <span className="text-xl font-semibold">
            {biggestExpense?.description || "Nenhuma despesa"}
          </span>
          <span className="text-gray-400">
            {currencyFormatter(biggestExpense?.amount || 0)}
          </span>
        </Card>
        <Card className="w-sm bg-primary/30 border border-primary p-6 gap-2">
          <div className="flex items-center gap-2">
            <CalendarFold
              size={18}
              className="text-gray-500 dark:text-gray-300"
            />
            <span className="text-gray-500 dark:text-gray-300 font-medium">
              Projeção Julho
            </span>
          </div>
          <span className="text-xl font-semibold">R$ 3.240,00</span>
          <span className="text-gray-400">18 despesas registradas</span>
        </Card>
      </div>
    </div>
  );
}
