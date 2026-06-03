import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { ListPlus } from "lucide-react";
import { FormExpenses } from "./form-expenses";

export function ModalCreateExpense() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <ListPlus size={16} />
          Adicionar
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Despesa</DialogTitle>
          <DialogDescription>
            Adicione uma nova despesa ao seu registro. Clique em criar quando
            terminar.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center">
          <FormExpenses
            buttonClose={
              <DialogClose>
                <Button className="w-full" type="button" variant="outline">
                  Cancelar
                </Button>
              </DialogClose>
            }
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
