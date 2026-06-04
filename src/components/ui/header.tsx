import { useState } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MONTHS, YEARS } from "@/constants/dates";
import { Button } from "./button";
import { Avatar, AvatarFallback } from "./avatar";

import LogoDark from "@/assets/logo-dark-finantche.png";
import LogoLight from "@/assets/logo-light-finantche.png";

export function Header() {
  const { theme, setTheme } = useTheme();
  const darkMode = theme === "dark";

  const currentMonth = new Date().toLocaleString("pt-BR", { month: "numeric" });
  const [monthValue, setMonthValue] = useState(currentMonth);
  const [yearValue, setYearValue] = useState(
    new Date().getFullYear().toString(),
  );

  const changeTheme = () => {
    setTheme(darkMode ? "light" : "dark");
  };

  return (
    <header className="flex flex-row justify-between items-center">
      <img
        src={darkMode ? LogoDark : LogoLight}
        alt="Logo"
        width={180}
        height="auto"
      />

      <div className="flex gap-1 items-center ml-auto mr-4">
        <Select value={monthValue} onValueChange={setMonthValue}>
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
        <Select value={yearValue} onValueChange={setYearValue}>
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
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={changeTheme}>
          {darkMode ? <SunIcon size={16} /> : <MoonIcon size={16} />}
        </Button>
        <div className="flex flex-row gap-2">
          <Avatar size="lg">
            <AvatarFallback>GB</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-0">
            <span className="text-sm font-medium">Gustavo Buziki</span>
            <span className="text-xs text-gray-400">gbuziki@gmail.com</span>
          </div>
        </div>
      </div>
    </header>
  );
}
