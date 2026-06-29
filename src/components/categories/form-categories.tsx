import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FolderOpen, PaintBucket, TextIcon, Trash } from "lucide-react";
import { motion } from "motion/react";
import { type ReactNode,useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QUERY_KEYS } from "@/constants/query-keys";
import {
  createCategory,
  deleteCategory,
  getCategories,
} from "@/services/categories";
import type { FormDataCategory } from "@/types/categories";

interface Props {
  buttonClose?: ReactNode;
}

export function FormCategories({ buttonClose }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormDataCategory>({
    defaultValues: {
      name: "",
      color: "#007800",
      icon: "",
    },
  });

  const { data: categories } = useQuery({
    queryFn: getCategories,
    queryKey: [QUERY_KEYS.CATEGORIES],
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
      reset();
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      const category = await deleteCategory(categoryId);
      toast.success(`Categoria ${category.name} deletada com sucesso!`);
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CATEGORIES] });
    } catch {
      toast.error("Erro ao deletar categoria.");
    }
  };

  return (
    <Tabs defaultValue="form" className="w-full">
      <TabsList className="mx-auto">
        <TabsTrigger value="form" className="w-25">
          Adicionar
        </TabsTrigger>
        <TabsTrigger value="resultados" className="w-25">
          Resultados
        </TabsTrigger>
      </TabsList>
      <TabsContent value="form">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <form
            onSubmit={handleSubmit(onsubmit)}
            className="w-full sm:max-w-md px-4 md:p-0"
          >
            <div className="flex flex-col gap-3">
              <div className="flex gap-2 h-25">
                <Field data-invalid={!!errors.name}>
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
                  {errors.name && (
                    <FieldError>{errors.name.message}.</FieldError>
                  )}
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
                  {errors.color && (
                    <FieldError>{errors.color.message}.</FieldError>
                  )}
                </Field>
              </div>

              <div className="w-full mt-4 flex flex-col gap-2">
                {buttonClose && buttonClose}
                <Button type="submit" isLoading={isLoading}>
                  Criar
                </Button>
              </div>
            </div>
          </form>
        </motion.div>
      </TabsContent>
      <TabsContent value="resultados">
        <div className="h-52">
          {categories?.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-full text-muted-foreground"
            >
              <FolderOpen size={42} />
              <span className="mt-2">Nenhuma categoria encontrada.</span>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 h-full overflow-y-auto"
            >
              <ul className="flex flex-col mt-2 pr-2">
                {categories?.map((category) => (
                  <li
                    key={category.id}
                    className="flex items-center gap-2 p-0.5 border-b border-input last:border-0"
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span>{category.name}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="ml-auto"
                      onClick={() => handleDeleteCategory(category.id)}
                    >
                      <Trash className="text-red-400" />
                    </Button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
}
