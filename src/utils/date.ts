export const getMonthRange = (period: string) => {
  const [year, month] = period.split("-").map(Number);
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0);

  return {
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0],
  };
};

export const getPreviousMonth = (period: string) => {
  const [year, month] = period.split("-").map(Number);
  const previousMonthDate = new Date(year, month - 2, 1);

  const y = previousMonthDate.getFullYear();
  const m = String(previousMonthDate.getMonth() + 1).padStart(2, "0");

  return `${y}-${m}`;
};

export const getNextMonth = (period: string) => {
  const [year, month] = period.split("-").map(Number);
  const nextMonthDate = new Date(year, month, 1);

  const y = nextMonthDate.getFullYear();
  const m = String(nextMonthDate.getMonth() + 1).padStart(2, "0");

  return `${y}-${m}`;
};

export const getDateLast12Months = (period: string) => {
  const [year, month] = period.split("-").map(Number);
  const initialDate = new Date(year, month - 12, 1);
  const endDate = new Date(year, month, 0);

  return {
    startDate: initialDate.toISOString().split("T")[0],
    endDate: endDate.toISOString().split("T")[0],
  };
};
