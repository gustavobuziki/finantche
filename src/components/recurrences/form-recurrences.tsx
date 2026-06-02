import { useState } from "react";
import { toast } from "sonner";
import { Controller, useForm } from "react-hook-form";
import { DollarSign, TextIcon } from "lucide-react";
import { motion } from "motion/react";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type FormData = {
  description: string;
  amount: number;
  day_of_month?: number;
  category_id?: string;
  active: boolean;
};

type Recurrence = {
  id: string;
  description: string;
  amount: number;
  day_of_month?: number;
  category_id?: string;
  active: boolean;
  user_id?: string;
  created_at: string;
};

export function FormRecurrences() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {},
  });

  const [isLoading, setIsLoading] = useState(false);

  const createRecurrence = async (values: FormData) => {
    const { error, data } = await supabase
      .from("recurrences")
      .insert(values)
      .select()
      .single();

    if (error) throw error;

    return data as Recurrence;
  };

  const onsubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      const recurrence = await createRecurrence(data);
      toast.success(
        `Recorrência ${recurrence.description} criada com sucesso!`,
      );
    } catch {
      toast.error("Erro ao criar recorrência.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onsubmit)}>
      <motion.div layout className="flex flex-col gap-3">
        <Field data-invalid={!!errors.description} className="w-sm">
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
          <InputGroup>
            <InputGroupInput
              id="amount"
              placeholder="Valor..."
              {...register("amount", { required: "Valor é obrigatório" })}
              aria-invalid={!!errors.amount}
            />
            <InputGroupAddon align="inline-start">
              <DollarSign className="text-muted-foreground" />
            </InputGroupAddon>
          </InputGroup>
          {errors.amount && <FieldError>{errors.amount.message}.</FieldError>}
        </Field>

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
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            )}
          />
          {errors.category_id && (
            <FieldError>{errors.category_id.message}.</FieldError>
          )}
        </Field>

        <Button className="w-full mt-4" type="submit" isLoading={isLoading}>
          Criar
        </Button>
      </motion.div>
    </form>
  );
}
