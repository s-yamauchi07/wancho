import { eq } from 'drizzle-orm';
import { expenses } from '@/db/schema';
import { db } from '@/db';
import { NewExpense, UpdateExpense } from '@/types/expense';

export const getExpenses = async () => {
  return await db.select().from(expenses);
};

export const addExpense = async (input: NewExpense) => {
  const result = await db.insert(expenses).values(input).returning();
  return result[0];
};

export const updateExpense = async (id: number, input: UpdateExpense) => {
  const result = await db.update(expenses).set(input).where(eq(expenses.id, id)).returning();
  return result[0];
};

export const deleteExpense = async (id: number) => {
  await db.delete(expenses).where(eq(expenses.id, id));
};
