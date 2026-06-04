import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  Cell,
  ReferenceLine,
} from "recharts";
import { BadgeDollarSign } from "lucide-react";
import { useTheme } from "next-themes";

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

const currentMonth = new Date().getMonth();

const chartData = [
  { month: "January", desktop: 1500 },
  { month: "February", desktop: 3050 },
  { month: "March", desktop: 1370 },
  { month: "April", desktop: 730 },
  { month: "May", desktop: 2090 },
  { month: "June", desktop: 2140 },
  { month: "July", desktop: 1989 },
  { month: "August", desktop: 1760 },
  { month: "September", desktop: 2340 },
  { month: "October", desktop: 2100 },
  { month: "November", desktop: 1890 },
  { month: "December", desktop: 2200 },
];

const chartConfig = {} satisfies ChartConfig;

export function ChartAnnual() {
  const { theme } = useTheme();
  const darkMode = theme === "dark";

  const average = Math.round(
    chartData.reduce((sum, item) => sum + item.desktop, 0) / chartData.length,
  );

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
            <span className="text-xl font-semibold">R$ 3.240,00</span>
          </div>

          <div className="flex flex-col pt-4">
            <div className="flex items-center gap-2">
              <BadgeDollarSign
                size={18}
                className="text-gray-500 dark:text-gray-300"
              />
              <span className="text-gray-500 dark:text-gray-300 font-medium">
                Média
              </span>
            </div>
            <span className="text-xl font-semibold">R$ 3.240,00</span>
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
                y={average}
                stroke={darkMode ? "#FFFFFF" : "#000000"}
                strokeDasharray="4 4"
                strokeWidth={1.5}
              />
              <Bar dataKey="desktop" radius={4}>
                {chartData.map((_, index) => (
                  <Cell
                    key={index}
                    fill={index === currentMonth ? "#3cac7d" : "#01662f"}
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
