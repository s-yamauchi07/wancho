import { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from './TabNavigator'
import OnboardingNavigator from "./OnboardingNavigator";
import { useOnboardingStore } from "@/store/onboardingStore";
import { usePetStore } from "@/store/petStore";

type RootParamList = {
  OnboardingNavigator: undefined;
  TabNavigator: undefined;
}

const Stack = createNativeStackNavigator<RootParamList>();

export default function RootNavigator() {
  const { isFirstLaunch, checkFirstLaunch } = useOnboardingStore();
  const { fetchPets, pets } = usePetStore();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // addPet 等の操作時に isLoading が変わっても Stack.Navigator が
    // アンマウントされないよう、初回ロードのみ isInitialized で管理する。
    Promise.all([checkFirstLaunch(), fetchPets()]).then(() => {
      setIsInitialized(true);
    });
  }, []);

  if (!isInitialized) return null;

  const initialRoute = (isFirstLaunch || pets.length === 0)
    ? 'OnboardingNavigator'
    : 'TabNavigator';

  return(
    <Stack.Navigator
      screenOptions={{ headerShown: false, animation: 'none' }}
      initialRouteName={initialRoute}
    >
      <Stack.Screen name='OnboardingNavigator' component={OnboardingNavigator} />
      <Stack.Screen name='TabNavigator' component={TabNavigator} />
    </Stack.Navigator>
  );
}