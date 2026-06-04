import { create } from "zustand";

type GlobalStore = {
  monthSelected: number;
  setMonthSelected: (month: number) => void;
  yearSelected: number;
  setYearSelected: (year: number) => void;
};

export const useGlobalStore = create<GlobalStore>((set) => ({
  monthSelected: new Date().getMonth() + 1,
  setMonthSelected: (month: number) => set({ monthSelected: month }),
  yearSelected: new Date().getFullYear(),
  setYearSelected: (year: number) => set({ yearSelected: year }),
}));
