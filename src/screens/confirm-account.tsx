import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ConfirmAccount() {
  const navigate = useNavigate();

  return (
    <motion.div layout>
      <Card className="px-6">
        <div>
          <h2 className="text-2xl font-semibold mb-2 text-center">
            Confirmação de Conta
          </h2>
          <span className="text-gray-400 text-center flex justify-center">
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
