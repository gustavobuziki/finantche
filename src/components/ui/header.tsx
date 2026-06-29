import { MoonIcon, SquareArrowRightExit, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import LogoDark from "@/assets/logo-dark-finantche.png";
import LogoLight from "@/assets/logo-light-finantche.png";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useIsMobile } from "@/hooks/use-mobile";
import { postLogout } from "@/services/auth";
import { useAuthStore } from "@/store/auth-store";

import { ModalCategories } from "../categories/modal-create-category";
import { DateSelector } from "../expenses/date-selector";
import { Avatar, AvatarFallback } from "./avatar";
import { Button } from "./button";

export function Header() {
  const { theme, systemTheme, setTheme } = useTheme();
  const darkMode =
    theme === "dark" || (theme === "system" && systemTheme === "dark");
  const { session, setSession } = useAuthStore();
  const navigate = useNavigate();

  const isMobile = useIsMobile();

  const [isLoading, setIsLoading] = useState(false);

  const changeTheme = () => {
    setTheme(darkMode ? "light" : "dark");
  };

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
      <div className="ml-auto mr-2">
        <DateSelector />
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={changeTheme}>
          {darkMode ? (
            <SunIcon size={16} className="text-gray-600 dark:text-gray-200" />
          ) : (
            <MoonIcon size={16} className="text-gray-600 dark:text-gray-200" />
          )}
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
