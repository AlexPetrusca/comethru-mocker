import '@/src/global.css';
import 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { useColorScheme as useDeviceColorScheme, View } from 'react-native';
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { api } from "@/src/services";
import { PhoneNumber, StorageKey, ThemeMode } from "@/src/constants";
import { API_BASE_URL } from "@/src/services/api";
import { NotificationProvider, PubSubProvider, SseProvider } from "@/src/providers";
import { themeColors } from '@/src/constants/Colors';
import { SseStatusBanner } from "@/src/components/SseStatusBanner";
import { useNotifications } from "@/src/providers/NotificationProvider";
import { storage } from "@/src/services/storage";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const deviceColorScheme = useDeviceColorScheme();
  const { colorScheme, setColorScheme } = useNativeWindColorScheme();
  const [fontLoaded, error] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [appIsReady, setAppIsReady] = useState(false);

  const theme = themeColors[colorScheme || ThemeMode.LIGHT];

  useEffect(() => {
    if (!storage.contains(StorageKey.API_URL)) {
      storage.set(StorageKey.API_URL, API_BASE_URL);
    }
    if (!storage.contains(StorageKey.PHONE_NUMBER)) {
      storage.set(StorageKey.PHONE_NUMBER, PhoneNumber.DEFAULT);
    }
    if (!storage.contains(StorageKey.THEME)) {
      storage.set(StorageKey.THEME, ThemeMode.SYSTEM);
    }
    api.defaults.baseURL = storage.getString(StorageKey.API_URL);
    setAppIsReady(true);
  }, []);

  useEffect(() => {
    const savedTheme = storage.getString(StorageKey.THEME);
    if (savedTheme === ThemeMode.LIGHT || savedTheme === ThemeMode.DARK) {
      setColorScheme(savedTheme);
    } else {
      // Default to system preference
      setColorScheme(deviceColorScheme === ThemeMode.DARK ? ThemeMode.DARK : ThemeMode.LIGHT);
    }
  }, [deviceColorScheme]);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (colorScheme === ThemeMode.DARK) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      document.body.style.backgroundColor = theme.navigationBackground;
    }
  }, [colorScheme]);

  useEffect(() => {
    if (fontLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontLoaded]);

  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return (
    <PubSubProvider>
      <NotificationProvider>
        <SseProvider>
          <ThemeProvider value={colorScheme === ThemeMode.DARK ? DarkTheme : DefaultTheme}>
            <KeyboardProvider>
              <StatusBar />
              <RootView theme={theme} isReady={appIsReady && fontLoaded} />
            </KeyboardProvider>
          </ThemeProvider>
        </SseProvider>
      </NotificationProvider>
    </PubSubProvider>
  );
}

function RootView({ theme, isReady}: { theme: any, isReady: boolean}) {
  useNotifications();

  if (!isReady) return null;

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <SseStatusBanner />
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            headerStyle: { backgroundColor: theme.navigationBackground },
            headerTintColor: theme.headerTint,
          }}
        />
        <Stack.Screen
          name="messages/[otherParty]"
          options={{
            title: 'Messages',
            headerBackTitle: 'Back',
            headerStyle: { backgroundColor: theme.navigationBackground },
            headerTintColor: theme.headerTint,
          }}
        />
        <Stack.Screen
          name="compose/index"
          options={{
            title: 'New Message',
            presentation: 'modal',
            headerStyle: { backgroundColor: theme.navigationBackground },
            headerTintColor: theme.headerTint,
          }}
        />
      </Stack>
    </View>
  );
}
