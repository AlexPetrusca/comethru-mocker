import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { messagesService } from '@/src/services/messages';
import { useStorage } from '@/src/providers/StorageProvider';
import StorageKey from '@/src/constants/StorageKey';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ComposeScreen() {
  const { to } = useLocalSearchParams<{ to?: string }>();
  const router = useRouter();
  const { storage } = useStorage();
  const [currentNumber, setCurrentNumber] = useState<string>('');
  const [recipient, setRecipient] = useState(to || '');
  const [body, setBody] = useState('');

  React.useEffect(() => {
    const loadPhoneNumber = async () => {
      const savedNumber = storage[StorageKey.PHONE_NUMBER_KEY];
      const number = savedNumber || (await AsyncStorage.getItem(StorageKey.PHONE_NUMBER_KEY)) || '+15550000000';
      setCurrentNumber(number);
    };
    loadPhoneNumber();
  }, [storage]);

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
        from: currentNumber,
        to: recipient.trim(),
        body: body.trim(),
      });
      router.back();
    } catch (error) {
      if (Platform.OS === 'web') {
        window.alert('Failed to send message');
      } else {
        Alert.alert('Error', 'Failed to send message');
      }
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'New Message',
          headerBackTitle: 'Cancel',
          headerRight: () => (
            <TouchableOpacity onPress={handleSend} style={styles.sendHeaderButton}>
              <Text style={styles.sendHeaderButtonText}>Send</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <View style={styles.container}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>To:</Text>
          <TextInput
            style={styles.input}
            value={recipient}
            onChangeText={setRecipient}
            placeholder="Phone number"
            keyboardType="phone-pad"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Message:</Text>
          <TextInput
            style={[styles.input, styles.messageInput]}
            value={body}
            onChangeText={setBody}
            placeholder="Type your message"
            multiline
            textAlignVertical="top"
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8e8e93',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d1d6',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  messageInput: {
    minHeight: 150,
  },
  sendHeaderButton: {
    marginRight: 16,
  },
  sendHeaderButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
