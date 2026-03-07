import React from 'react';
import { Platform } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';
import { useColorScheme as useNativeWindColorScheme } from 'nativewind';
import { themeColors } from '@/src/constants/Colors';
import { ThemeMode } from "@/src/constants";

export default function TabLayout() {
  const { colorScheme } = useNativeWindColorScheme();
  const theme = themeColors[colorScheme || ThemeMode.LIGHT];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.tint,
        tabBarStyle: {
          backgroundColor: theme.navigationBackground,
          borderTopColor: theme.navigationBorder,
          paddingTop: Platform.OS === 'web' ? 8 : 0,
          paddingBottom: Platform.OS === 'web' ? 8 : 0,
          height: Platform.OS === 'web' ? 67 : undefined,
        },
        headerStyle: {
          backgroundColor: theme.navigationBackground,
        },
        headerTintColor: theme.headerTint,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Phone Simulator',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'phone.fill',
                android: 'phone',
                web: 'phone',
              }}
              tintColor={color}
              size={28}
            />
          )
        }}
      />
      <Tabs.Screen
        name="admin"
        options={{
          title: 'Admin Panel',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'person.fill',
                android: 'person',
                web: 'person',
              }}
              tintColor={color}
              size={28}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <SymbolView
              name={{
                ios: 'gearshape.fill',
                android: 'settings',
                web: 'settings',
              }}
              tintColor={color}
              size={28}
            />
          ),
        }}
      />
    </Tabs>
  );
}
