import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { DollarSign, FolderOpen, TextIcon } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

import { QUERY_KEYS } from "@/constants/query-keys";

import { getCategories } from "@/services/categories";
import { createExpense } from "@/services/expenses";

import type { ExpensesPayload, FormDataExpenses } from "@/types/expenses";
import { MONTHS, YEARS } from "@/constants/dates";
import type { RecurrencePayload } from "@/types/recurrences";
import { createRecurrence, getRecurrences } from "@/services/recurrences";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";

interface Props {
  buttonClose?: ReactNode;
}

export function FormExpenses({ buttonClose }: Props) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormDataExpenses>({
    defaultValues: {
      description: "",
      amount: 0,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      category_id: undefined,
      is_recurring: false,
    },
  });
  const { data: categories } = useQuery({
    queryFn: getCategories,
    queryKey: [QUERY_KEYS.CATEGORIES],
  });
  const { data: recurrences } = useQuery({
    queryFn: getRecurrences,
    queryKey: [QUERY_KEYS.RECURRENCES],
  });

  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRecurrenceIds, setSelectedRecurrenceIds] = useState<
    Set<string>
  >(new Set());

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

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EXPENSES] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BIGGEST_EXPENSE] });
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.TOTAL_EXPENSES_NEXT_MONTH],
    });
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.TOTAL_EXPENSES_PREVIOUS_MONTH],
    });
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.LAST_12_MONTHS_EXPENSES_TOTAL],
    });
  };

  const handleAddRecurrences = async () => {
    setIsLoading(true);

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
            date: new Date().toISOString(),
            category_id: category?.id ?? undefined,
          };

          createExpense(payload);
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

  const onsubmit = async (data: FormDataExpenses) => {
    setIsLoading(true);

    const expensePayload: ExpensesPayload = {
      description: data.description,
      amount: data.amount,
      date: new Date(data.year, data.month - 1).toISOString(),
      category_id: data.category_id,
    };

    if (data.is_recurring) {
      const recurrencePayload: RecurrencePayload = {
        description: data.description,
        amount: data.amount,
        category_id: data.category_id,
      };

      try {
        await createRecurrence(recurrencePayload);
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.RECURRENCES],
        });
      } catch {
        toast.error("Erro ao criar despesa recorrente.");
      }
    }

    try {
      const expense = await createExpense(expensePayload);
      toast.success(`Despesa ${expense.description} criada com sucesso!`);
    } catch {
      toast.error("Erro ao criar despesa.");
    } finally {
      setIsLoading(false);
      invalidateQueries();
      reset();
    }
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

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <Tabs defaultValue="form" className="w-full">
      <TabsList className="mx-auto">
        <TabsTrigger value="form" className="w-25">
          Criar
        </TabsTrigger>
        <TabsTrigger value="add" className="w-25">
          Adicionar
        </TabsTrigger>
      </TabsList>
      <TabsContent value="form">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <form
            onSubmit={handleSubmit(onsubmit)}
            className="w-full sm:max-w-md px-4 md:p-0 flex flex-col gap-3"
          >
            <Field data-invalid={!!errors.description}>
              <FieldLabel htmlFor="description">Descrição</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="description"
                  placeholder="Descrição..."
                  {...register("description", {
                    required: "Descrição é obrigatória",
                    minLength: {
                      value: 3,
                      message: "Descrição deve ter pelo menos 3 caracteres",
                    },
                  })}
                  aria-invalid={!!errors.description}
                />
                <InputGroupAddon align="inline-start">
                  <TextIcon className="text-muted-foreground" />
                </InputGroupAddon>
              </InputGroup>
              {errors.description && (
                <FieldError>{errors.description.message}.</FieldError>
              )}
            </Field>
            <Field data-invalid={!!errors.amount}>
              <FieldLabel htmlFor="amount">Valor</FieldLabel>
              <Controller
                name="amount"
                control={control}
                rules={{
                  required: "Valor é obrigatório",
                  min: {
                    value: 0.01,
                    message: "Valor deve ser maior que zero",
                  },
                }}
                render={({ field }) => (
                  <InputGroup>
                    <InputGroupInput
                      placeholder="Valor..."
                      value={field.value ? formatCurrency(field.value) : ""}
                      onChange={(e) => {
                        const digits = e.target.value.replace(/\D/g, "");
                        const value = Number(digits) / 100;

                        field.onChange(value);
                      }}
                    />

                    <InputGroupAddon align="inline-start">
                      <DollarSign />
                    </InputGroupAddon>
                  </InputGroup>
                )}
              />
              {errors.amount && (
                <FieldError>{errors.amount.message}.</FieldError>
              )}
            </Field>
            <div className="flex gap-1 items-center">
              <Field data-invalid={!!errors.month}>
                <FieldLabel htmlFor="month">Mês</FieldLabel>
                <Controller
                  control={control}
                  name="month"
                  rules={{ required: "Mês é obrigatório" }}
                  render={({ field }) => (
                    <Select
                      value={field.value.toString()}
                      onValueChange={field.onChange}
                    >
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
                  )}
                />
                {errors.month && (
                  <FieldError>{errors.month.message}.</FieldError>
                )}
              </Field>
              <Field data-invalid={!!errors.year}>
                <FieldLabel htmlFor="year">Ano</FieldLabel>
                <Controller
                  control={control}
                  name="year"
                  rules={{ required: "Ano é obrigatório" }}
                  render={({ field }) => (
                    <Select
                      value={field.value.toString()}
                      onValueChange={field.onChange}
                    >
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
                  )}
                />
                {errors.year && <FieldError>{errors.year.message}.</FieldError>}
              </Field>
            </div>
            <Field data-invalid={!!errors.category_id}>
              <FieldLabel htmlFor="category_id">Categoria</FieldLabel>
              <Controller
                control={control}
                name="category_id"
                rules={{ required: "Categoria é obrigatória" }}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger error={!!errors.category_id}>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <div
                              className="w-2 h-2 rounded-full"
                              style={{ backgroundColor: category.color }}
                            />
                            <span>{category.name}</span>
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category_id && (
                <FieldError>{errors.category_id.message}.</FieldError>
              )}
            </Field>
            <Field
              data-invalid={!!errors.is_recurring}
              className="flex items-center flex-row mt-2 w-full"
            >
              <FieldLabel htmlFor="is_recurring">
                Salvar para usar mais vezes
              </FieldLabel>
              <Controller
                control={control}
                name="is_recurring"
                render={({ field }) => (
                  <Switch
                    id="is_recurring"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              {errors.is_recurring && (
                <FieldError>{errors.is_recurring.message}.</FieldError>
              )}
            </Field>

            <div className="w-full mt-4 flex flex-col gap-2">
              {buttonClose && buttonClose}
              <Button type="submit" isLoading={isLoading}>
                Criar
              </Button>
            </div>
          </form>
        </motion.div>
      </TabsContent>
      <TabsContent value="add">
        <div className="h-83">
          {recurrences?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-muted-foreground"
            >
              <FolderOpen size={42} />
              <span className="mt-2">Nenhuma despesa encontrada.</span>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 h-full overflow-y-auto"
            >
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
              <ul className="flex flex-col pr-2">
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
                      {formatCurrency(recurrence.amount || 0)}
                    </span>
                    {renderCategory(recurrence.category_id)}
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
        <div className="w-full mt-4 flex flex-col gap-2">
          {buttonClose && buttonClose}
          <Button
            type="button"
            isLoading={isLoading}
            onClick={handleAddRecurrences}
          >
            Adicionar
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  );
}
