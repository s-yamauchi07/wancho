import { create } from 'zustand';
import { Expense, NewExpense, UpdateExpense } from '@/types/expense';
import { getExpenses, addExpense, updateExpense, deleteExpense, getExpensesByMonth } from '@/db/expenseRepository';

type ExpenseState = {
  expenses: Expense[];
  monthlyExpenses: Expense[];
  selectedMonth: string;
  isLoading: boolean;
  error: string | null;
};

type ExpenseActions = {
  fetchExpenses: () => Promise<void>;
  fetchExpensesByMonth: (yearMonth: string) => Promise<void>;
  setSelectedMonth: (yearMonth: string) => void;
  addExpense: (input: NewExpense) => Promise<void>;
  updateExpense: (id: number, input: UpdateExpense) => Promise<void>;
  deleteExpense: (id: number) => Promise<void>;
};

export const useExpenseStore = create<ExpenseState & ExpenseActions>((set) => {
  // 月別データの再取得をして月別データも更新する
  const refreshMonthlyExpenses = async () => {
    const { selectedMonth } = useExpenseStore.getState();
    const monthlyData = await getExpensesByMonth(selectedMonth);
    set({ monthlyExpenses: monthlyData });
  };

  return {
    expenses: [],
    monthlyExpenses:[],
    selectedMonth: new Date().toISOString().slice(0,7),
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

    // 1ヶ月分の支出を抽出するAction
    fetchExpensesByMonth: async (yearMonth: string) => {
      set({ isLoading: true, error: null});
      try {
        const data = await getExpensesByMonth(yearMonth);
        set({ monthlyExpenses: data});
      } catch(e) {
        set({ error: '支出の取得に失敗しました'});
      } finally {
        set({ isLoading: false});
      }
    },

    // 月を選択するAction
    setSelectedMonth: (yearMonth: string) => {
      set({ selectedMonth: yearMonth });
    },

    addExpense: async (input) => {
      set({ isLoading: true, error: null });
      try {
        const newExpense = await addExpense(input);
        // 全期間のstateに費用を追加する
        set((state) => ({ expenses: [...state.expenses, newExpense] }));

        // 月別データの再取得をして月別データも更新する
        await refreshMonthlyExpenses();
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
        await refreshMonthlyExpenses();
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
        await refreshMonthlyExpenses();
      } catch (e) {
        set({ error: '支出の削除に失敗しました' });
      } finally {
        set({ isLoading: false });
      }
    },
  };
});
