import { ReactNode, useContext, useEffect, useRef, useState } from "react";
import { useColorScheme } from "nativewind";
import { Appearance, AppState, useColorScheme as useColorSchemeNative } from "react-native";
import { DarkTheme, DefaultTheme, ThemeProvider as RnThemeProvider } from '@react-navigation/native';
import { ThemeContext } from "./contexts";
import { StorageKey, Theme, ThemeMode } from "@/src/constants";
import { storage } from "@/src/services/storage";
import { Platform } from "react-native";
import { useMMKVString } from "react-native-mmkv";
import { themeColors } from "@/src/constants/Colors";

const _getColorScheme = Appearance.getColorScheme.bind(Appearance);
let _lastValidScheme = _getColorScheme() ?? 'light';

Appearance.getColorScheme = () => {
  const scheme = _getColorScheme();
  if (scheme == 'unspecified') return _lastValidScheme;
  _lastValidScheme = scheme as any;
  return scheme;
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [storedThemeMode, setStoredThemeMode] = useMMKVString(StorageKey.THEME);
  const [theme, setTheme] = useState(colorScheme);

  useEffect(() => {
    setColorScheme(storage.getString(StorageKey.THEME) as ThemeMode);
  }, []);

  useEffect(() => {
    setTheme(colorScheme);
  }, [colorScheme]);

  useEffect(() => {
    if (Platform.OS === 'web') {
      requestAnimationFrame(() => {
        const root = document.documentElement;
        if (theme === ThemeMode.DARK) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      });
    }
  }, [theme, storedThemeMode]);

  const setThemeMode = (themeMode: ThemeMode) => {
    setColorScheme(themeMode);
    setStoredThemeMode(themeMode);
  };

  return (
    <ThemeContext.Provider value={{
      theme: theme as Theme,
      themeMode: storedThemeMode as ThemeMode,
      themeColors: themeColors[theme as Theme],
      setThemeMode: setThemeMode,
    }}>
      <RnThemeProvider value={theme === ThemeMode.DARK ? DarkTheme : DefaultTheme}>
        {children}
      </RnThemeProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext);
