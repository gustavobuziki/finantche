import { useQueryClient } from "@tanstack/react-query";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { useState } from "react";
import { QUERY_KEYS } from "@/constants/query-keys";
import { deleteExpense } from "@/services/expenses";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  idExpense: string;
}

export function DrawerDeleteExpense({ open, onOpenChange, idExpense }: Props) {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);

    try {
      await deleteExpense(idExpense);
      toast.success("Despesa excluída com sucesso.");
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EXPENSES] });
      onOpenChange(false);
    } catch {
      toast.error("Erro ao excluir despesa. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Despesa</DialogTitle>
        </DialogHeader>
        <div className="border-l-4 border-red-500 p-2 bg-red-500/10 rounded-sm">
          <span className="text-red-400 dark:text-red-300">
            Tem certeza que deseja excluir esta despesa? Esta ação não pode ser
            desfeita.
          </span>
        </div>

        <Button
          variant="destructive"
          className="w-full mt-4"
          onClick={handleDelete}
          isLoading={isLoading}
        >
          Excluir
        </Button>
      </DialogContent>
    </Dialog>
  );
}
