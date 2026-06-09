import { parseAsString, useQueryState } from "nuqs";

function getCurrentPeriod() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export function usePeriod() {
  const [period, setPeriod] = useQueryState(
    "period",
    parseAsString.withDefault(getCurrentPeriod()),
  );

  const [year, month] = period.split("-").map(Number);

  return {
    period,
    year,
    month,
    setPeriod,
  };
}
