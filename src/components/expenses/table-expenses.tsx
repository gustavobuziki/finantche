import { useMemo, useState } from "react";
import { MoreHorizontalIcon, Search } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { QUERY_KEYS } from "@/constants/query-keys";
import { getCategories } from "@/services/categories";
import { Badge } from "../ui/badge";
import { useDebouncedValue } from "@/hooks/use-debounce";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { DrawerCreateExpense } from "./drawer-create-exense";
import { ModalCreateExpense } from "./modal-create-exense";
import { useIsMobile } from "@/hooks/use-mobile";
import type { Expenses } from "@/types/expenses";

interface Props {
  expenses: Expenses[] | undefined;
}

export function TableExpenses({ expenses }: Props) {
  const [searchValue, setSearchValue] = useState("");

  const debouncedSearch = useDebouncedValue(searchValue, 300);
  const isMobile = useIsMobile();

  const { data: categories } = useQuery({
    queryFn: getCategories,
    queryKey: [QUERY_KEYS.CATEGORIES],
  });

  const renderCategory = (categoryId: string) => {
    const category = categories?.find((cat) => cat.id === categoryId);

    if (!category) {
      return <Badge>Sem categoria</Badge>;
    }

    return (
      <Badge variant="outline" className="text-xs gap-2 py-3">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: category.color }}
        />
        {category.name}
      </Badge>
    );
  };

  const formatExpenses = expenses?.map((expense) => ({
    ...expense,
    date: new Intl.DateTimeFormat("pt-BR").format(new Date(expense.date)),
    amount: new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(expense.amount),
  }));

  const filtered = useMemo(
    () =>
      formatExpenses?.filter((e) =>
        e.description.toLowerCase().includes(debouncedSearch.toLowerCase()),
      ),
    [formatExpenses, debouncedSearch],
  );

  return (
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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered?.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell width="40%">{expense.description}</TableCell>
                <TableCell width="20%">{expense.amount}</TableCell>
                <TableCell width="20%">
                  {renderCategory(expense.category_id)}
                </TableCell>
                <TableCell width="10%">{expense.date}</TableCell>
                <TableCell width="10%" className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="size-8">
                        <MoreHorizontalIcon />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem variant="destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
