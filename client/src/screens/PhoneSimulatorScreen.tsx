import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { MessageBubble, PhoneDisplay } from '../components';
import { Message, messagesService } from '../services/messages';
import StorageKey from "@/src/constants/StorageKey";
import { useSubscribe } from "@/src/providers/PubSubContext";
import PubSubEvent from "@/src/constants/PubSubEvent";
import { useUpdateEffect } from "@/src/hooks/useUpdateEffect";
import { useStorage } from "@/src/providers/StorageProvider";
import { PhoneNumber } from "@/src/constants";

export function PhoneSimulatorScreen() {
  const { storage } = useStorage();
  const [phoneNumber, setPhoneNumber] = useState(PhoneNumber.DEFAULT as string);
  const [recipientNumber, setRecipientNumber] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [sendStatus, setSendStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // on mount
  useEffect(() => {
    const savedNumber = storage[StorageKey.PHONE_NUMBER_KEY];
    if (savedNumber != null) {
      setPhoneNumber(savedNumber);
    }
  }, []);

  useSubscribe(PubSubEvent.PHONE_NUMBER_CHANGED, phoneNumber => {
    setPhoneNumber(phoneNumber);
  });

  useUpdateEffect(() => {
    loadMessages();
  }, [phoneNumber]);

  const loadMessages = async () => {
    console.log("LOADING MESSAGES:", phoneNumber);
    try {
      const allMessages = await messagesService.getAll();
      const filtered = allMessages.filter(
        (m: Message) => m.from === phoneNumber || m.to === phoneNumber
      );
      setMessages(filtered);
    } catch (error: any) {
      console.error('Failed to load messages:', error.message, error.code, error.request, error.response);
    }
  };

  const handleSendMessage = async () => {
    if (!recipientNumber || !messageBody) {
      setSendStatus({ type: 'error', message: 'Please enter recipient number and message' });
      return;
    }

    try {
      await messagesService.send({
        from: phoneNumber,
        to: recipientNumber,
        body: messageBody,
      });
      setMessageBody('');
      await loadMessages();
      setSendStatus({ type: 'success', message: 'Message sent!' });
    } catch (error) {
      setSendStatus({ type: 'error', message: 'Failed to send message' });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <PhoneDisplay phoneNumber={phoneNumber} label="Your Phone Number" />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Send Message</Text>
        <TextInput
          style={styles.input}
          placeholder="Recipient number"
          value={recipientNumber}
          onChangeText={setRecipientNumber}
          keyboardType="phone-pad"
        />
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Message"
          value={messageBody}
          onChangeText={setMessageBody}
          multiline
        />
        <TouchableOpacity style={styles.button} onPress={handleSendMessage}>
          <Text style={styles.buttonText}>Send</Text>
        </TouchableOpacity>
        {sendStatus && (
          <Text style={[styles.statusMessage, sendStatus.type === 'success' ? styles.statusSuccess : styles.statusError]}>
            {sendStatus.message}
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Messages</Text>
        <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={loadMessages}>
          <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity>
        {messages.map((message) => (
          <MessageBubble
            key={message.id}
            body={message.body}
            from={message.from}
            currentNumber={phoneNumber}
            timestamp={new Date(message.sentAt).toLocaleString()}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  secondaryButton: {
    backgroundColor: '#5856D6',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  statusMessage: {
    marginBottom: 12,
    padding: 10,
    borderRadius: 6,
    fontSize: 14,
  },
  statusSuccess: {
    backgroundColor: '#d4edda',
    color: '#155724',
  },
  statusError: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
  },
});
