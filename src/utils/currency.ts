import type { Expenses } from "@/types/expenses";

export const currencyFormatter = (value: number) => {
  if (value === 0) return "R$ 0,00";

  if (isNaN(value)) return "R$ 0,00";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

export const getExpensesTotal = (expenses: Expenses[] | undefined) => {
  if (!expenses || expenses.length === 0) return 0;

  return expenses?.reduce((total, expense) => {
    return total + Number(expense.amount);
  }, 0);
};
