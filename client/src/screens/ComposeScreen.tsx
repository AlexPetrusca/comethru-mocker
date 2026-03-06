import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { messagesService } from '@/src/services';
import { useStorage } from '@/src/providers';
import { StorageKey, PhoneNumber } from "@/src/constants";
import { brandColors } from "@/src/constants/Colors";

export default function ComposeScreen() {
  const router = useRouter();
  const { storage } = useStorage();
  const { to } = useLocalSearchParams<{ to?: string }>();
  const [currentNumber, setCurrentNumber] = useState<string>('');
  const [recipient, setRecipient] = useState(to || '');
  const [body, setBody] = useState('');

  React.useEffect(() => {
    setCurrentNumber(storage[StorageKey.PHONE_NUMBER_KEY] || PhoneNumber.DEFAULT);
  }, [storage]);

  const handleSend = async () => {
    if (!recipient.trim() || !body.trim()) {
      if (Platform.OS === 'web') {
        window.alert('Please enter recipient and message');
      } else {
        Alert.alert('Error', 'Please enter recipient and message');
      }
      return;
    }

    try {
      await messagesService.send({
        from: currentNumber,
        to: recipient.trim(),
        body: body.trim(),
      });
      router.back();
    } catch (error) {
      if (Platform.OS === 'web') {
        window.alert('Failed to send message');
      } else {
        Alert.alert('Error', 'Failed to send message');
      }
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'New Message',
          headerBackTitle: 'Cancel',
          headerRight: () => (
            <TouchableOpacity onPress={handleSend} className="mr-4">
              <Text className="text-blue-500 text-base font-semibold">Send</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View className="flex-1 p-4 bg-white dark:bg-gray-900">
        <View className="mb-5">
          <Text className="text-sm font-semibold mb-2 text-gray-500 dark:text-gray-400">To:</Text>
          <TextInput
            className="border border-gray-300 dark:border-gray-600 rounded-xl p-3 text-base bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
            value={recipient}
            onChangeText={setRecipient}
            placeholder="Phone number"
            placeholderTextColor={brandColors.placeholder}
            keyboardType="phone-pad"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View className="mb-5">
          <Text className="text-sm font-semibold mb-2 text-gray-500 dark:text-gray-400">Message:</Text>
          <TextInput
            className="border border-gray-300 dark:border-gray-600 rounded-xl p-3 text-base bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white min-h-[150px] text-top"
            value={body}
            onChangeText={setBody}
            placeholder="Write a message..."
            placeholderTextColor={brandColors.placeholder}
            multiline
            textAlignVertical="top"
          />
        </View>
      </View>
    </>
  );
}
