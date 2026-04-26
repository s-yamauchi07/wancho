import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = 'hasLaunched';

export const useOnboarding = () => {
  const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

  useEffect(() => {
    // 初回ユーザーかどうかの判定。value == nullの場合は初回ユーザー。
    const checkFirstLaunch = async () => {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      setIsFirstLaunch(value === null);
    };
    checkFirstLaunch();
  }, []);

  // onboarding完了時にフラグをtrueにする。
  const completeOnboarding = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    setIsFirstLaunch(false);
  };

  return { isFirstLaunch, completeOnboarding };
};
