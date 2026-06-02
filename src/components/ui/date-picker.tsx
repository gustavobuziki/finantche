"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  value?: Date;
  onChange?: (date: Date) => void;
  error?: boolean;
}

export function DatePicker({ onChange, value, error }: Props) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          data-empty={!value}
          aria-invalid={error}
          className="w-full justify-start text-left font-normal data-[empty=true]:text-muted-foreground border-input bg-input/30 hover:bg-input/30 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40"
        >
          <CalendarIcon className="mr-0.5" />
          {value ? (
            format(value, "PPP", { locale: ptBR })
          ) : (
            <span>Escolher data...</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={value}
          onSelect={onChange}
          locale={ptBR}
        />
      </PopoverContent>
    </Popover>
  );
}
