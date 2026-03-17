import '@/src/global.css';
import 'react-native-reanimated';
import { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import { KeyboardProvider } from "react-native-keyboard-controller";
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from 'expo-splash-screen';
import { api } from "@/src/services";
import { PhoneNumber, StorageKey, ThemeMode } from "@/src/constants";
import { API_BASE_URL } from "@/src/services/api";
import { NotificationProvider, PubSubProvider, SseProvider, ThemeProvider } from "@/src/providers";
import { SseStatusBanner } from "@/src/components/SseStatusBanner";
import { useNotifications } from "@/src/providers/NotificationProvider";
import { storage } from "@/src/services/storage";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontLoaded, error] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    // todo: We're init-ing storage on mount.
    //  - What happens when providers try to read from storage?
    //  - Race condition?

    // init mmkv storage
    if (!storage.contains(StorageKey.API_URL)) {
      storage.set(StorageKey.API_URL, API_BASE_URL);
    }
    if (!storage.contains(StorageKey.PHONE_NUMBER)) {
      storage.set(StorageKey.PHONE_NUMBER, PhoneNumber.DEFAULT);
    }
    if (!storage.contains(StorageKey.THEME)) {
      storage.set(StorageKey.THEME, ThemeMode.SYSTEM);
    }

    // init global state
    api.defaults.baseURL = storage.getString(StorageKey.API_URL);

    setAppIsReady(true);
  }, []);

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
          <ThemeProvider>
            <KeyboardProvider>
              <StatusBar />
              <RootView appIsReady={appIsReady && fontLoaded} />
            </KeyboardProvider>
          </ThemeProvider>
        </SseProvider>
      </NotificationProvider>
    </PubSubProvider>
  );
}

function RootView({appIsReady}: {appIsReady: boolean}) {
  useNotifications();

  if (!appIsReady) return null;

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <SseStatusBanner />
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="messages/[otherParty]"
          options={{
            title: 'Messages',
            headerBackTitle: 'Back',
          }}
        />
        <Stack.Screen
          name="compose/index"
          options={{
            title: 'New Message',
            presentation: 'modal',
          }}
        />
      </Stack>
    </View>
  );
}
