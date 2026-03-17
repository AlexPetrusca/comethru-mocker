import React from 'react';
import { Platform } from 'react-native';
import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';
import { useTheme } from "@/src/providers/ThemeProvider";

export default function TabLayout() {
  const { themeColors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: themeColors.tint,
        tabBarStyle: {
          backgroundColor: themeColors.navigationBackground,
          borderTopColor: themeColors.navigationBorder,
          paddingTop: Platform.OS === 'web' ? 10 : 0,
          paddingBottom: Platform.OS === 'web' ? 10 : 0,
          minHeight: Platform.OS === 'web' ? 72 : 'auto'
        },
        headerStyle: {
          backgroundColor: themeColors.navigationBackground,
        },
        headerTintColor: themeColors.headerTint,
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
