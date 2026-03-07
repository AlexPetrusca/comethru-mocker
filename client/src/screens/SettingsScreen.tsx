import React, { useState } from 'react';
import { Alert, Appearance, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useColorScheme } from 'nativewind';
import { api } from "@/src/services";
import { usePubSub, useStorage } from "@/src/providers";
import { PhoneNumber, PubSubEvent, StorageKey, ThemeMode } from "@/src/constants";
import { brandColors } from "@/src/constants/Colors";

export default function SettingsScreen() {
  const { storage, setItem } = useStorage();
  const { publish } = usePubSub();
  const { setColorScheme } = useColorScheme();
  const [apiUrl, setApiUrl] = useState(storage[StorageKey.API_URL_KEY] || api.defaults.baseURL as string);
  const [phoneNumber, setPhoneNumber] = useState(storage[StorageKey.PHONE_NUMBER_KEY] || PhoneNumber.DEFAULT);
  const [themeMode, setThemeMode] = useState(storage[StorageKey.THEME_KEY] || ThemeMode.SYSTEM);

  // useEffect(() => {
  //   const subscription = Appearance.addChangeListener(({ colorScheme }) => {
  //     // Update theme when system preference changes and mode is 'system'
  //     if (themeMode === ThemeMode.SYSTEM) {
  //       setColorScheme(colorScheme === 'dark' ? ThemeMode.DARK : ThemeMode.LIGHT);
  //     }
  //   });
  //   return () => subscription.remove();
  // }, [themeMode]);

  const handleSavePhoneNumber = async () => {
    try {
      await setItem(StorageKey.PHONE_NUMBER_KEY, phoneNumber);
      publish(PubSubEvent.PHONE_NUMBER_CHANGED, phoneNumber);
      Alert.alert('Success', 'Phone number saved!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save phone number');
    }
  };

  const handleSaveApiUrl = async () => {
    try {
      api.defaults.baseURL = apiUrl;
      await setItem(StorageKey.API_URL_KEY, apiUrl);
      publish(PubSubEvent.API_URL_CHANGED, apiUrl);
      Alert.alert('Success', 'API URL saved!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save API URL');
    }
  };

  const handleSetThemeMode = async (mode: ThemeMode) => {
    setThemeMode(mode);
    await setItem(StorageKey.THEME_KEY, mode);

    if (mode === ThemeMode.SYSTEM) {
      setColorScheme('system');
    } else {
      setColorScheme(mode);
    }
  };

  const themeOptions: { value: ThemeMode; label: string; description: string }[] = [
    { value: ThemeMode.SYSTEM, label: 'System', description: 'Follow device appearance' },
    { value: ThemeMode.LIGHT, label: 'Light', description: 'Always use light appearance' },
    { value: ThemeMode.DARK, label: 'Dark', description: 'Always use dark appearance' },
  ];

  return (
    <View className="flex-1 p-5 bg-white dark:bg-gray-900">
      <View className="mb-7">
        <Text className="text-sm font-semibold mb-2 text-gray-500 dark:text-gray-400">
          API URL
        </Text>
        <TextInput
          className="border border-gray-300 dark:border-gray-600 rounded-xl p-3 mb-3 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          value={apiUrl}
          onChangeText={setApiUrl}
          placeholder={api.defaults.baseURL}
          placeholderTextColor={brandColors.placeholder}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity className="bg-blue-500 rounded-xl py-3.5 items-center" onPress={handleSaveApiUrl}>
          <Text className="text-white text-base font-semibold">Save API URL</Text>
        </TouchableOpacity>
      </View>

      <View className="mb-7">
        <Text className="text-sm font-semibold mb-2 text-gray-500 dark:text-gray-400">
          Phone Number
        </Text>
        <TextInput
          className="border border-gray-300 dark:border-gray-600 rounded-xl p-3 mb-3 text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder={PhoneNumber.DEFAULT}
          placeholderTextColor={brandColors.placeholder}
          keyboardType="phone-pad"
        />
        <TouchableOpacity className="bg-blue-500 rounded-xl py-3.5 items-center" onPress={handleSavePhoneNumber}>
          <Text className="text-white text-base font-semibold">Save Phone Number</Text>
        </TouchableOpacity>
      </View>

      <View className="mb-7">
        <Text className="text-sm font-semibold mb-2 text-gray-500 dark:text-gray-400">
          Appearance
        </Text>
        <View className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          {themeOptions.map((option, index) => (
            <TouchableOpacity
              key={option.value}
              className={`flex-row items-center justify-between p-4 ${
                index !== themeOptions.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''
              } ${themeMode === option.value ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-white dark:bg-gray-800'}`}
              onPress={() => handleSetThemeMode(option.value)}
            >
              <View>
                <Text className={`text-base font-semibold ${themeMode === option.value ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-white'}`}>
                  {option.label}
                </Text>
                <Text className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                  {option.description}
                </Text>
              </View>
              {themeMode === option.value && (
                <View className="w-5 h-5 rounded-full bg-blue-500 items-center justify-center">
                  <View className="w-2.5 h-2.5 rounded-full bg-white" />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View className="mt-5 p-4 rounded-xl bg-gray-100 dark:bg-gray-800">
        <Text className="text-base font-semibold mb-2 text-gray-900 dark:text-white">
          About
        </Text>
        <Text className="text-sm leading-5 text-gray-600 dark:text-gray-400">
          Comethru Mocker Client - A phone simulator for testing SMS functionality in development environments.
        </Text>
      </View>
    </View>
  );
}
