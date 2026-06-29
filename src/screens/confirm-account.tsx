import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function ConfirmAccount() {
  const navigate = useNavigate();

  return (
    <motion.div layout>
      <Card className="px-6">
        <div>
          <h2 className="mb-2 text-center text-2xl font-semibold">
            Confirmação de Conta
          </h2>
          <span className="flex justify-center text-center text-gray-400">
            Sua conta ativada com sucesso. Faça login para acessar suas
            finanças.
          </span>
        </div>
        <Button className="mt-4" onClick={() => navigate("/login")}>
          Ir para login
        </Button>
      </Card>
    </motion.div>
  );
}
