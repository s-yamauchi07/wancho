import { useEffect } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from './TabNavigator'
import OnboardingNavigator from "./OnboardingNavigator";
import { useOnboardingStore } from "@/store/onboardingStore";

type RootParamList = {
  OnboardingNavigator: undefined;
  TabNavigator: undefined;
}

const Stack = createNativeStackNavigator<RootParamList>();

export default function RootNavigator() {
  const { isFirstLaunch, checkFirstLaunch } = useOnboardingStore();
  
  useEffect(() => {
    checkFirstLaunch();
  },[]);
  // useOnboardingStoreは非同期のため、AsyncStorageの読み込み完了までisFirstLaunchがnull.
  // 現状null = false判定と同じ扱いになるため、TabNavigationが表示されないように早期returnする。
  // FIXME: 今後LoadingIndicatorなどでUIを整える
  if (isFirstLaunch === null) return null;

  return(
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isFirstLaunch ? (
        <Stack.Screen name='OnboardingNavigator' component={OnboardingNavigator} />
      ) : (
        <Stack.Screen name='TabNavigator' component={TabNavigator} />
      )}
    </Stack.Navigator>
  );
}