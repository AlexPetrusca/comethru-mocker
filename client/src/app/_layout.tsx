import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from '@/src/hooks';
import { api } from "@/src/services";
import { StorageKey } from "@/src/constants";
import { StorageProvider, PubSubProvider } from "@/src/providers";

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
  const [fontLoaded, error] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        const savedApiUrl = await AsyncStorage.getItem(StorageKey.API_URL_KEY);
        if (savedApiUrl != null) {
          api.defaults.baseURL = savedApiUrl;
        }
      } finally {
        setAppIsReady(true);
      }
    };
    initializeApp();
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
