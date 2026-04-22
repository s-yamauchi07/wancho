import { create } from 'zustand';
import { Expense, NewExpense, UpdateExpense } from '@/types/expense';
import { getExpenses, addExpense, updateExpense, deleteExpense } from '@/db/expenseRepository';

type ExpenseState = {
  expenses: Expense[];
  isLoading: boolean;
  error: string | null;
};

type ExpenseActions = {
  fetchExpenses: () => Promise<void>;
  addExpense: (input: NewExpense) => Promise<void>;
  updateExpense: (id: number, input: UpdateExpense) => Promise<void>;
  deleteExpense: (id: number) => Promise<void>;
};

export const useExpenseStore = create<ExpenseState & ExpenseActions>((set) => ({
  expenses: [],
  isLoading: false,
  error: null,

  fetchExpenses: async () => {
    set({ isLoading: true, error: null});
    try {
      const data = await getExpenses();
      set({ expenses: data });
    } catch (e) {
      set({ error: '支出の取得に失敗しました'});
    } finally {
      set({ isLoading: false});
    }
  },

  addExpense: async (input) => {
    set({ isLoading: true, error: null });
    try {
      const newExpense = await addExpense(input);
      set((state) => ({ expenses: [...state.expenses, newExpense] }));
    } catch (e) {
      set({ error: '支出の追加に失敗しました' });
    } finally {
      set({ isLoading: false });
    }
  },

  updateExpense: async (id, input) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await updateExpense(id, input);
      set((state) => ({
        expenses: state.expenses.map((expense) => (expense.id === id ? updated : expense)),
      }));
    } catch (e) {
      set({ error: '支出情報の更新に失敗しました' });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteExpense: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deleteExpense(id);
      set((state) => ({
        expenses: state.expenses.filter((expense) => expense.id !== id),
      }));
    } catch (e) {
      set({ error: '支出の削除に失敗しました' });
    } finally {
      set({ isLoading: false });
    }
  },
}));
