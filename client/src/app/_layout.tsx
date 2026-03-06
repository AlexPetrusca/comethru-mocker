import '@/src/global.css';
import 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from "@/src/services";
import { StorageKey } from "@/src/constants";
import { StorageProvider, PubSubProvider } from "@/src/providers";
import { themeColors } from '@/src/constants/Colors';

export {
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

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
  const { colorScheme } = useNativeWindColorScheme();
  const theme = themeColors[colorScheme || 'light'];

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (colorScheme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      document.body.style.backgroundColor = theme.navigationBackground;
    }
  }, [colorScheme, theme]);

  return (
    <PubSubProvider>
      <StorageProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <View className="flex-1 bg-white dark:bg-gray-900">
            <Stack>
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                  headerStyle: { backgroundColor: theme.navigationBackground },
                  headerTintColor: theme.headerTintColor,
                }}
              />
              <Stack.Screen
                name="messages/[otherParty]"
                options={{
                  title: 'Messages',
                  headerBackTitle: 'Back',
                  headerStyle: { backgroundColor: theme.navigationBackground },
                  headerTintColor: theme.headerTintColor,
                }}
              />
              <Stack.Screen
                name="compose/index"
                options={{
                  title: 'New Message',
                  presentation: 'modal',
                  headerStyle: { backgroundColor: theme.navigationBackground },
                  headerTintColor: theme.headerTintColor,
                }}
              />
            </Stack>
          </View>
        </ThemeProvider>
      </StorageProvider>
    </PubSubProvider>
  );
}
