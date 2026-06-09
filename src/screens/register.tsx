import { useState } from "react";
import { Lock, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "motion/react";
import { z } from "zod";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

import { Button } from "@/components/ui/button";
import { postRegister } from "@/services/auth";

type FormData = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const registerSchema = z
  .object({
    name: z.string().min(1, "Nome é obrigatório"),
    email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string().min(6, "Confirme sua senha"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não são iguais",
    path: ["confirmPassword"],
  });

export function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await postRegister(data.name, data.email, data.password);
      toast.success("Confirme seu e-mail para ativar a conta.");
      console.log(response);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <motion.div layout className="w-full">
        <Card className="px-6 sm:w-md">
          <div>
            <h2 className="text-2xl font-semibold">Criar Conta</h2>
            <span className="text-gray-400">
              Insira suas informações para criar uma conta.
            </span>
          </div>
          <div className="flex flex-col gap-4">
            <Field data-invalid={false}>
              <FieldLabel htmlFor="name">Nome</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="name"
                  placeholder="Nome..."
                  {...register("name", {
                    required: "Nome é obrigatório",
                  })}
                  aria-invalid={!!errors.name}
                />
                <InputGroupAddon align="inline-start">
                  <User className="text-muted-foreground" />
                </InputGroupAddon>
              </InputGroup>
              {errors.name && <FieldError>{errors.name.message}.</FieldError>}
            </Field>
            <Field data-invalid={false}>
              <FieldLabel htmlFor="email">E-mail</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="email"
                  placeholder="E-mail..."
                  {...register("email")}
                  aria-invalid={!!errors.email}
                />
                <InputGroupAddon align="inline-start">
                  <Mail className="text-muted-foreground" />
                </InputGroupAddon>
              </InputGroup>
              {errors.email && <FieldError>{errors.email.message}.</FieldError>}
            </Field>
            <Field data-invalid={false}>
              <FieldLabel htmlFor="password">Senha</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  type="password"
                  placeholder="Senha..."
                  {...register("password")}
                  aria-invalid={!!errors.password}
                />
                <InputGroupAddon align="inline-start">
                  <Lock className="text-muted-foreground" />
                </InputGroupAddon>
              </InputGroup>
              {errors.password && (
                <FieldError>{errors.password.message}.</FieldError>
              )}
            </Field>
            <Field data-invalid={false}>
              <FieldLabel htmlFor="confirmPassword">Confirmar Senha</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirmar Senha..."
                  {...register("confirmPassword")}
                  aria-invalid={!!errors.confirmPassword}
                />
                <InputGroupAddon align="inline-start">
                  <Lock className="text-muted-foreground" />
                </InputGroupAddon>
              </InputGroup>
              {errors.confirmPassword && (
                <FieldError>{errors.confirmPassword.message}.</FieldError>
              )}
            </Field>
          </div>
          <Button className="w-full mt-6" type="submit" isLoading={isLoading}>
            Criar
          </Button>

          <a
            href="/login"
            className="text-center text-gray-400 hover:underline cursor-pointer text-sm"
          >
            Já possui uma conta? Faça login
          </a>
        </Card>
      </motion.div>
    </form>
  );
}
