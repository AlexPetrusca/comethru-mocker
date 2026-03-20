import React from 'react';
import { View, Text, TouchableOpacity, Clipboard } from 'react-native';

interface PhoneDisplayProps {
  phoneNumber: string;
  pushToken?: string | null;
  lastVerificationCode?: string | null;
}

export function AdminInfoDisplay({ phoneNumber, pushToken, lastVerificationCode }: PhoneDisplayProps) {
  return (
    <View className="p-4 rounded-lg mb-4 bg-gray-100 dark:bg-gray-800">
      <Text className="text-xs mb-1 text-gray-500 dark:text-gray-400">Your Phone Number</Text>
      <Text className="text-2xl font-semibold text-gray-900 dark:text-white">{phoneNumber}</Text>

      {(pushToken || lastVerificationCode) && (
        <View className="mt-3 space-y-2">
          {pushToken && (
            <TouchableOpacity onPress={() => Clipboard.setString(pushToken)} className="flex-row items-center">
              <View className="flex-1 pb-2">
                <Text className="text-xs mb-1 text-gray-500 dark:text-gray-400">Push Token</Text>
                <Text className="text-sm text-gray-700 dark:text-gray-300 break-all" numberOfLines={2} ellipsizeMode="tail">
                  {pushToken}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          {lastVerificationCode && (
            <TouchableOpacity onPress={() => Clipboard.setString(lastVerificationCode)} className="flex-row items-center">
              <View className="flex-1">
                <Text className="text-xs mb-1 text-gray-500 dark:text-gray-400">Last Verification Code</Text>
                <Text className="text-sm text-gray-700 dark:text-gray-300">{lastVerificationCode}</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
