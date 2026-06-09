import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Cell,
  ReferenceLine,
} from "recharts";
import { BadgeDollarSign, Goal } from "lucide-react";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";

import { getLast12MonthsExpensesTotal } from "@/services/expenses";

import { QUERY_KEYS } from "@/constants/query-keys";

import { currencyFormatter } from "@/utils/currency";
import { usePeriod } from "@/hooks/use-period";

const chartConfig = {} satisfies ChartConfig;

export function ChartAnnual() {
  const { theme, systemTheme } = useTheme();
  const darkMode =
    theme === "dark" || (theme === "system" && systemTheme === "dark");
  const { period, year, month } = usePeriod();

  const { data: totalMonths } = useQuery({
    queryFn: () => getLast12MonthsExpensesTotal(period),
    queryKey: [QUERY_KEYS.LAST_12_MONTHS_EXPENSES_TOTAL, period],
  });

  const getYearMonthKey = (dateString: string) => {
    const [year, month] = dateString.split("-");

    return `${year}-${month}`;
  };

  const renderChartData = () => {
    const months = Array.from({ length: 12 }, (_, index) => {
      const date = new Date(year, month - 1 - 11 + index, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      console.log("Gerando mês para chave:", key);

      return {
        key,
        month: date.toLocaleDateString("pt-BR", {
          month: "short",
          year: "numeric",
        }),
        total: 0,
      };
    });

    totalMonths?.forEach((expense) => {
      const key = getYearMonthKey(expense.date);
      console.log("Processando despesa com data:", expense.date, "chave:", key);

      const month = months.find((item) => item.key === key);

      if (month) {
        month.total += Number(expense.amount);
      }
    });

    return months.map(({ month, total }) => ({
      month: month.charAt(0).toUpperCase() + month.slice(1),
      total,
    }));
  };

  const chartData = renderChartData();

  const getAverageMonthlyExpense = () => {
    const totalSpent = chartData.reduce((acc, month) => acc + month.total, 0);
    const monthsWithExpenses = chartData.filter(
      (month) => month.total > 0,
    ).length;

    if (monthsWithExpenses === 0) return 0;

    return totalSpent / monthsWithExpenses;
  };

  return (
    <Card className="flex-2 border border-input">
      <CardHeader>
        <CardTitle>Resumo anual</CardTitle>
        <CardDescription>
          Veja um resumo dos gastos dos últimos 12 meses
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center px-6">
        <div>
          <div className="flex flex-col border-b pb-4">
            <div className="flex items-center gap-2">
              <BadgeDollarSign
                size={18}
                className="text-gray-500 dark:text-gray-300"
              />
              <span className="text-gray-500 dark:text-gray-300 font-medium">
                Média
              </span>
            </div>
            <span className="text-xl font-semibold">
              {currencyFormatter(getAverageMonthlyExpense())}
            </span>
          </div>

          <div className="flex flex-col pt-4">
            <div className="flex items-center gap-2">
              <Goal size={18} className="text-gray-500 dark:text-gray-300" />
              <span className="text-gray-500 dark:text-gray-300 font-medium">
                Meta
              </span>
            </div>
            <span className="text-lg font-medium">Não definida</span>
          </div>
        </div>

        <div className="flex-1 px-4">
          <ChartContainer config={chartConfig} className="h-39.5 w-full px-2">
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ReferenceLine
                y={getAverageMonthlyExpense()}
                stroke={darkMode ? "#FFFFFF" : "#000000"}
                strokeDasharray="4 4"
                strokeWidth={1.5}
              />
              <Bar dataKey="total" radius={4}>
                {chartData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={
                      index === chartData.length - 1 ? "#3cac7d" : "#01662f"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
