import React from 'react';
import { View, Text } from 'react-native';

interface MessageBubbleProps {
  body: string;
  from: string;
  phoneNumber: string;
  timestamp: string;
}

export function MessageBubble({ body, from, phoneNumber, timestamp }: MessageBubbleProps) {
  const isOutgoing = from === phoneNumber;

  return (
    <View className={`mx-4 my-1 ${isOutgoing ? 'items-end' : 'items-start'}`}>
      <View
        className={`max-w-[80%] p-3 rounded-2xl ${
          isOutgoing
            ? 'bg-blue-500 rounded-br-none'
            : 'bg-gray-200 dark:bg-gray-700 rounded-bl-none'
        }`}
      >
        <Text className={`text-base mb-1 ${isOutgoing ? 'text-white' : 'text-black dark:text-white'}`}>
          {body}
        </Text>
        <Text className={`text-xs text-right ${isOutgoing ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
          {timestamp}
        </Text>
      </View>
    </View>
  );
}
