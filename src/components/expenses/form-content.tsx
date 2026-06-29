import { useQueryClient } from "@tanstack/react-query";
import { DollarSign, Text } from "lucide-react";
import { motion } from "motion/react";
import { type ReactNode,useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";

import { MONTHS, YEARS } from "@/constants/dates";
import { QUERY_KEYS } from "@/constants/query-keys";
import { usePeriod } from "@/hooks/use-period";
import { createExpense } from "@/services/expenses";
import { createRecurrence } from "@/services/recurrences";
import type { Category } from "@/types/categories";
import type { ExpensesPayload, FormDataExpenses } from "@/types/expenses";
import type { RecurrencePayload } from "@/types/recurrences";
import { currencyFormatter } from "@/utils/currency";

import { Button } from "../ui/button";
import { Field, FieldError, FieldLabel } from "../ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Switch } from "../ui/switch";

interface Props {
  invalidateQueries: () => void;
  buttonClose: ReactNode;
  categories: Category[] | undefined;
}

export function FormContent({
  invalidateQueries,
  buttonClose,
  categories,
}: Props) {
  const { month, year } = usePeriod();
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormDataExpenses>({
    defaultValues: {
      description: "",
      amount: 0,
      month: month,
      year: year,
      category_id: undefined,
      is_recurring: false,
    },
  });
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);

  console.log(getValues());

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
      setValue("description", "");
      setValue("amount", 0);
    }
  };

  return (
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
              <Text className="text-muted-foreground" />
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
                  value={field.value ? currencyFormatter(field.value) : ""}
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
  );
}
