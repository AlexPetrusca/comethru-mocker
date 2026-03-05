import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/src/hooks/useColorScheme';
import StorageKey from "@/src/constants/StorageKey";
import { api } from "@/src/services/api";
import { StorageProvider, useStorage } from "@/src/providers/StorageProvider";
import { PubSubProvider } from "@/src/providers/PubSubContext";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { storage } = useStorage();
  const [fontLoaded, error] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    try {
      const savedApiUrl = storage[StorageKey.API_URL_KEY];
      if (savedApiUrl != null) {
        api.defaults.baseURL = savedApiUrl;
      }
    } finally {
      setAppIsReady(true);
    }
  }, []);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (fontLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontLoaded]);

  if (!appIsReady || !fontLoaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <PubSubProvider>
      <StorageProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
            <Stack.Screen
              name="messages/[otherParty]"
              options={{
                title: 'Messages',
                headerBackTitle: 'Back',
              }}
            />
            <Stack.Screen
              name="compose"
              options={{
                title: 'New Message',
                presentation: 'modal',
              }}
            />
          </Stack>
        </ThemeProvider>
      </StorageProvider>
    </PubSubProvider>
  );
}
