import React from 'react';
import { Text, TouchableOpacity, View, Alert, Platform } from 'react-native';
import { AnimatedModal } from './AnimatedModal';
import { LogList } from './LogList';
import { useLog } from '@/src/providers/LogProvider';

interface SseLogModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

export function SseLogModal({ isOpen, onRequestClose }: SseLogModalProps) {
  const { logs, clearLogs } = useLog('sse');

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
        <LogList
          logs={logs}
          emptyMessage="No SSE events logged"
          autoScrollToBottom
        />
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
