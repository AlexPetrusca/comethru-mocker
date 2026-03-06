import React from 'react';
import { View, Text } from 'react-native';

interface PhoneDisplayProps {
  phoneNumber: string;
  label?: string;
}

export function PhoneDisplay({ phoneNumber, label = 'Phone Number' }: PhoneDisplayProps) {
  return (
    <View className="p-4 rounded-lg mb-4 bg-gray-100 dark:bg-gray-800">
      <Text className="text-xs mb-1 text-gray-500 dark:text-gray-400">{label}</Text>
      <Text className="text-2xl font-semibold text-gray-900 dark:text-white">{phoneNumber}</Text>
    </View>
  );
}
