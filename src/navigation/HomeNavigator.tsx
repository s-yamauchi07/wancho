import HomeScreen from "@/screens/home/HomeScreen";
import AllRecordsScreen from "@/screens/record/AllRecordsScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

export type HomeStackParamList = {
  HomeMain: undefined;
  AllRecords: undefined;
}

const Stack = createNativeStackNavigator<HomeStackParamList>();

export default function HomeNavigator() {
  return(
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen 
        name="HomeMain"
        component={HomeScreen}
      />
      <Stack.Screen
        name="AllRecords"
        component={AllRecordsScreen}
      />
    </Stack.Navigator>
  )
}