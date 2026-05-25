import AllRecordsScreen from "@/screens/record/AllRecordsScreen";
import RecordScreen from "@/screens/record/RecordScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { wanchoColors } from "tamagui.config";

export type RecordStackParamList = {
  RecordMain: undefined;
  AllRecords: undefined;
}

const Stack = createNativeStackNavigator<RecordStackParamList>();

export default function RecordNavigator() {
  return(
    <Stack.Navigator screenOptions={{ headerShown: false}}>
      <Stack.Screen 
        name='RecordMain'
        component={RecordScreen}
      />
      <Stack.Screen 
        name='AllRecords'
        component={AllRecordsScreen}
        options={{
          headerShown: true,
          title:'',
          headerBackTitle: '戻る',
          headerStyle: { backgroundColor: wanchoColors.ivory },
          headerTintColor: wanchoColors.sage,
        }}
      />
    </Stack.Navigator>
  )
}