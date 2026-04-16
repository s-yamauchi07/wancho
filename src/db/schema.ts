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
