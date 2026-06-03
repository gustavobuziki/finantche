import {
  BadgeDollarSign,
  BanknoteArrowUp,
  CalendarFold,
  MoonIcon,
  Search,
  Smile,
  SunIcon,
  TrendingUp,
} from "lucide-react";
import { useState } from "react";

import Logo from "@/assets/logo-header.png";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { TableExpenses } from "@/components/expenses/table-expenses";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ModalCreateExpense } from "@/components/expenses/modal-create-exense";
import { DrawerCreateExpense } from "@/components/expenses/drawer-create-exense";
import { ChartAnnual } from "@/components/expenses/chart-annual";
import { useIsMobile } from "@/hooks/use-mobile";

export function Dashboard() {
  const darkMode = true;
  const isMobile = useIsMobile();

  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="flex flex-col w-full gap-3">
      <header className="flex flex-row justify-between items-center pl-4 pr-8">
        <div className="flex items-center gap-2">
          <img src={Logo} alt="Logo" width={180} height={55} />
          <div className="flex gap-1.5 items-center py-1 px-2 border border-input rounded-2xl mt-8">
            <Smile size={16} className="text-gray-300" />
            <span className="text-sm text-gray-300">Bem vindo, Gustavo.</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-6">
          <Button variant="ghost">
            {darkMode ? <SunIcon size={16} /> : <MoonIcon size={16} />}
          </Button>
          <Avatar size="lg">
            <AvatarFallback>GB</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="flex flex-col gap-3 px-8">
        <div className="flex gap-3">
          <div className="flex flex-col h-full gap-3">
            <div className="flex h-full gap-3 items-center">
              <Card className="w-sm bg-primary/30 border border-primary p-6 gap-2">
                <div className="flex items-center gap-2">
                  <BadgeDollarSign size={18} className="text-gray-300" />
                  <span className="text-gray-300 font-medium">
                    Total do mês
                  </span>
                </div>
                <span className="text-xl font-semibold">R$ 3.240,00</span>
                <span className="text-gray-400">18 despesas registradas</span>
              </Card>
              <Card className="w-2xs border border-input p-6 gap-2">
                <div className="flex items-center gap-2">
                  <TrendingUp size={18} className="text-gray-300" />
                  <span className="text-gray-300 font-medium">
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
                  <BanknoteArrowUp size={18} className="text-gray-300" />
                  <span className="text-gray-300 font-medium">Maior gasto</span>
                </div>
                <span className="text-xl font-semibold">Fin. Carro</span>
                <span className="text-gray-400">R$ 1.200,00</span>
              </Card>
              <Card className="w-sm bg-primary/30 border border-primary p-6 gap-2">
                <div className="flex items-center gap-2">
                  <CalendarFold size={18} className="text-gray-300" />
                  <span className="text-gray-300 font-medium">
                    Projeção Julho
                  </span>
                </div>
                <span className="text-xl font-semibold">R$ 3.240,00</span>
                <span className="text-gray-400">18 despesas registradas</span>
              </Card>
            </div>
          </div>

          <Card className="flex-2 border border-input">
            <CardHeader>
              <CardTitle>Resumo anual</CardTitle>
              <CardDescription>
                Veja um resumo dos gastos dos últimos 12 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartAnnual />
            </CardContent>
          </Card>
        </div>

        <Card className="border border-input">
          <CardHeader>
            <CardTitle>Listagem de Despesas</CardTitle>
            <CardDescription>
              Visualize todas as suas despesas registradas
            </CardDescription>
            <CardAction className="flex gap-2 items-center">
              <InputGroup className="h-8">
                <InputGroupAddon align="inline-start">
                  <Search className="text-muted-foreground" />
                </InputGroupAddon>
                <InputGroupInput
                  placeholder="Pesquisar..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </InputGroup>
              {isMobile ? <DrawerCreateExpense /> : <ModalCreateExpense />}
            </CardAction>
          </CardHeader>
          <CardContent>
            <TableExpenses searchValue={searchValue} />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
