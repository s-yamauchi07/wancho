import { create } from 'zustand';
import { Pet, NewPet, UpdatePet } from '@/types/pet';
import { getPets, addPet, updatePet, deletePet } from '@/db/petRepository';

// ペットの状態(state)を管理する型
type PetState = {
  pets: Pet[];
  isLoading: boolean;
  error: string | null;
};

// Actionの型
type PetActions = {
  fetchPets: () => Promise<void>;
  addPet: (input: NewPet) => Promise<boolean>;
  updatePet: (id: number, input: UpdatePet) => Promise<void>;
  deletePet: (id: number) => Promise<void>;
};

// 状態とアクションを管理するStoreの定義。
export const usePetStore = create<PetState & PetActions>((set) => ({
  pets: [],
  isLoading: false,
  error: null,

  fetchPets: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getPets();
      set({ pets: data });
    } catch (e) {
      set({ error: 'ペット情報の取得に失敗しました' });
    } finally {
      set({ isLoading: false });
    }
  },

  addPet: async (input) => {
    set({ isLoading: true, error: null });
    try {
      const newPet = await addPet(input);
      set((state) => ({ pets: [...state.pets, newPet] }));
      return true;
    } catch (e) {
      set({ error: 'ペットの登録に失敗しました' });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  updatePet: async (id, input) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await updatePet(id, input);
      set((state) => ({
        pets: state.pets.map((pet) => (pet.id === id ? updated : pet)),
      }));
    } catch (e) {
      set({ error: 'ペット情報の更新に失敗しました' });
    } finally {
      set({ isLoading: false });
    }
  },

  deletePet: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await deletePet(id);
      set((state) => ({
        pets: state.pets.filter((pet) => pet.id !== id),
      }));
    } catch (e) {
      set({ error: 'ペットの削除に失敗しました' });
    } finally {
      set({ isLoading: false });
    }
  },
}));
