import React, { useEffect, useRef } from 'react';
import { Text, TouchableOpacity, View, FlatList, Alert, Platform } from 'react-native';
import { AnimatedModal } from './AnimatedModal';
import { useLog } from '@/src/providers/LogProvider';

interface SseLogModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

export function SseLogModal({ isOpen, onRequestClose }: SseLogModalProps) {
  const { logs, clearLogs } = useLog('sse');
  const listRef = useRef<FlatList | null>(null);

  const handleClear = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Clear all SSE logs?')) {
        clearLogs();
      }
    } else {
      Alert.alert(
        'Clear Logs',
        'Are you sure you want to clear all SSE logs?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Clear',
            style: 'destructive',
            onPress: () => clearLogs(),
          },
        ]
      );
    }
  };

  const renderLog = ({ item }: { item: any }) => (
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

  return (
    <AnimatedModal isOpen={isOpen} onRequestClose={onRequestClose}>
      <View className="p-4 border-b border-gray-200 dark:border-gray-700">
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-bold text-gray-900 dark:text-white">SSE Event Log</Text>
          <TouchableOpacity onPress={onRequestClose}>
            <Text className="text-blue-500 text-base font-semibold">Done</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {logs.length} {logs.length === 1 ? 'event' : 'events'}
        </Text>
      </View>

      <View className="h-[430px]">
        {logs.length === 0 ? (
          <View className="p-8 items-center js">
            <Text className="text-gray-500 dark:text-gray-400 text-center">No SSE events logged</Text>
          </View>
        ) : (
            <FlatList
              ref={listRef}
              data={logs}
              keyExtractor={(_, index) => index.toString()}
              renderItem={renderLog}
              contentContainerClassName="p-4"
              onContentSizeChange={() => {
                requestAnimationFrame(() => {
                  listRef.current?.scrollToEnd({ animated: false });
                });
              }}
            />
        )}
      </View>

      {logs.length > 0 && (
        <View className="p-4 border-t border-gray-200 dark:border-gray-700">
          <TouchableOpacity
            className="bg-red-100 dark:bg-red-900/30 rounded-xl py-3 items-center"
            onPress={handleClear}
          >
            <Text className="text-red-600 dark:text-red-400 text-base font-semibold">Clear Logs</Text>
          </TouchableOpacity>
        </View>
      )}
    </AnimatedModal>
  );
}
