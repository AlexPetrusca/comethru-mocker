import { useColorScheme as useDeviceColorScheme } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import { useStorage } from "@/src/providers";
import { StorageKey } from '@/src/constants';

export type ColorScheme = 'light' | 'dark';

interface UseColorSchemeReturn {
  colorScheme: ColorScheme;
  toggleColorScheme: () => Promise<void>;
}

export default function useColorScheme(): UseColorSchemeReturn {
  const systemColorScheme = useDeviceColorScheme();
  const nwColorScheme = useNativeWindColorScheme();
  const [colorScheme, setColorSchemeState] = useState<ColorScheme>('light');
  const { storage, setItem } = useStorage();

  useEffect(() => {
    const savedTheme = storage[StorageKey.THEME_KEY];
    if (savedTheme === 'light' || savedTheme === 'dark') {
      nwColorScheme.setColorScheme(savedTheme);
      setColorSchemeState(savedTheme);
    } else {
      const initial = systemColorScheme === 'dark' ? 'dark' : 'light';
      nwColorScheme.setColorScheme(initial);
      setColorSchemeState(initial);
    }
  }, [systemColorScheme, nwColorScheme]);

  const toggleColorScheme = useCallback(async () => {
    const newTheme = colorScheme === 'light' ? 'dark' : 'light';
    nwColorScheme.setColorScheme(newTheme);
    setColorSchemeState(newTheme);
    await setItem(StorageKey.THEME_KEY, newTheme);
  }, [colorScheme, nwColorScheme]);

  return { colorScheme, toggleColorScheme };
}
