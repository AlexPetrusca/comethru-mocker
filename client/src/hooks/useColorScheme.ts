import { useColorScheme as useDeviceColorScheme } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import { StorageKey } from '@/src/constants';
import { useStorage } from "@/src/providers";

export type ColorScheme = 'light' | 'dark';

interface UseColorSchemeReturn {
  colorScheme: ColorScheme;
  toggleColorScheme: () => Promise<void>;
}

export default function useColorScheme(): UseColorSchemeReturn {
  const systemColorScheme = useDeviceColorScheme();
  const nw = useNativeWindColorScheme();
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>('light');
  const { storage, setItem } =  useStorage();

  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = storage[StorageKey.THEME_KEY];
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
  }, [systemColorScheme]);

  const toggleColorScheme = useCallback(async () => {
    const newTheme = colorScheme === 'light' ? 'dark' : 'light';
    nw.setColorScheme(newTheme);
    setColorSchemeState(newTheme);
    await setItem(StorageKey.THEME_KEY, newTheme);
  }, [colorScheme]);

  return { colorScheme, toggleColorScheme };
}
