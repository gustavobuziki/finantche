export const getMonthRange = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  return {
    startDate: start.toISOString().split("T")[0],
    endDate: end.toISOString().split("T")[0],
  };
};

export const getPreviousMonth = (date: Date) => {
  const previousMonthDate = new Date(
    date.getFullYear(),
    date.getMonth() - 1,
    1,
  );

  return previousMonthDate;
};

export const getNextMonth = (date: Date) => {
  const nextMonthDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);

  return nextMonthDate;
};

export const getDateLast12Months = (date: Date) => {
  const last12MonthsDate = new Date(
    date.getFullYear(),
    date.getMonth() - 11,
    1,
  );

  return {
    startDate: last12MonthsDate.toISOString().split("T")[0],
    endDate: date.toISOString().split("T")[0],
  };
};
