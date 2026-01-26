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
import { DataProvider } from '../context/DataContext';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [showLoader, setShowLoader] = useState(true);
  const [isAppReady, setIsAppReady] = useState(false);
  const pathname = usePathname();

  // [LDEV] TIER 1: Load ONLY local UI fonts here for an instant boot.
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
    Poppins_900Black,
  });

  useEffect(() => {
    if (!showLoader) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }, [pathname, showLoader]);

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
      setIsAppReady(true);
    }
  }, [fontsLoaded]);

  if (!fontsLoaded || !isAppReady) return null;

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