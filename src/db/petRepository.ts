import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { pets } from '@/db/schema';
import { NewPet, UpdatePet } from '@/types/pet';

export const getPets = async () => {
  return await db.select().from(pets);
};

export const addPet = async (input: NewPet) => {
  // ペット追加後、ペットテーブルの全てのフィールドをreturning()で返す。
  const result = await db.insert(pets).values(input).returning();
  return result[0];
};

export const updatePet = async (id: number, input: UpdatePet) => {
  // ペット更新後、ペットテーブルの全てのフィールドをreturning()で返す。
  const result = await db.update(pets).set(input).where(eq(pets.id, id)).returning();
  return result[0];
};

export const deletePet = async (id: number) => {
  await db.delete(pets).where(eq(pets.id, id));
};
