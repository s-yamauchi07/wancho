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

export type NewPet = Pick<Pet, 'name' | 'photoUri'>;

export type UpdatePet = Partial<NewPet>;
