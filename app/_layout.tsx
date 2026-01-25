import { useCallback } from 'react';
import { View, StatusBar } from 'react-native'; 
import { Stack, SplashScreen } from 'expo-router';
import { useFonts } from 'expo-font';
import { GestureHandlerRootView } from 'react-native-gesture-handler'; // <--- NEW IMPORT
import { 
  Poppins_400Regular, 
  Poppins_500Medium, 
  Poppins_700Bold, 
  Poppins_900Black 
} from '@expo-google-fonts/poppins';

import { DataProvider } from '../context/DataContext';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold,
    Poppins_900Black,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <DataProvider>
      {/* CRITICAL: GestureHandlerRootView must wrap the entire app 
          for drag-and-drop to work on Android/iOS without crashes.
      */}
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View onLayout={onLayoutRootView} style={{ flex: 1, backgroundColor: '#FBF5DE' }}>
          <StatusBar barStyle="dark-content" />
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'slide_from_right',
              contentStyle: { backgroundColor: '#FBF5DE' },
              gestureEnabled: true,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="invite" />
            <Stack.Screen name="guests" />
            <Stack.Screen name="registry" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="kanban" />
            <Stack.Screen name="event/[id]" /> 
          </Stack>
        </View>
      </GestureHandlerRootView>
    </DataProvider>
  );
}