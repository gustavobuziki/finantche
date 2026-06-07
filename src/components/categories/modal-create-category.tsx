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

import { ClipboardList } from "lucide-react";
import { FormCategories } from "./form-categories";

export function ModalCategories() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <ClipboardList size={14} />
          Minhas categorias
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar Categoria</DialogTitle>
          <DialogDescription>
            Adicione e vizualize as categorias do seu perfil.
          </DialogDescription>
        </DialogHeader>

        <div className="flex justify-center">
          <FormCategories
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
