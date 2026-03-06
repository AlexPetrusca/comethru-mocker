import { useColorScheme as useDeviceColorScheme } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageKey } from '@/src/constants';

export type ColorScheme = 'light' | 'dark';

interface UseColorSchemeReturn {
  colorScheme: ColorScheme;
  toggleColorScheme: () => Promise<void>;
}

export default function useColorScheme(): UseColorSchemeReturn {
  const systemColorScheme = useDeviceColorScheme();
  const nw = useNativeWindColorScheme();
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>('light');

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem(StorageKey.THEME_KEY);
      if (savedTheme === 'light' || savedTheme === 'dark') {
        nw.setColorScheme(savedTheme);
        setColorSchemeState(savedTheme);
      } else {
        const initial = systemColorScheme === 'dark' ? 'dark' : 'light';
        nw.setColorScheme(initial);
        setColorSchemeState(initial);
      }
    };
    loadTheme();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [systemColorScheme]);

  const toggleColorScheme = useCallback(async () => {
    const newTheme = colorScheme === 'light' ? 'dark' : 'light';
    nw.setColorScheme(newTheme);
    setColorSchemeState(newTheme);
    await AsyncStorage.setItem(StorageKey.THEME_KEY, newTheme);
  }, [colorScheme]);

  return { colorScheme, toggleColorScheme };
}
