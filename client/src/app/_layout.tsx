import '@/src/global.css';
import 'react-native-reanimated';
import {useEffect, useState} from 'react';
import {useColorScheme as useDeviceColorScheme, View} from 'react-native';
import {useFonts} from 'expo-font';
import {Stack} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import {DarkTheme, DefaultTheme, ThemeProvider} from '@react-navigation/native';
import {useColorScheme as useNativeWindColorScheme} from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {api} from "@/src/services";
import { StorageKey, ThemeMode } from "@/src/constants";
import { PubSubProvider, SseProvider, StorageProvider } from "@/src/providers";
import {themeColors} from '@/src/constants/Colors';
import { StorageContextData } from "@/src/providers/contexts";
import { SseStatusBanner } from "@/src/components/SseStatusBanner";

export {
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { setColorScheme } = useNativeWindColorScheme();
  const deviceColorScheme = useDeviceColorScheme();
  const [fontLoaded, error] = useFonts({
    SpaceMono: require('../../assets/fonts/SpaceMono-Regular.ttf'),
  });
  const [themeLoaded, setThemeLoaded] = useState(false);
  const [initialStorage, setInitialStorage] = useState<StorageContextData>({} as StorageContextData);
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem(StorageKey.THEME);
      if (savedTheme === ThemeMode.LIGHT || savedTheme === ThemeMode.DARK) {
        setColorScheme(savedTheme);
      } else {
        // Default to system preference
        setColorScheme(deviceColorScheme === ThemeMode.DARK ? ThemeMode.DARK : ThemeMode.LIGHT);
      }
    };
    loadTheme().finally(() => setThemeLoaded(true))
  }, [setColorScheme, deviceColorScheme]);

  useEffect(() => {
    const initializeApp = async () => {
      const keys = await AsyncStorage.getAllKeys();
      const entries = await AsyncStorage.multiGet(keys);
      const data: StorageContextData = {} as StorageContextData;
      entries.forEach(([key, value]) => { data[key as StorageKey] = value; });
      setInitialStorage(data);

      const savedApiUrl = data[StorageKey.API_URL];
      if (savedApiUrl != null) {
        api.defaults.baseURL = savedApiUrl;
      }
    };
    initializeApp().finally(() => setAppIsReady(true));
  }, []);

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (fontLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontLoaded]);

  if (!appIsReady || !themeLoaded || !fontLoaded) {
    return null;
  }

  return <RootLayoutNav initialStorage={initialStorage} />;
}

function RootLayoutNav({ initialStorage }: { initialStorage?: StorageContextData }) {
  const { colorScheme } = useNativeWindColorScheme();
  const theme = themeColors[colorScheme || ThemeMode.LIGHT];

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
  }, [colorScheme, theme]);

  return (
    <PubSubProvider>
      <StorageProvider initialData={initialStorage}>
        <SseProvider>
          <ThemeProvider value={colorScheme === ThemeMode.DARK ? DarkTheme : DefaultTheme}>
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
          </ThemeProvider>
        </SseProvider>
      </StorageProvider>
    </PubSubProvider>
  );
}
