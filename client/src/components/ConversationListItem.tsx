import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

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
    <TouchableOpacity className="flex-row p-4 border-b border-gray-200 dark:border-gray-700" onPress={onPress}>
      <View className="w-12 h-12 rounded-full bg-blue-500 items-center justify-center mr-3">
        <Text className="text-white text-lg font-semibold">
          {conversation.otherParty.slice(-2)}
        </Text>
      </View>
      <View className="flex-1 justify-center">
        <View className="flex-row justify-between mb-1">
          <Text className="text-base font-semibold text-black dark:text-white">
            {conversation.otherParty}
          </Text>
          <Text className="text-sm text-gray-400">
            {formatTimestamp(conversation.lastMessageAt)}
          </Text>
        </View>
        <Text className="text-sm text-gray-400" numberOfLines={1}>
          {conversation.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
