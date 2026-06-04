export const getMonthRange = (year: number, month: number) => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  return {
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0],
  };
};

export const getPreviousMonth = (year: number, month: number) => {
  const date = new Date(year, month - 2, 1);

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  };
};

export const getNextMonth = (year: number, month: number) => {
  const date = new Date(year, month, 1);

  return {
    year: date.getFullYear(),
    month: date.getMonth() + 1,
  };
};
