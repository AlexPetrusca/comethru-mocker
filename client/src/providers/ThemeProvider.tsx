import { ReactNode, useContext, useEffect } from "react";
import { useColorScheme } from "nativewind";
import { DarkTheme, DefaultTheme, ThemeProvider as RnThemeProvider } from '@react-navigation/native';
import { ThemeContext } from "./contexts";
import { StorageKey, Theme, ThemeMode } from "@/src/constants";
import { storage } from "@/src/services/storage";
import { Platform } from "react-native";
import { useMMKVString } from "react-native-mmkv";
import { themeColors } from "@/src/constants/Colors";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { colorScheme, setColorScheme } = useColorScheme();
  const [storedThemeMode, setStoredThemeMode] = useMMKVString(StorageKey.THEME);

  useEffect(() => {
    if (Platform.OS === 'web') {
      setColorScheme(storage.getString(StorageKey.THEME) as "light" | "dark" | "system");
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === 'web') {
      requestAnimationFrame(() => {
        const root = document.documentElement;
        if (colorScheme === ThemeMode.DARK) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      });
    }
  }, [colorScheme, storedThemeMode]);

  const setThemeMode = (themeMode: ThemeMode) => {
    setStoredThemeMode(themeMode);
    setColorScheme(themeMode);
  };

  console.log(colorScheme, storedThemeMode);

  return (
    <ThemeContext.Provider value={{
      theme: colorScheme as Theme,
      themeMode: storedThemeMode as ThemeMode,
      themeColors: themeColors[colorScheme as Theme],
      setThemeMode: setThemeMode
    }}>
      <RnThemeProvider value={colorScheme === ThemeMode.DARK ? DarkTheme : DefaultTheme}>
        {children}
      </RnThemeProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext);
