import type { ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { QUERY_KEYS } from "@/constants/query-keys";

import { getCategories } from "@/services/categories";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { FormContent } from "./form-content";
import { RecurrencesContent } from "./recurrences-content";

interface Props {
  buttonClose: ReactNode;
}

export function FormExpenses({ buttonClose }: Props) {
  const { data: categories } = useQuery({
    queryFn: getCategories,
    queryKey: [QUERY_KEYS.CATEGORIES],
  });

  const queryClient = useQueryClient();

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.EXPENSES] });
    queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BIGGEST_EXPENSE] });
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.TOTAL_EXPENSES_NEXT_MONTH],
    });
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.TOTAL_EXPENSES_PREVIOUS_MONTH],
    });
    queryClient.invalidateQueries({
      queryKey: [QUERY_KEYS.LAST_12_MONTHS_EXPENSES_TOTAL],
    });
  };

  return (
    <Tabs defaultValue="form" className="w-full">
      <TabsList className="mx-auto">
        <TabsTrigger value="form" className="w-25">
          Criar
        </TabsTrigger>
        <TabsTrigger value="add" className="w-25">
          Adicionar
        </TabsTrigger>
      </TabsList>
      <TabsContent value="form">
        <FormContent
          invalidateQueries={invalidateQueries}
          buttonClose={buttonClose}
          categories={categories}
        />
      </TabsContent>
      <TabsContent value="add">
        <RecurrencesContent
          invalidateQueries={invalidateQueries}
          categories={categories}
        />
      </TabsContent>
    </Tabs>
  );
}
