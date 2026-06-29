import { CalendarDays } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MONTHS, YEARS } from "@/constants/dates";
import { useIsMobile } from "@/hooks/use-mobile";
import { usePeriod } from "@/hooks/use-period";

export function DateSelector() {
  const isMobile = useIsMobile();
  const { year, month, setPeriod } = usePeriod();

  const currentMonth = month;
  const currentYear = year;

  return isMobile ? (
    <Popover>
      <PopoverTrigger asChild className="cursor-pointer">
        <CalendarDays size={16} className="text-gray-600 dark:text-gray-200" />
      </PopoverTrigger>
      <PopoverContent className="w-full flex justify-center items-center mt-4 mr-4">
        <Select
          value={currentMonth.toString()}
          onValueChange={(value) =>
            setPeriod(`${currentYear}-${String(value).padStart(2, "0")}`)
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Mês" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {MONTHS.map((month) => (
                <SelectItem key={month.value} value={month.value}>
                  {month.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select
          value={currentYear.toString()}
          onValueChange={(value) =>
            setPeriod(
              `${String(value).padStart(4, "0")}-${String(currentMonth).padStart(2, "0")}`,
            )
          }
        >
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {YEARS.map((year) => (
                <SelectItem key={year.value} value={year.value}>
                  {year.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </PopoverContent>
    </Popover>
  ) : (
    <div className="flex gap-1 items-center">
      <Select
        value={currentMonth.toString()}
        onValueChange={(value) =>
          setPeriod(`${currentYear}-${String(value).padStart(2, "0")}`)
        }
      >
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Mês" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {MONTHS.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
      <Select
        value={currentYear.toString()}
        onValueChange={(value) =>
          setPeriod(
            `${String(value).padStart(4, "0")}-${String(currentMonth).padStart(2, "0")}`,
          )
        }
      >
        <SelectTrigger className="w-20">
          <SelectValue placeholder="Ano" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {YEARS.map((year) => (
              <SelectItem key={year.value} value={year.value}>
                {year.label}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
