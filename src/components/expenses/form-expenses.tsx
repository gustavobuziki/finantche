import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { DollarSign, TextIcon } from "lucide-react";
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
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
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

  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const onsubmit = async (data: FormDataExpenses) => {
    setIsLoading(true);

    const values: ExpensesPayload = {
      description: data.description,
      amount: data.amount,
      date: new Date(data.year, data.month).toISOString(),
      category_id: data.category_id,
      is_recurring: data.is_recurring,
    };

    try {
      const expense = await createExpense(values);
      toast.success(`Despesa ${expense.description} criada com sucesso!`);
    } catch {
      toast.error("Erro ao criar despesa.");
    } finally {
      setIsLoading(false);
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
      reset();
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);

  return (
    <form
      onSubmit={handleSubmit(onsubmit)}
      className="w-full sm:max-w-md px-4 md:p-0"
    >
      <motion.div layout className="flex flex-col gap-3">
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
          {errors.amount && <FieldError>{errors.amount.message}.</FieldError>}
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
            {errors.month && <FieldError>{errors.month.message}.</FieldError>}
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
          <FieldLabel htmlFor="is_recurring">Recorrente</FieldLabel>
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
      </motion.div>
    </form>
  );
}
