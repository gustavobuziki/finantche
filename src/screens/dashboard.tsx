import { MoonIcon, Search, SunIcon } from "lucide-react";

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
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";

export function Dashboard() {
  const darkMode = true;
  const isMobile = useIsMobile();

  const [searchValue, setSearchValue] = useState("");

  return (
    <div className="flex flex-col w-full gap-3">
      <header className="flex flex-row items-center pl-4 pr-8">
        <img src={Logo} alt="Logo" width={180} height={55} />
        <div className="flex items-center gap-2 mt-2 ml-auto">
          <Button variant="ghost">
            {darkMode ? <SunIcon size={16} /> : <MoonIcon size={16} />}
          </Button>
          <Avatar size="lg">
            <AvatarFallback>GB</AvatarFallback>
          </Avatar>
        </div>
      </header>

      <main className="flex flex-col gap-3 px-8">
        <div className="flex items-center gap-3"></div>

        <Card>
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
