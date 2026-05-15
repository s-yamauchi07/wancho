
import PetRegisterScreen from '@/screens/onboarding/PetRegisterScreen';
import WelcomeScreen from '@/screens/onboarding/WelcomeScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { wanchoColors } from '../../tamagui.config';

type OnboardingParamList = {
  Welcome: undefined;
  PetRegister: undefined;
}

const Stack = createNativeStackNavigator<OnboardingParamList>();

export default function OnboardingNavigator() {
  return(
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen
        name="PetRegister"
        component={PetRegisterScreen}
        options={{
          headerShown: true,
          title: '',
          headerBackTitle: '戻る',
          headerStyle: { backgroundColor: wanchoColors.ivory },
          headerTintColor: wanchoColors.sage,
        }}
      />
    </Stack.Navigator>
  )
}