import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold,
  Poppins_900Black
} from '@expo-google-fonts/poppins';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, usePathname } from 'expo-router'; // Added usePathname
import { useEffect, useState } from 'react';
import { StatusBar, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import * as Haptics from 'expo-haptics'; // Direct import for global setting check
import AppLoader from '../components/AppLoader';
import { DataProvider } from '../context/DataContext';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [showLoader, setShowLoader] = useState(true);
  const [isAppReady, setIsAppReady] = useState(false);
  const pathname = usePathname();

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
    Poppins_900Black,
  });

  // Haptic "Thud" on screen transitions
  // Note: We don't use useHaptics here because the hook requires DataProvider 
  // and we are currently at the same level as the provider.
  useEffect(() => {
    if (!showLoader) {
      // Provides tactile confirmation of navigation
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [pathname]);

  useEffect(() => {
    async function prepare() {
      if (fontsLoaded) {
        await new Promise(resolve => setTimeout(resolve, 200));
        await SplashScreen.hideAsync();
        setIsAppReady(true);
      }
    }
    prepare();
  }, [fontsLoaded]);

  if (!fontsLoaded || !isAppReady) {
    return null;
  }

  return (
    <DataProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, backgroundColor: '#FBF5DE' }}>
          <StatusBar barStyle="dark-content" />
          
          {!showLoader ? (
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right', // Forward = Right, Back = Left
                animationDuration: 350,
                contentStyle: { backgroundColor: '#FBF5DE' },
                gestureEnabled: true,
                gestureDirection: 'horizontal',
              }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="invite" />
              <Stack.Screen name="event/[id]" />
              <Stack.Screen name="guests" />
              <Stack.Screen name="kanban" />
              <Stack.Screen name="profile" />
              <Stack.Screen name="registry" />
            </Stack>
          ) : (
            <AppLoader onFinished={() => setShowLoader(false)} />
          )}
        </View>
      </GestureHandlerRootView>
    </DataProvider>
  );
}