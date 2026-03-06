import React, { useEffect, useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View, Switch } from 'react-native';
import { api } from "@/src/services";
import { useStorage, usePublish } from "@/src/providers";
import { useColorScheme } from "@/src/hooks";
import { StorageKey, PubSubEvent, PhoneNumber } from "@/src/constants";
import { brandColors } from "@/src/constants/Colors";

export default function SettingsScreen() {
  const [apiUrl, setApiUrl] = useState(api.defaults.baseURL as string);
  const [phoneNumber, setPhoneNumber] = useState(PhoneNumber.DEFAULT as string);
  const publish = usePublish();
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';

  const { storage, setItem } = useStorage();

  useEffect(() => {
    const savedPhoneNumber = storage[StorageKey.PHONE_NUMBER_KEY];
    const savedApiUrl = storage[StorageKey.API_URL_KEY];
    if (savedPhoneNumber != null) {
      setPhoneNumber(savedPhoneNumber);
    }
    if (savedApiUrl != null) {
      setApiUrl(savedApiUrl);
    }
  }, []);

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
      await setItem(StorageKey.API_URL_KEY, apiUrl);
      publish(PubSubEvent.API_URL_CHANGED, apiUrl);
      api.defaults.baseURL = apiUrl;
      Alert.alert('Success', 'API URL saved!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save API URL');
    }
  };

  const handleToggleTheme = async () => {
    try {
      await toggleColorScheme();
    } catch (error) {
      Alert.alert('Error', 'Failed to toggle theme');
    }
  };

  return (
    <View className="flex-1 p-5 bg-white dark:bg-gray-900">
      <View className="mb-7">
        <Text className="text-sm font-semibold mb-2 text-gray-500 dark:text-gray-400">
          Appearance
        </Text>
        <View className="flex-row items-center justify-between p-4 rounded-xl border bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700">
          <View>
            <Text className="text-base font-semibold text-gray-900 dark:text-white">
              Dark Mode
            </Text>
            <Text className="text-sm mt-1 text-gray-500 dark:text-gray-400">
              {isDark ? 'Currently using dark theme' : 'Currently using light theme'}
            </Text>
          </View>
          <Switch
            value={isDark}
            onValueChange={handleToggleTheme}
            trackColor={{ false: '#767577', true: '#34C759' }}
            thumbColor="#f4f3f4"
          />
        </View>
      </View>

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
          Default Phone Number
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
