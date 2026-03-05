import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { MessageBubble } from './MessageBubble';

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
    // Scroll to bottom when messages change
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
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={0}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
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

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Write a message..."
          value={messageBody}
          onChangeText={setMessageBody}
          multiline
          maxLength={1600}
        />
        <TouchableOpacity
          style={[styles.sendButton, !messageBody.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!messageBody.trim()}
        >
          <Text style={styles.sendButtonText}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    paddingBottom: Platform.OS === 'ios' ? 20 : 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e5ea',
    backgroundColor: '#f9f9f9',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#d1d1d6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    fontSize: 16,
    maxHeight: 100,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#d1d1d6',
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
