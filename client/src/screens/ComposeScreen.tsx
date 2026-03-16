import React, { useState, useLayoutEffect } from 'react';
import { View, Text, TextInput, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack, useNavigation } from 'expo-router';
import { messagesService } from '@/src/services';
import { StorageKey } from "@/src/constants";
import { brandColors } from "@/src/constants/Colors";
import { useMMKVString } from "react-native-mmkv";

export default function ComposeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const { to } = useLocalSearchParams<{ to?: string }>();
  const [phoneNumber] = useMMKVString(StorageKey.PHONE_NUMBER)
  const [recipient, setRecipient] = useState(to || '');
  const [body, setBody] = useState('');

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
        from: phoneNumber!,
        to: recipient.trim(),
        body: body.trim(),
      });
      router.push(`/messages/${encodeURIComponent(recipient.trim())}`);
    } catch (error) {
      if (Platform.OS === 'web') {
        window.alert('Failed to send message');
      } else {
        Alert.alert('Error', 'Failed to send message');
      }
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRightContainerStyle: {
        paddingRight: 16,
      },
      headerRight: () => (
        <Text
          onPress={handleSend}
          style={{ color: '#3B82F6', fontSize: 17, fontWeight: '600', padding: 8 }}
        >
          Send
        </Text>
      ),
    });
  }, [navigation, handleSend]);

  return (
    <>
      <Stack.Screen
        options={{
          title: 'New Message',
          headerBackTitle: 'Cancel',
        }}
      />
      <View className="flex-1 p-4 bg-white dark:bg-gray-900">
        <View className="mb-5">
          <Text className="text-sm font-semibold mb-2 text-gray-500 dark:text-gray-400">To:</Text>
          <TextInput
            className="singleline-textinput"
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
            className="multiline-textinput p-3 min-h-[150px]"
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
