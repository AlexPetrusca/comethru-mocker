import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ConversationListItem } from '@/src/components';
import { messagesService, Conversation } from '@/src/services';
import { PubSubEvent, StorageKey } from "@/src/constants";
import { useMMKVString } from "react-native-mmkv";
import { useSubscription } from "@/src/providers/PubSubProvider";

export default function ConversationsScreen() {
  const router = useRouter();
  const [phoneNumber] = useMMKVString(StorageKey.PHONE_NUMBER);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useSubscription(PubSubEvent.MESSAGE_RECEIVED, () => {
    loadConversations();
  });

  useEffect(() => {
    loadConversations();
  }, [phoneNumber]);

  const loadConversations = async () => {
    if (!phoneNumber) return;
    try {
      const data = await messagesService.getConversations(phoneNumber);
      setConversations(data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

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
      <View className="flex-1 items-center justify-center p-8 bg-white dark:bg-gray-900">
        <Text className="text-base text-gray-500 dark:text-gray-400">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-gray-900">
      <FlatList
        data={conversations}
        keyExtractor={(item) => item.otherParty}
        renderItem={({ item }) => (
          <ConversationListItem
            conversation={item}
            onPress={() => handleConversationPress(item.otherParty)}
          />
        )}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center p-8" style={{ minHeight: '100%' }}>
            <Text className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">No Conversations</Text>
            <Text className="text-base text-center text-gray-500 dark:text-gray-400">
              Start a conversation by sending a message
            </Text>
          </View>
        )}
        contentContainerStyle={conversations.length === 0 ? { flexGrow: 1 } : undefined}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      <TouchableOpacity
        className="absolute bottom-5 right-5 bg-blue-500 rounded-full py-3 px-6 shadow-lg"
        onPress={() => router.push(`/compose?to=${encodeURIComponent(phoneNumber)}`)}
      >
        <Text className="text-white text-base font-semibold">New Message</Text>
      </TouchableOpacity>
    </View>
  );
}
