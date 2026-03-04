import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { PhoneDisplay, MessageBubble } from '../components';
import { messagesService, Message } from '../services/messages';
import { verificationService } from '../services/verification';

interface PhoneSimulatorScreenProps {
  initialNumber?: string;
}

export function PhoneSimulatorScreen({ initialNumber = '+15550000000' }: PhoneSimulatorScreenProps) {
  const [phoneNumber, setPhoneNumber] = useState(initialNumber);
  const [recipientNumber, setRecipientNumber] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [verificationCode, setVerificationCode] = useState('');
  const [verifyStatus, setVerifyStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [sendStatus, setSendStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [requestCodeStatus, setRequestCodeStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const loadMessages = async () => {
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
      setRequestCodeStatus(null);
      setVerifyStatus(null);
    } catch (error) {
      setSendStatus({ type: 'error', message: 'Failed to send message' });
    }
  };

  const handleSendVerification = async () => {
    try {
      await verificationService.send({ to: phoneNumber });
      setRequestCodeStatus({ type: 'success', message: 'Verification code sent!' });
      setSendStatus(null);
      setVerifyStatus(null);
    } catch (error) {
      setRequestCodeStatus({ type: 'error', message: 'Failed to send verification code' });
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setVerifyStatus({ type: 'error', message: 'Please enter verification code' });
      return;
    }

    try {
      const result = await verificationService.verify({
        to: phoneNumber,
        code: verificationCode,
      });
      if (result.valid) {
        setVerifyStatus({ type: 'success', message: 'Code verified successfully!' });
      } else {
        setVerifyStatus({ type: 'error', message: result.message || 'Invalid or expired code' });
      }
      setSendStatus(null);
      setRequestCodeStatus(null);
    } catch (error) {
      setVerifyStatus({ type: 'error', message: 'Failed to verify code' });
    }
  };

  React.useEffect(() => {
    loadMessages();
  }, [phoneNumber]);

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
        <Text style={styles.sectionTitle}>Verification Code</Text>
        <TouchableOpacity style={styles.button} onPress={handleSendVerification}>
          <Text style={styles.buttonText}>Request Code</Text>
        </TouchableOpacity>
        {requestCodeStatus && (
          <Text style={[styles.statusMessage, requestCodeStatus.type === 'success' ? styles.statusSuccess : styles.statusError]}>
            {requestCodeStatus.message}
          </Text>
        )}
        <TextInput
          style={styles.input}
          placeholder="Enter code"
          value={verificationCode}
          onChangeText={setVerificationCode}
          keyboardType="number-pad"
        />
        <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
          <Text style={styles.buttonText}>Verify</Text>
        </TouchableOpacity>
        {verifyStatus && (
          <Text style={[styles.statusMessage, verifyStatus.type === 'success' ? styles.statusSuccess : styles.statusError]}>
            {verifyStatus.message}
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
    marginTop: 8,
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
