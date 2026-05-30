import { useState, useEffect } from 'react';
import { Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import { TamaguiProvider } from '@tamagui/core'
import { PortalProvider } from '@tamagui/portal'
import { useFonts } from 'expo-font';
import { NotoSansJP_400Regular, NotoSansJP_700Bold } from '@expo-google-fonts/noto-sans-jp';
import { db } from '@/db';
import migrations from '@/db/migrations/migrations';
import RootNavigator from '@/navigation/RootNavigator';
import tamaguiConfig from './tamagui.config';
import ErrorAlertDialog from '@/components/ErrorAlertDialog';

export default function App() {
  const { success, error } = useMigrations(db, migrations);
  const [fontsLoaded, fontError] = useFonts({
    NotoSansJP_400Regular,
    NotoSansJP_700Bold,
  });
  const [fontErrorOpen, setFontErrorOpen] = useState(false);

  useEffect(() => {
    if (fontError) setFontErrorOpen(true);
  }, [fontError]);

  if (error) {
    return (
      <View>
        <Text>Migration error: {error.message}</Text>
      </View>
    );
  }

  if (fontError) {
    return (
      <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
        <PortalProvider>
          <ErrorAlertDialog
            open={fontErrorOpen}
            onOpenChange={setFontErrorOpen}
            title="エラーが発生しました"
            description={fontError.message ?? null}
          />
        </PortalProvider>
      </TamaguiProvider>
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <TamaguiProvider config={tamaguiConfig} defaultTheme="light">
        <PortalProvider>
          <NavigationContainer>
            <RootNavigator />
          </NavigationContainer>
        </PortalProvider>
      </TamaguiProvider>
    </GestureHandlerRootView>
  );
}
