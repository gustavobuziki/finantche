export const currencyFormatter = (value: number) => {
  if (value === 0) return "R$ 0,00";

  if (isNaN(value)) return "R$ 0,00";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};
