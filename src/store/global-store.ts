import { create } from "zustand";

type GlobalStore = {
  dateSelected: Date;
  setDateSelected: (date: Date) => void;
  changeSelectedDate: (date: Date) => void;
};

const changeSelectedDate = (date: Date) => {
  const { setDateSelected } = useGlobalStore.getState();

  setDateSelected(date);
};

export const useGlobalStore = create<GlobalStore>((set) => ({
  dateSelected: new Date(),
  setDateSelected: (date) => set({ dateSelected: date }),
  changeSelectedDate,
}));
