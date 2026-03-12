import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { MessageThread } from '@/src/components';
import { Message, messagesService } from '@/src/services';
import { useStorage, useSubscription } from '@/src/providers';
import { PhoneNumber, PubSubEvent, StorageKey } from "@/src/constants";

export default function MessageThreadScreen() {
  const { storage } = useStorage();
  const { otherParty } = useLocalSearchParams<{ otherParty: string }>();
  const [currentNumber] = useState<string>(storage[StorageKey.PHONE_NUMBER] || PhoneNumber.DEFAULT);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useSubscription(PubSubEvent.MESSAGE_RECEIVED, message => {
    const notSentByUs = messages[messages.length - 1].id !== message.id;
    const isPartOfConversation = (message.to === currentNumber && message.from === otherParty)
      || (message.to === otherParty && message.from === currentNumber);
    if (isPartOfConversation && notSentByUs) {
      setMessages(prev => [...prev, message])
    }
  });

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
