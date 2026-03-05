import React, { useEffect, useState, useCallback } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { MessageThread } from '@/src/components';
import { messagesService, Message } from '@/src/services/messages';
import { useStorage } from '@/src/providers/StorageProvider';
import StorageKey from '@/src/constants/StorageKey';
import { PhoneNumber } from "@/src/constants";

export default function MessageThreadScreen() {
  const router = useRouter();
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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
