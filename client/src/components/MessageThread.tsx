import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { MessageBubble } from './MessageBubble';
import { brandColors } from "@/src/constants/Colors";

interface Message {
  id: number;
  from: string;
  to: string;
  body: string;
  sentAt: string;
}

interface MessageThreadProps {
  messages: Message[];
  currentNumber: string;
  otherParty: string;
  onSendMessage: (body: string) => Promise<void>;
}

export function MessageThread({ messages, currentNumber, otherParty, onSendMessage }: MessageThreadProps) {
  const [messageBody, setMessageBody] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!messageBody.trim()) return;
    await onSendMessage(messageBody.trim());
    setMessageBody('');
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white dark:bg-gray-900"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        className="flex-1"
        contentContainerClassName="py-4"
        showsVerticalScrollIndicator={true}
      >
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            body={message.body}
            from={message.from}
            currentNumber={currentNumber}
            timestamp={new Date(message.sentAt).toLocaleString()}
          />
        ))}
      </ScrollView>

      <SafeAreaView className="border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
        <View className="flex-row p-3 pb-2">
          <TextInput
            className={`flex-1 border border-gray-300 dark:border-gray-600 rounded-full px-4 py-2 mr-3 text-base max-h-24 bg-white dark:bg-gray-700 text-gray-900 dark:text-white ${Platform.OS === 'web' ? 'h-10' : ''}`}
            placeholder="Write a message..."
            value={messageBody}
            onChangeText={setMessageBody}
            multiline={Platform.OS !== 'web'}
            maxLength={1600}
            placeholderTextColor={brandColors.placeholder}
            textAlignVertical="center"
          />
          <TouchableOpacity
            className={`rounded-full justify-center items-center ${Platform.OS === 'web' ? 'w-10 h-10' : 'px-4'} ${messageBody.trim() ? 'bg-blue-500' : 'bg-gray-300'}`}
            onPress={handleSend}
            disabled={!messageBody.trim()}
          >
            <Text className={`text-white font-semibold ${Platform.OS === 'web' ? 'text-lg' : 'text-sm'}`}>
              {Platform.OS === 'web' ? '➤' : 'Send'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
