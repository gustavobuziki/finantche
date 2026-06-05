import {
  BadgeDollarSign,
  BanknoteArrowUp,
  CalendarFold,
  TrendingUp,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Card } from "../ui/card";

import type { Expenses } from "@/types/expenses";

import { currencyFormatter, getExpensesTotal } from "@/utils/currency";
import { getNextMonth, getPreviousMonth } from "@/utils/date";

import { useGlobalStore } from "@/store/global-store";

import {
  getBiggestExpenseByMonth,
  getExpensesByMonth,
  getExpensesTotalByMonth,
} from "@/services/expenses";

import { QUERY_KEYS } from "@/constants/query-keys";
import { MONTHS } from "@/constants/dates";

interface Props {
  expenses: Expenses[] | undefined;
}

export function Buckets({ expenses }: Props) {
  const { dateSelected } = useGlobalStore();

  const { data: biggestExpense } = useQuery({
    queryKey: [QUERY_KEYS.BIGGEST_EXPENSE, dateSelected],
    queryFn: () => getBiggestExpenseByMonth(dateSelected),
  });

  const previousMonth = getPreviousMonth(dateSelected);
  const { data: totalExpensesPreviousMonth } = useQuery({
    queryKey: [QUERY_KEYS.TOTAL_EXPENSES_PREVIOUS_MONTH, previousMonth],
    queryFn: () => getExpensesTotalByMonth(previousMonth),
  });

  const nextMonth = getNextMonth(dateSelected);
  const { data: expensesNextMonth } = useQuery({
    queryKey: [QUERY_KEYS.EXPENSES, nextMonth],
    queryFn: () => getExpensesByMonth(nextMonth),
  });

  const getPreviousMonthComparison = () => {
    const previousTotal = totalExpensesPreviousMonth;
    const currentTotal = getExpensesTotal(expenses) || 0;

    if (previousTotal === 0) {
      return {
        currentTotal,
        previousTotal,
        percentage: currentTotal > 0 ? 100 : 0,
        type: currentTotal > 0 ? "increase" : "neutral",
      };
    }

    const percentage = ((currentTotal - previousTotal) / previousTotal) * 100;

    return {
      currentTotal,
      previousTotal,
      percentage,
      type:
        percentage > 0 ? "increase" : percentage < 0 ? "decrease" : "neutral",
    };
  };

  const getMonthComparison = getPreviousMonthComparison();
  const previousMonthLabel = MONTHS[previousMonth.getMonth()].label;
  const currentMonthTotal = getExpensesTotal(expenses);
  const nextMonthTotal = getExpensesTotal(expensesNextMonth);
  const nextMonthLabel = MONTHS[nextMonth.getMonth()].label;
  const monthDifferenceIncrease = currencyFormatter(
    getMonthComparison.currentTotal - getMonthComparison.previousTotal,
  );
  const monthDifferenceDecrease = currencyFormatter(
    getMonthComparison.previousTotal - getMonthComparison.currentTotal,
  );

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
            {currencyFormatter(currentMonthTotal)}
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
          {getMonthComparison.type === "increase" && (
            <>
              <span className="text-xl font-semibold text-red-400">
                +{getMonthComparison.percentage.toFixed(2)}%
              </span>
              <span className="text-red-400">{`${monthDifferenceIncrease} a mais que ${previousMonthLabel}`}</span>
            </>
          )}
          {getMonthComparison.type === "decrease" && (
            <>
              <span className="text-xl font-semibold text-green-500">
                {getMonthComparison.percentage.toFixed(2)}%
              </span>
              <span className="text-green-500">{`${monthDifferenceDecrease} a menos que ${previousMonthLabel}`}</span>
            </>
          )}
          {getMonthComparison.type === "neutral" && (
            <>
              <span className="text-xl font-semibold text-gray-400">0%</span>
              <span className="text-gray-400">
                Os gastos permaneceram iguais
              </span>
            </>
          )}
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
              Projeção {nextMonthLabel}
            </span>
          </div>
          <span className="text-xl font-semibold">
            {currencyFormatter(nextMonthTotal)}
          </span>
          <span className="text-gray-400">
            {expensesNextMonth?.length || 0} despesas registradas
          </span>
        </Card>
      </div>
    </div>
  );
}
