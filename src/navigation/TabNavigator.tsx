import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import PlannerScreen from '@/screens/planner/PlannerScreen';
import ReportScreen from '@/screens/report/ReportScreen';
import SettingsScreen from '@/screens/settings/SettingsScreen';
import HomeNavigator from './HomeNavigator';
import RecordScreen from '@/screens/record/RecordScreen';

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
        component={HomeNavigator} 
        options={{
          title: 'ホーム',
        }}
      />
      <Tab.Screen 
        name="Record"
        component={RecordScreen} 
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
