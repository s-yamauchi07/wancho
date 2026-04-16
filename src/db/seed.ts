import { db } from './index';
import { categories } from './schema';

export const seedCategories = async () => {
  const existing = await db.select().from(categories);
  if (existing.length > 0) return;

  await db.insert(categories).values([
    { name: 'フード' },
    { name: 'おやつ' },
    { name: '医療費' },
    { name: 'トリミング' },
    { name: 'ペット保険' },
    { name: 'おもちゃ・服' },
    { name: '日用品' },
    { name: 'ペットホテル' },
    { name: 'その他' },
  ]);
};
