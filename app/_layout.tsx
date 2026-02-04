import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Tabs } from 'expo-router'; // SPC FIX: Using Tabs instead of Stack
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import 'react-native-reanimated';

// SPC FIX: Ensure this path resolves to the file created above
import BashboardTabBar from '../components/BashboardTabBar';
import { DataProvider } from '../context/DataContext';
import { useColorScheme } from '../hooks/use-color-scheme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    // SPC FIX: Root gesture handler needed for Editor pan/pinch
    <GestureHandlerRootView style={styles.container}>
      <KeyboardProvider>
        <DataProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            <Tabs
              tabBar={(props) => <BashboardTabBar {...props} />}
              screenOptions={{
                headerShown: false,
              }}
            >
              {/* Slot 1: Event Hub */}
              <Tabs.Screen name="index" options={{ title: 'Home' }} />
              
              {/* Slot 2: Planner */}
              <Tabs.Screen name="kanban" options={{ title: 'Planner' }} />
              
              {/* Slot 4: Studio (Mapped to registry) */}
              <Tabs.Screen name="registry" options={{ title: 'Studio' }} />
              
              {/* Slot 5: Guest List */}
              <Tabs.Screen name="guests" options={{ title: 'Guests' }} />

              {/* EDITOR: Hidden from tabs to allow full screen */}
              <Tabs.Screen 
                name="invite" 
                options={{ 
                  href: null, 
                  tabBarStyle: { display: 'none' } 
                }} 
              />

              {/* UTILITY: Hidden Routes */}
              <Tabs.Screen name="event/[id]" options={{ href: null, tabBarStyle: { display: 'none' } }} />
              <Tabs.Screen name="modal" options={{ href: null }} />
              <Tabs.Screen name="profile" options={{ href: null }} />
              <Tabs.Screen name="rsvp" options={{ href: null }} />
              <Tabs.Screen name="+not-found" options={{ href: null }} />
            </Tabs>
            <StatusBar style="auto" />
          </ThemeProvider>
        </DataProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});