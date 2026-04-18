import { sql } from 'drizzle-orm';
import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const pets = sqliteTable('pets', {
  id: int('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  photoUri: text('photo_uri'),
  birthday: text('birthday'),
  breed: text('breed'),
  gender: text('gender'),
  savingsGoal: int('savings_goal'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const categories = sqliteTable('categories', {
  id: int('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
});

export const expenses = sqliteTable('expenses', {
  id: int('id').primaryKey({ autoIncrement: true }),
  petId: int('pet_id').notNull().references(() => pets.id),
  categoryId: int('category_id').notNull().references(() => categories.id),
  amount: int('amount').notNull(),
  date: text('date').notNull(),
  memo: text('memo'),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const plans = sqliteTable('plans', {
  id: int('id').primaryKey({ autoIncrement: true }),
  petId: int('pet_id').notNull().references(() => pets.id),
  name: text('name').notNull(),
  amount: int('amount').notNull(),
  scheduledMonth: text('scheduled_month').notNull(),
  createdAt: text('created_at').notNull().default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text('updated_at').notNull().default(sql`CURRENT_TIMESTAMP`),
});
