import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

type OnboardingState = {
  isFirstLaunch: boolean | null;
  isLoading: boolean;
  error: string | null;
}

type OnboardingAction = {
  checkFirstLaunch: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

const ONBOARDING_KEY = 'hasLaunched';

export const useOnboardingStore = create<OnboardingState & OnboardingAction>((set) => ({
  isFirstLaunch: null,
  isLoading: false,
  error: null,
  
  checkFirstLaunch: async () => {
    set({ isLoading: true, error: null})
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      set({ isFirstLaunch: value === null });
    } catch(e) {
      set({error:  'データの取得に失敗しました'})
    } finally {
      set({ isLoading: false});
    }
  },

  completeOnboarding: async () => {
    set({ isLoading: true, error: null})
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      set({ isFirstLaunch: false })
    } catch(e) {
      set({ error: 'データの更新に失敗しました'})
    } finally {
      set({ isLoading: false });
    }
  }
}));