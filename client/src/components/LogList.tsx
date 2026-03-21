import React, { useRef } from 'react';
import { Text, View, FlatList } from 'react-native';
import { LogEntry } from "@/src/providers/contexts/LogContext";

interface LogListProps {
  logs: LogEntry[];
  emptyMessage?: string;
  autoScrollToBottom?: boolean;
}

export function LogList({
  logs,
  emptyMessage = 'No logs',
  autoScrollToBottom = false,
}: LogListProps) {
  const listRef = useRef<FlatList | null>(null);

  const renderLog = ({ item }: { item: LogEntry }) => (
    <View className="border-b border-gray-200 dark:border-gray-700 py-2">
      <View className="flex-row justify-between items-start mb-1">
        <View className="flex-row items-center gap-2">
          <View
            className={`w-2 h-2 rounded-full ${
              item.level === 'SUCCESS'
                ? 'bg-green-500'
                : item.level === 'ERROR'
                  ? 'bg-red-500'
                  : item.level === 'WARN'
                    ? 'bg-yellow-500'
                    : 'bg-gray-400'
            }`}
          />
          <Text className="text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase">
            {item.type}
          </Text>
        </View>
        <Text className="text-xs text-gray-500 dark:text-gray-400">
          {item.timestamp.toLocaleTimeString()}
        </Text>
      </View>
      {item.data && (
        <Text className="text-xs text-gray-600 dark:text-gray-400 font-mono break-all">
          {typeof item.data === 'object' ? JSON.stringify(item.data, null, 2) : String(item.data)}
        </Text>
      )}
    </View>
  );

  if (logs.length === 0) {
    return (
      <View className="p-8 items-center justify-center">
        <Text className="text-gray-500 dark:text-gray-400 text-center">{emptyMessage}</Text>
      </View>
    );
  }

  return (
    <FlatList
      ref={listRef}
      data={logs}
      keyExtractor={(_, index) => index.toString()}
      renderItem={renderLog}
      contentContainerClassName="p-4"
      {...(autoScrollToBottom && {
        onContentSizeChange: () => {
          requestAnimationFrame(() => {
            listRef.current?.scrollToEnd({ animated: false });
          });
        },
      })}
    />
  );
}
