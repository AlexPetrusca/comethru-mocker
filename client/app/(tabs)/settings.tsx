import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { api } from "@/src/services/api";
import { useStorage } from "@/src/providers/StorageProvider";
import StorageKey from "@/src/constants/StorageKey";
import { usePublish } from "@/src/providers/PubSubContext";
import PubSubEvent from "@/src/constants/PubSubEvent";

export default function SettingsTabScreen() {
  const [apiUrl, setApiUrl] = useState(api.defaults.baseURL as string);
  const [phoneNumber, setPhoneNumber] = useState('+15550000000');
  const publish = usePublish();

  const { storage, setItem } = useStorage();

  // on mount
  useEffect(() => {
    const savedPhoneNumber = storage[StorageKey.PHONE_NUMBER_KEY];
    const savedApiUrl = storage[StorageKey.API_URL_KEY];
    if (savedPhoneNumber != null) {
      setPhoneNumber(savedPhoneNumber);
    }
    if (savedApiUrl != null) {
      setApiUrl(savedApiUrl);
    }
  }, []);

  const handleSavePhoneNumber = async () => {
    try {
      await setItem(StorageKey.PHONE_NUMBER_KEY, phoneNumber);
      publish(PubSubEvent.PHONE_NUMBER_CHANGED, phoneNumber);
      Alert.alert('Success', 'Phone number saved!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save phone number');
    }
  };

  const handleSaveApiUrl = async () => {
    try {
      await setItem(StorageKey.API_URL_KEY, apiUrl);
      publish(PubSubEvent.API_URL_CHANGED, apiUrl);
      api.defaults.baseURL = apiUrl;
      Alert.alert('Success', 'API URL saved!');
    } catch (error) {
      Alert.alert('Error', 'Failed to save API URL');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.label}>API URL</Text>
        <TextInput
          style={styles.input}
          value={apiUrl}
          onChangeText={setApiUrl}
          placeholder={api.defaults.baseURL}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity style={styles.button} onPress={handleSaveApiUrl}>
          <Text style={styles.buttonText}>Save API URL</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Default Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="+15550000000"
          keyboardType="phone-pad"
        />
        <TouchableOpacity style={styles.button} onPress={handleSavePhoneNumber}>
          <Text style={styles.buttonText}>Save Phone Number</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>About</Text>
        <Text style={styles.infoText}>
          Comethru Mocker Client - A phone simulator for testing SMS functionality in development environments.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: '100%',
  },
  section: {
    marginBottom: 30,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#666',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});
