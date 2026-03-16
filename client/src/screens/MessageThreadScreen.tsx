import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { MessageThread } from '@/src/components';
import { Message, messagesService } from '@/src/services';
import { useSubscription } from '@/src/providers';
import { PubSubEvent, StorageKey } from "@/src/constants";
import { useMMKVString } from "react-native-mmkv";

export default function MessageThreadScreen() {
  const { otherParty } = useLocalSearchParams<{ otherParty: string }>();
  const [phoneNumber] = useMMKVString(StorageKey.PHONE_NUMBER);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useSubscription(PubSubEvent.MESSAGE_RECEIVED, message => {
    const notSentByUs = messages[messages.length - 1].id !== message.id;
    const isPartOfConversation = (message.to === phoneNumber && message.from === otherParty)
      || (message.to === otherParty && message.from === phoneNumber);
    if (isPartOfConversation && notSentByUs) {
      setMessages(prev => [...prev, message])
    }
  });

  const loadMessages = useCallback(async () => {
    if (!phoneNumber || !otherParty) return;
    try {
      const data = await messagesService.getBetween(phoneNumber, otherParty);
      setMessages(data);
    } catch (error) {
      console.error('Failed to load messages:', error);
    } finally {
      setLoading(false);
    }
  }, [phoneNumber, otherParty]);

  useEffect(() => {
    if (phoneNumber) {
      loadMessages();
    }
  }, [phoneNumber, loadMessages]);

  const handleSendMessage = async (body: string) => {
    if (!phoneNumber || !otherParty) return;
    try {
      await messagesService.send({
        from: phoneNumber,
        to: otherParty,
        body,
      });
      await loadMessages();
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  if (!phoneNumber || loading) {
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
        phoneNumber={phoneNumber!}
        otherParty={otherParty}
        onSendMessage={handleSendMessage}
      />
    </>
  );
}
