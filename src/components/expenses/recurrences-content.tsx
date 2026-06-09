import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FolderOpen } from "lucide-react";
import { motion } from "motion/react";

import { QUERY_KEYS } from "@/constants/query-keys";
import { getRecurrences } from "@/services/recurrences";
import { Field, FieldContent, FieldLabel } from "../ui/field";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import type { Category } from "@/types/categories";
import { toast } from "sonner";
import { createExpense } from "@/services/expenses";
import { currencyFormatter } from "@/utils/currency";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { MONTHS, YEARS } from "@/constants/dates";
import { Button } from "../ui/button";

interface Props {
  categories: Category[];
  invalidateQueries: () => void;
}
export function RecurrencesContent({ categories, invalidateQueries }: Props) {
  const { data: recurrences } = useQuery({
    queryFn: getRecurrences,
    queryKey: [QUERY_KEYS.RECURRENCES],
  });

  const [selectedRecurrenceIds, setSelectedRecurrenceIds] = useState<
    Set<string>
  >(new Set());
  const [selectedMonth, setSelectedMonth] = useState(
    (new Date().getMonth() + 1).toString(),
  );
  const [selectedYear, setSelectedYear] = useState(
    new Date().getFullYear().toString(),
  );
  const [isLoading, setIsLoading] = useState(false);

  const recurrenceIds = recurrences?.map((recurrence) => recurrence.id) ?? [];
  const selectedRecurrencesCount = recurrenceIds.filter((id) =>
    selectedRecurrenceIds.has(id),
  ).length;
  const areAllRecurrencesSelected =
    recurrenceIds.length > 0 &&
    selectedRecurrencesCount === recurrenceIds.length;
  const allRecurrencesCheckedState = areAllRecurrencesSelected
    ? true
    : selectedRecurrencesCount > 0
      ? "indeterminate"
      : false;

  const handleAddRecurrences = async () => {
    setIsLoading(true);

    if (!selectedMonth || !selectedYear) {
      toast.warning("Selecione mês e ano antes de adicionar.");
      return;
    }

    const expenseDate = new Date(
      Number(selectedYear),
      Number(selectedMonth) - 1,
      1,
    ).toISOString();

    try {
      await Promise.all(
        Array.from(selectedRecurrenceIds).map((recurrenceId) => {
          const recurrence = recurrences?.find(
            (rec) => rec.id === recurrenceId,
          );
          const category = categories?.find(
            (cat) => cat.id === recurrence?.category_id,
          );

          const payload = {
            description: recurrence?.description ?? "",
            amount: recurrence?.amount ?? 0,
            date: expenseDate,
            category_id: category?.id ?? undefined,
          };

          return createExpense(payload);
        }),
      );
      toast.success("Despesas criadas com sucesso!");
    } catch {
      toast.error("Erro ao criar despesas.");
    } finally {
      setIsLoading(false);
      invalidateQueries();
      setSelectedRecurrenceIds(new Set());
    }
  };

  const toggleRecurrenceSelection = (id: string, checked: boolean) => {
    setSelectedRecurrenceIds((previous) => {
      const next = new Set(previous);

      if (checked) {
        next.add(id);
      } else {
        next.delete(id);
      }

      return next;
    });
  };

  const toggleAllRecurrencesSelection = (
    checked: boolean | "indeterminate",
  ) => {
    if (checked === true) {
      setSelectedRecurrenceIds(new Set(recurrenceIds));
      return;
    }

    setSelectedRecurrenceIds(new Set());
  };

  const renderCategory = (categoryId?: string) => {
    if (!categoryId) {
      return <Badge>Sem categoria</Badge>;
    }

    const category = categories?.find((cat) => cat.id === categoryId);

    if (!category) {
      return <Badge>Sem categoria</Badge>;
    }

    return (
      <Badge variant="outline" className="flex-1 text-xs gap-2 py-2.5">
        <div
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: category.color }}
        />
        <span className="truncate">{category.name}</span>
      </Badge>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="h-79"
    >
      {recurrences?.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
          <FolderOpen size={42} />
          <span className="mt-2">Nenhuma despesa encontrada.</span>
        </div>
      ) : (
        <div className="flex h-full flex-col min-h-0">
          <Field orientation="horizontal" className="flex gap-2.5">
            <Checkbox
              id="all-recurrences"
              checked={allRecurrencesCheckedState}
              onCheckedChange={toggleAllRecurrencesSelection}
            />
            <FieldContent>
              <FieldLabel htmlFor="all-recurrences">Todos</FieldLabel>
            </FieldContent>
          </Field>
          <Separator className="my-2" />
          <div className="flex-1 min-h-0 overflow-y-auto pr-2">
            <ul className="flex flex-col">
              {recurrences?.map((recurrence) => (
                <li
                  key={recurrence.id}
                  className="flex items-center gap-2 border-b border-input last:border-0 py-1.5"
                >
                  <Field
                    orientation="horizontal"
                    className="flex gap-2.5 flex-2"
                  >
                    <Checkbox
                      id={`recurrence-${recurrence.id}`}
                      checked={selectedRecurrenceIds.has(recurrence.id)}
                      onCheckedChange={(checked) =>
                        toggleRecurrenceSelection(
                          recurrence.id,
                          checked === true,
                        )
                      }
                    />
                    <FieldContent>
                      <FieldLabel
                        htmlFor={`recurrence-${recurrence.id}`}
                        className="max-w-32 block truncate"
                      >
                        {recurrence.description}
                      </FieldLabel>
                    </FieldContent>
                  </Field>

                  <span className="flex-1 text-xs">
                    {currencyFormatter(recurrence.amount || 0)}
                  </span>
                  {renderCategory(recurrence.category_id)}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex gap-1 items-center">
            <Field>
              <FieldLabel htmlFor="month">Mês</FieldLabel>
              <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Mês" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {MONTHS.map((month) => (
                      <SelectItem key={month.value} value={month.value}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel htmlFor="year">Ano</FieldLabel>

              <Select value={selectedYear} onValueChange={setSelectedYear}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {YEARS.map((year) => (
                      <SelectItem key={year.value} value={year.value}>
                        {year.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </div>
          <div className="w-full mt-4 flex flex-col gap-2">
            <Button
              type="button"
              isLoading={isLoading}
              onClick={handleAddRecurrences}
            >
              Adicionar
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
