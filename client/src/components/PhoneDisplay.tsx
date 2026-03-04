import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface PhoneDisplayProps {
  phoneNumber: string;
  label?: string;
}

export function PhoneDisplay({ phoneNumber, label = 'Phone Number' }: PhoneDisplayProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.phoneNumber}>{phoneNumber}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333',
  },
});
