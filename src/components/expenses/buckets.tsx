import {
  BadgeDollarSign,
  BanknoteArrowUp,
  CalendarFold,
  TrendingUp,
} from "lucide-react";

import { Card } from "../ui/card";

export function Buckets() {
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
          <span className="text-xl font-semibold">R$ 3.240,00</span>
          <span className="text-gray-400 dark:text-gray-400">
            18 despesas registradas
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
          <span className="text-xl font-semibold">Fin. Carro</span>
          <span className="text-gray-400">R$ 1.200,00</span>
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
