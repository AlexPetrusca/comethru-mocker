import React from 'react';
import { SymbolView } from 'expo-symbols';
import { Link, Tabs } from 'expo-router';
import { Platform, Pressable } from 'react-native';

import Colors from '@/src/constants/Colors';
import { useColorScheme } from '@/src/hooks/useColorScheme';

export default function TabLayout() {
    const colorScheme = useColorScheme();

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colors[colorScheme].tint
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
                    ),
                    headerRight: () => (
                        <Link href="/modal" asChild>
                            <Pressable style={{ marginRight: 15 }}>
                                {({ pressed }) => (
                                    <SymbolView
                                        name={{ ios: 'info.circle', android: 'info', web: 'info' }}
                                        size={25}
                                        tintColor={Colors[colorScheme].text}
                                        style={{ opacity: pressed ? 0.5 : 1 }}
                                    />
                                )}
                            </Pressable>
                        </Link>
                    ),
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
