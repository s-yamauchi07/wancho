import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '@/screens/home/HomeScreen';
import PlannerScreen from '@/screens/planner/PlannerScreen';
import ReportScreen from '@/screens/report/ReportScreen';
import SettingsScreen from '@/screens/settings/SettingsScreen';
import RecordNavigator from './RecordNavigator';

export type TabParamList = {
  Home: undefined;
  Record: undefined;
  Planner: undefined;
  Report: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

export default function TabNavigator() {
  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen 
        name="Home"
        component={HomeScreen} 
        options={{
          title: 'ホーム',
        }}
      />
      <Tab.Screen 
        name="Record"
        component={RecordNavigator} 
        options={{
          title: '記録',
        }}
      />
      <Tab.Screen 
        name="Report"
        component={ReportScreen} 
        options={{
          title: 'レポート',
        }}
      />
      <Tab.Screen 
        name="Planner"
        component={PlannerScreen} 
        options={{
          title: 'プランナー',
        }}
      />
      <Tab.Screen 
        name="Settings"
        component={SettingsScreen}
        options={{
          title: '設定',
        }}
      />
    </Tab.Navigator>
  );
}
