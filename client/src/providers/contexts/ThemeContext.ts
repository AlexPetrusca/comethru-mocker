import { createContext } from 'react';
import { themeColors, ThemeColors } from "@/src/constants/Colors";
import { Theme, ThemeMode } from "@/src/constants";

export interface ThemeContextType {
  theme: Theme;
  themeMode: ThemeMode;
  themeColors: ThemeColors;
  setThemeMode: (themeMode: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: Theme.LIGHT,
  themeMode: ThemeMode.LIGHT,
  themeColors: themeColors.light,
  setThemeMode: () => {}
});
