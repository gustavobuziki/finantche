import { Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useTheme } from "next-themes";

import { Card } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

import LogoDark from "@/assets/logo-dark-finantche.png";
import LogoLight from "@/assets/logo-light-finantche.png";
import { Button } from "@/components/ui/button";
import { postLogin } from "@/services/auth";

type FormData = {
  email: string;
  password: string;
};

export function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { theme } = useTheme();
  const darkMode = theme === "dark";

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);

    try {
      await postLogin(data.email, data.password);
      window.location.reload();
    } catch (error) {
      if (error?.code === "invalid_credentials") {
        toast.error("Credenciais inválidas");
      }
      if (error?.code === "email_not_confirmed") {
        toast.error("E-mail não confirmado. Verifique sua caixa de entrada.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex w-full h-full items-center justify-evenly">
      <div className="flex flex-col gap-2 items-center">
        <img src={darkMode ? LogoDark : LogoLight} alt="Logo" width={350} />
        <span className="text-gray-400 text-sm flex text-center">
          Controle seus gastos mensais e <br /> tenha uma visão clara de suas
          finanças.
        </span>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <motion.div layout className="w-full">
          <Card className="px-6">
            <div>
              <h2 className="text-2xl font-semibold">Login</h2>
              <span className="text-gray-400">
                Insira suas credenciais para acessar sua conta.
              </span>
            </div>
            <div className="flex flex-col gap-4">
              <Field data-invalid={false} className="w-md">
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="email"
                    placeholder="E-mail..."
                    {...register("email", {
                      required: "E-mail é obrigatório",
                    })}
                    aria-invalid={!!errors.email}
                  />
                  <InputGroupAddon align="inline-start">
                    <Mail className="text-muted-foreground" />
                  </InputGroupAddon>
                </InputGroup>
                {errors.email && (
                  <FieldError>{errors.email.message}.</FieldError>
                )}
              </Field>
              <Field data-invalid={false} className="w-md">
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <InputGroup>
                  <InputGroupInput
                    id="password"
                    type="password"
                    placeholder="Senha..."
                    {...register("password", {
                      required: "Senha é obrigatória",
                    })}
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
            </div>

            <div className="flex flex-col gap-2">
              <Button
                className="w-full mt-6"
                type="submit"
                isLoading={isLoading}
              >
                Entrar
              </Button>
              <div className="flex justify-between mt-4">
                <a
                  href="/register"
                  className="text-center text-gray-400 hover:underline cursor-pointer text-sm"
                >
                  Esqueci a senha
                </a>
                <a
                  href="/register"
                  className="text-center text-gray-400 hover:underline cursor-pointer text-sm"
                >
                  Criar conta
                </a>
              </div>
            </div>
          </Card>
        </motion.div>
      </form>
    </div>
  );
}
