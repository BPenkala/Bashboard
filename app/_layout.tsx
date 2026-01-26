import { Poppins_400Regular, Poppins_500Medium, Poppins_700Bold, Poppins_900Black } from '@expo-google-fonts/poppins';
import { useFonts } from 'expo-font';
import * as Haptics from 'expo-haptics';
import { SplashScreen, Stack, usePathname } from 'expo-router';
import { useEffect, useState } from 'react';
import { StatusBar, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppLoader from '../components/AppLoader';
import { theme } from '../constants/Colors';
import { FALLBACK_FONTS } from '../constants/DesignerConstants';
import { DataProvider } from '../context/DataContext';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [showLoader, setShowLoader] = useState(true);
  const [isAppReady, setIsAppReady] = useState(false);
  const pathname = usePathname();

  // [QA] Centralized Font Loading: Fixes "CTFontManagerError 104"
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
    Poppins_900Black,
    ...FALLBACK_FONTS
  });

  useEffect(() => {
    if (!showLoader) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [pathname, showLoader]);

  useEffect(() => {
    async function prepare() {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
        setIsAppReady(true);
      }
    }
    prepare();
  }, [fontsLoaded]);

  // Fail-safe: If fonts take too long, show the app with system fonts
  if (!isAppReady && !fontsLoaded) return null;

  return (
    <DataProvider>
      <SafeAreaProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <View style={{ flex: 1, backgroundColor: theme.canvas }}>
            <StatusBar barStyle="dark-content" />
            {!showLoader ? (
              <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.canvas } }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="invite" />
              </Stack>
            ) : (
              <AppLoader onFinished={() => setShowLoader(false)} />
            )}
          </View>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </DataProvider>
  );
}