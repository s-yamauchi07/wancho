import { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from './TabNavigator'
import OnboardingNavigator from "./OnboardingNavigator";
import { useOnboardingStore } from "@/store/onboardingStore";
import { usePetStore } from "@/store/petStore";
import ErrorAlertDialog from "@/components/ErrorAlertDialog";

type RootParamList = {
  OnboardingNavigator: undefined;
  TabNavigator: undefined;
}

const Stack = createNativeStackNavigator<RootParamList>();

export default function RootNavigator() {
  const { isFirstLaunch, checkFirstLaunch } = useOnboardingStore();
  const { fetchPets, pets } = usePetStore();
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    // addPet 等の操作時に isLoading が変わっても Stack.Navigator が
    // アンマウントされないよう、初回ロードのみ isInitialized で管理する。
    Promise.all([checkFirstLaunch(), fetchPets()])
      .then(() => {
        setIsInitialized(true);
      })
      .catch((error) => {
        console.error('Initialization failed:', error);
        setInitError('アプリの起動に失敗しました。アプリを再起動してください。');
      });
  }, []);

  if (initError) {
    return (
      <ErrorAlertDialog
        open={true}
        onOpenChange={() => {}}
        title="エラーが発生しました"
        description={initError}
      />
    );
  }

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