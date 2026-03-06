import React, { useEffect, useState, useCallback } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { MessageThread } from '@/src/components';
import { messagesService, Message } from '@/src/services';
import { useStorage } from '@/src/providers';
import { PhoneNumber, StorageKey } from "@/src/constants";

export default function MessageThreadScreen() {
  const { otherParty } = useLocalSearchParams<{ otherParty: string }>();
  const { storage } = useStorage();
  const [currentNumber, setCurrentNumber] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const loadMessages = useCallback(async () => {
    if (!currentNumber || !otherParty) return;
    try {
      const data = await messagesService.getBetween(currentNumber, otherParty);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  }, [currentNumber, otherParty]);

  useEffect(() => {
    setCurrentNumber(storage[StorageKey.PHONE_NUMBER_KEY] || PhoneNumber.DEFAULT);
  }, [storage]);

  useEffect(() => {
    if (currentNumber) {
      loadMessages();
    }
  }, [currentNumber, loadMessages]);

  const handleSendMessage = async (body: string) => {
    if (!currentNumber || !otherParty) return;
    try {
      await messagesService.send({
        from: currentNumber,
        to: otherParty,
        body,
      });
      await loadMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (!currentNumber || loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: otherParty,
          headerBackTitle: 'Back',
        }}
      />
      <MessageThread
        messages={messages}
        currentNumber={currentNumber}
        otherParty={otherParty}
        onSendMessage={handleSendMessage}
      />
    </>
  );
}
