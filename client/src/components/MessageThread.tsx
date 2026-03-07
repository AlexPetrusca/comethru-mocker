import React, { useEffect, useRef, useState } from 'react';
import { View, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { MessageBubble } from './MessageBubble';
import { brandColors } from "@/src/constants/Colors";
import { Ionicons } from "@expo/vector-icons";

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
  const scrollViewRef = useRef<ScrollView>(null);
  const [inputHeight, setInputHeight] = useState(40);
  const [messageBody, setMessageBody] = useState('');

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

      <View className={`border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800`}>
        <View className={`flex-row p-3 items-end ${Platform.OS !== 'web' ? 'pb-11' : ''}`}>
          <TextInput
            className={`multiline-textinput px-4 ${Platform.OS === 'android' ? 'pb-0' : 'py-2'} flex-1 mr-3 min-h-[40px] max-h-24`}
            style={Platform.OS === 'web' ? { height: Math.min(inputHeight, 96) } : undefined}
            placeholder="Write a message..."
            value={messageBody}
            onChangeText={setMessageBody}
            onContentSizeChange={(e) => {
              if (Platform.OS === 'web') {
                setInputHeight(e.nativeEvent.contentSize.height);
              }
            }}
            multiline
            maxLength={1600}
            placeholderTextColor={brandColors.placeholder}
            textAlignVertical="top"
          />
          <TouchableOpacity
            className={`rounded-full justify-center items-center w-10 h-10 mb-0.5 ${messageBody.trim() ? 'bg-blue-500' : 'bg-gray-300'}`}
            onPress={handleSend}
            disabled={!messageBody.trim()}
          >
            <Ionicons name="send" size={16} color='white' />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
