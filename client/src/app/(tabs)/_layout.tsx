import React from 'react';
import { SymbolView } from 'expo-symbols';
import { Tabs } from 'expo-router';
import { themeColors } from '@/src/constants/Colors';
import { useColorScheme } from '@/src/hooks';

export default function TabLayout() {
  const { colorScheme } = useColorScheme();

  const theme = themeColors[colorScheme];
  const themeConfig = {
      tabBarActiveTintColor: theme.tint,
      tabBarStyle: {
          backgroundColor: theme.navigationBackground,
          borderTopColor: theme.navigationBorder,
      },
      headerStyle: {
          backgroundColor: theme.navigationBackground,
      },
      headerTintColor: theme.headerTintColor,
  };

  return (
    <Tabs screenOptions={themeConfig}>
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
