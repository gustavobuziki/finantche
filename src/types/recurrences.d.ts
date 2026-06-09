export type Recurrence = {
  id: string;
  description: string;
  amount: number;
  category_id: string;
  active: boolean;
  created_at: string;
  user_id: string;
};

export type RecurrencePayload = {
  description: string;
  amount: number;
  category_id: string;
  active?: boolean;
};
