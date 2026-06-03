import { MoreHorizontalIcon } from "lucide-react";

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
import { useQuery } from "@tanstack/react-query";
import { getExpenses } from "@/services/expenses";
import { QUERY_KEYS } from "@/constants/query-keys";
import { getCategories } from "@/services/categories";
import { Badge } from "../ui/badge";
import { useMemo } from "react";
import { useDebouncedValue } from "@/hooks/use-debounce";

interface Props {
  searchValue: string;
}

export function TableExpenses({ searchValue }: Props) {
  const { data: expenses } = useQuery({
    queryFn: getExpenses,
    queryKey: [QUERY_KEYS.EXPENSES],
  });
  const { data: categories } = useQuery({
    queryFn: getCategories,
    queryKey: [QUERY_KEYS.CATEGORIES],
  });

  const debouncedSearch = useDebouncedValue(searchValue, 300);

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
                  <Button variant="ghost" size="icon" className="size-8">
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
  );
}
