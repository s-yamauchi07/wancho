import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '@/screens/home/HomeScreen';
import RecordScreen from '@/screens/record/RecordScreen';
import PlannerScreen from '@/screens/planner/PlannerScreen';
import ReportScreen from '@/screens/report/ReportScreen';
import SettingsScreen from '@/screens/settings/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator initialRouteName="ホーム">
      <Tab.Screen name="ホーム" component={HomeScreen} />
      <Tab.Screen name="記録" component={RecordScreen} />
      <Tab.Screen name="プランナー" component={PlannerScreen} />
      <Tab.Screen name="レポート" component={ReportScreen} />
      <Tab.Screen name="設定" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
