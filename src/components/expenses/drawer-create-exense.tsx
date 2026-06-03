import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import { ListPlus } from "lucide-react";
import { FormExpenses } from "./form-expenses";

export function DrawerCreateExpense() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          <ListPlus size={16} />
          Adicionar
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Criar Despesa</DrawerTitle>
          <DrawerDescription>
            Adicione uma nova despesa ao seu registro. Clique em criar quando
            terminar.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex justify-center">
          <FormExpenses
            buttonClose={
              <DrawerClose>
                <Button className="w-full" type="button" variant="outline">
                  Cancelar
                </Button>
              </DrawerClose>
            }
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
