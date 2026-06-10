import { useTheme } from "next-themes";
import { MoonIcon, SquareArrowRightExit, SunIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MONTHS, YEARS } from "@/constants/dates";
import { Button } from "./button";
import { Avatar, AvatarFallback } from "./avatar";

import { ModalCategories } from "../categories/modal-create-category";
import { postLogout } from "@/services/auth";
import { useAuthStore } from "@/store/auth-store";

import LogoDark from "@/assets/logo-dark-finantche.png";
import LogoLight from "@/assets/logo-light-finantche.png";
import { usePeriod } from "@/hooks/use-period";
import { useIsMobile } from "@/hooks/use-mobile";

export function Header() {
  const { theme, systemTheme, setTheme } = useTheme();
  const darkMode =
    theme === "dark" || (theme === "system" && systemTheme === "dark");
  const { session, setSession } = useAuthStore();
  const navigate = useNavigate();
  const { year, month, setPeriod } = usePeriod();
  const isMobile = useIsMobile();

  const [isLoading, setIsLoading] = useState(false);

  const changeTheme = () => {
    setTheme(darkMode ? "light" : "dark");
  };

  const currentMonth = month;
  const currentYear = year;

  const handleLogout = async () => {
    setIsLoading(true);

    try {
      await postLogout();
      setSession(null);
      navigate("/login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="flex flex-row justify-between items-center -mt-3">
      <img
        src={darkMode ? LogoDark : LogoLight}
        alt="Logo"
        width={180}
        height="auto"
      />
      {!isMobile && (
        <div className="flex gap-1 items-center ml-auto mr-2">
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
      )}
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={changeTheme}>
          {darkMode ? <SunIcon size={16} /> : <MoonIcon size={16} />}
        </Button>
        <div className="flex flex-row gap-2">
          <Popover>
            <PopoverTrigger asChild className="cursor-pointer">
              <Avatar size="lg">
                <AvatarFallback>GB</AvatarFallback>
              </Avatar>
            </PopoverTrigger>
            <PopoverContent className=" mt-2 mr-4">
              <div className="flex flex-col items-center">
                <Avatar className="w-16 h-16 mb-2">
                  <AvatarFallback className="text-xl">GB</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">Gustavo Buziki</span>
                <span className="text-xs text-gray-400">gbuziki@gmail.com</span>
              </div>
              <div className="flex flex-col gap-1">
                <ModalCategories />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleLogout}
                  isLoading={isLoading}
                >
                  <SquareArrowRightExit size={14} />
                  Logout
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {!isMobile && (
            <div className="flex flex-col gap-0">
            <span className="text-sm font-medium">
              {session?.user?.user_metadata?.name}
            </span>
            <span className="text-xs text-gray-400">
              {session?.user?.email}
            </span>
          </div>
          )}
        </div>
      </div>
    </header>
  );
}
