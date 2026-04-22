export type Expense = {
  id: number;
  petId: number;
  categoryId: number;
  amount: number;
  date: string;
  memo: string | null;
  createdAt: string;
  updatedAt: string;
};

export type NewExpense = Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdateExpense = Partial<NewExpense>;