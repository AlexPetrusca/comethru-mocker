import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MessageBubbleProps {
  body: string;
  from: string;
  currentNumber: string;
  timestamp: string;
}

export function MessageBubble({ body, from, currentNumber, timestamp }: MessageBubbleProps) {
  const isOutgoing = from === currentNumber;

  return (
    <View style={[styles.container, isOutgoing ? styles.outgoing : styles.incoming]}>
      <View style={[styles.bubble, isOutgoing ? styles.outgoingBubble : styles.incomingBubble]}>
        <Text style={[styles.text, isOutgoing ? styles.outgoingText : styles.incomingText]}>
          {body}
        </Text>
        <Text style={[styles.timestamp, isOutgoing ? styles.outgoingTimestamp : styles.incomingTimestamp]}>
          {timestamp}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    paddingHorizontal: 16,
  },
  outgoing: {
    alignItems: 'flex-end',
  },
  incoming: {
    alignItems: 'flex-start',
  },
  bubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
  },
  outgoingBubble: {
    backgroundColor: '#007AFF',
    borderBottomRightRadius: 4,
  },
  incomingBubble: {
    backgroundColor: '#E5E5EA',
    borderBottomLeftRadius: 4,
  },
  text: {
    fontSize: 16,
    marginBottom: 4,
  },
  outgoingText: {
    color: '#FFFFFF',
  },
  incomingText: {
    color: '#000000',
  },
  timestamp: {
    fontSize: 11,
    textAlign: 'right',
  },
  outgoingTimestamp: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  incomingTimestamp: {
    color: '#666',
  },
});
