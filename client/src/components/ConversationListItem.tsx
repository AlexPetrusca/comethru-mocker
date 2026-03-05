import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Conversation {
  otherParty: string;
  messageCount: number;
  lastMessage: string;
  lastMessageAt: string;
}

interface ConversationListItemProps {
  conversation: Conversation;
  onPress: () => void;
}

export function ConversationListItem({ conversation, onPress }: ConversationListItemProps) {
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{conversation.otherParty.slice(-2)}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.otherParty}>{conversation.otherParty}</Text>
          <Text style={styles.timestamp}>{formatTimestamp(conversation.lastMessageAt)}</Text>
        </View>
        <Text style={styles.lastMessage} numberOfLines={1}>
          {conversation.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5ea',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  otherParty: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
  },
  timestamp: {
    fontSize: 14,
    color: '#8e8e93',
  },
  lastMessage: {
    fontSize: 15,
    color: '#8e8e93',
  },
});
