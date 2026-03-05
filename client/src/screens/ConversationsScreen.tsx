import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ConversationListItem } from '@/src/components';
import { messagesService, Conversation } from '@/src/services/messages';
import { useStorage } from '@/src/providers/StorageProvider';
import StorageKey from '@/src/constants/StorageKey';
import { PhoneNumber } from "@/src/constants";

export default function ConversationsScreen() {
  const router = useRouter();
  const { storage } = useStorage();
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadConversations = async () => {
    if (!phoneNumber) return;
    try {
      const data = await messagesService.getConversations(phoneNumber);
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  useEffect(() => {
    setPhoneNumber(storage[StorageKey.PHONE_NUMBER_KEY] || PhoneNumber.DEFAULT);
  }, [storage]);

  useEffect(() => {
    if (phoneNumber) {
      loadConversations();
    }
  }, [phoneNumber]);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
  };

  const handleConversationPress = (otherParty: string) => {
    router.push(`/messages/${encodeURIComponent(otherParty)}`);
  };

  if (!phoneNumber) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.phoneNumber}>{phoneNumber}</Text>
      </View>

      {conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No Conversations</Text>
          <Text style={styles.emptySubtitle}>
            Start a conversation by sending a message
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.otherParty}
          renderItem={({ item }) => (
            <ConversationListItem
              conversation={item}
              onPress={() => handleConversationPress(item.otherParty)}
            />
          )}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      )}

      <TouchableOpacity
        style={styles.newMessageButton}
        onPress={() => router.push(`/compose?to=${phoneNumber}`)}
      >
        <Text style={styles.newMessageButtonText}>New Message</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5ea',
  },
  phoneNumber: {
    fontSize: 14,
    color: '#8e8e93',
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#8e8e93',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#8e8e93',
  },
  newMessageButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  newMessageButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
