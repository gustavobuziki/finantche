import { useState } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { PaintBucket, TextIcon } from "lucide-react";
import { motion } from "motion/react";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import { createCategory } from "@/services/categories";
import type { FormDataCategory } from "@/types/categories";
import { useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/query-keys";

export function FormCategories() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataCategory>({
    defaultValues: {
      name: "",
      color: "#007800",
      icon: "",
    },
  });

  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const onsubmit = async (data: FormDataCategory) => {
    setIsLoading(true);

    try {
      const category = await createCategory(data);
      toast.success(`Categoria ${category.name} criada com sucesso!`);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
    } catch {
      toast.error("Erro ao criar categoria.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onsubmit)}>
      <motion.div layout className="flex flex-col gap-3">
        <div className="flex gap-2">
          <Field data-invalid={!!errors.name} className="w-xs">
            <FieldLabel htmlFor="name">Nome</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="name"
                placeholder="Nome..."
                {...register("name", {
                  required: "Nome é obrigatório",
                  minLength: {
                    value: 3,
                    message: "Nome deve ter pelo menos 3 caracteres",
                  },
                })}
                aria-invalid={!!errors.name}
              />
              <InputGroupAddon align="inline-start">
                <TextIcon className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>
            {errors.name && <FieldError>{errors.name.message}.</FieldError>}
          </Field>

          <Field data-invalid={!!errors.color} className="w-25">
            <FieldLabel htmlFor="color">Cor</FieldLabel>
            <InputGroup>
              <InputGroupInput
                id="color"
                placeholder="Cor..."
                type="color"
                {...register("color", { required: "Cor é obrigatória" })}
                aria-invalid={!!errors.color}
              />
              <InputGroupAddon align="inline-start">
                <PaintBucket className="text-muted-foreground" />
              </InputGroupAddon>
            </InputGroup>
            {errors.color && <FieldError>{errors.color.message}.</FieldError>}
          </Field>
        </div>

        <Button className="w-full mt-4" type="submit" isLoading={isLoading}>
          Criar
        </Button>
      </motion.div>
    </form>
  );
}
