import { NavigationContainer } from '@react-navigation/native';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { Text, View } from 'react-native';
import { TamaguiProvider } from 'tamagui';
import { useFonts } from 'expo-font';
import { NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import { db } from '@/db';
import migrations from '@/db/migrations/migrations';
import RootNavigator from '@/navigation/RootNavigator';
import tamaguiConfig from './tamagui.config';

export default function App() {
  const { success, error } = useMigrations(db, migrations);
  const [fontsLoaded] = useFonts({
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
  });

  if (error) {
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }

  if (!success || !fontsLoaded) {
    return (
      <View>
        <Text>Migration is in progress...</Text>
      </View>
    );
  }

  return (
    <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </TamaguiProvider>
  );
}
