export type Pet = {
  id: number;
  name: string;
  photoUri: string | null;
  birthday: string | null;
  breed: string | null;
  gender: string | null;
  savingsGoal: number | null;
  createdAt: string;
  updatedAt: string;
};

export type NewPet = Omit<Pet, 'id' | 'createdAt' | 'updatedAt'>;

export type UpdatePet = Partial<NewPet>;
