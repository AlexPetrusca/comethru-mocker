import React, { useState, useEffect } from 'react';
import { Text, TextInput, TouchableOpacity, View, FlatList, Alert, Platform } from 'react-native';
import { storage } from '@/src/services/storage';
import { AnimatedModal } from './AnimatedModal';

interface StorageEntry {
  key: string;
  value: string;
}

interface StorageModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

export function StorageModal({ isOpen, onRequestClose }: StorageModalProps) {
  const [entries, setEntries] = useState<StorageEntry[]>([]);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    if (isOpen) loadEntries();
  }, [isOpen]);

  const loadEntries = () => {
    const keys = storage.getAllKeys();
    const loadedEntries = keys.map(key => ({
      key,
      value: storage.getString(key) || '',
    }));
    setEntries(loadedEntries);
  };

  const handleEdit = (key: string, currentValue: string) => {
    setEditingKey(key);
    setEditValue(currentValue);
  };

  const handleSave = (key: string) => {
    storage.set(key, editValue);
    setEditingKey(null);
    setEditValue('');
    loadEntries();
  };

  const handleDelete = (key: string) => {
    if (Platform.OS === 'web') {
      if (window.confirm(`Delete key "${key}"?`)) {
        storage.remove(key);
        loadEntries();
      }
    } else {
      Alert.alert(
        'Delete Key',
        `Are you sure you want to delete "${key}"?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              storage.remove(key);
              loadEntries();
            },
          },
        ]
      );
    }
  };

  const handleClearAll = () => {
    const keys = storage.getAllKeys();
    if (keys.length === 0) return;

    if (Platform.OS === 'web') {
      if (window.confirm('Delete all storage entries?')) {
        keys.forEach(key => storage.remove(key));
        loadEntries();
      }
    } else {
      Alert.alert(
        'Clear All',
        `Delete all ${keys.length} storage entries?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete All',
            style: 'destructive',
            onPress: () => {
              keys.forEach(key => storage.remove(key));
              loadEntries();
            },
          },
        ]
      );
    }
  };

  const renderEntry = ({ item }: { item: StorageEntry }) => (
    <View className="border-b border-gray-200 dark:border-gray-700 py-3">
      <Text className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">{item.key}</Text>
      {editingKey === item.key ? (
        <View>
          <TextInput
            className="singleline-textinput mb-2"
            value={editValue}
            onChangeText={setEditValue}
            multiline
          />
          <View className="flex-row gap-2">
            <TouchableOpacity
              className="flex-1 bg-green-500 rounded-lg py-2 items-center"
              onPress={() => handleSave(item.key)}
            >
              <Text className="text-white text-sm font-semibold">Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-gray-400 rounded-lg py-2 items-center"
              onPress={() => setEditingKey(null)}
            >
              <Text className="text-white text-sm font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View>
          <Text className="text-sm text-gray-600 dark:text-gray-400 mb-2 break-all">{item.value}</Text>
          <View className="flex-row gap-2">
            <TouchableOpacity
              className="flex-1 bg-blue-500 rounded-lg py-2 items-center"
              onPress={() => handleEdit(item.key, item.value)}
            >
              <Text className="text-white text-sm font-semibold">Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-red-500 rounded-lg py-2 items-center"
              onPress={() => handleDelete(item.key)}
            >
              <Text className="text-white text-sm font-semibold">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <AnimatedModal isOpen={isOpen} onRequestClose={onRequestClose}>
      <View className="p-4 border-b border-gray-200 dark:border-gray-700">
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-bold text-gray-900 dark:text-white">MMKV Storage</Text>
          <TouchableOpacity onPress={onRequestClose}>
            <Text className="text-blue-500 text-base font-semibold">Done</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </Text>
      </View>

      {entries.length === 0 ? (
        <View className="p-8 items-center">
          <Text className="text-gray-500 dark:text-gray-400 text-center">No storage entries</Text>
        </View>
      ) : (
        <View style={{ height: 250 }}>
          <FlatList
            data={entries}
            keyExtractor={(item) => item.key}
            renderItem={renderEntry}
            contentContainerClassName="p-4"
            style={{ flex: 1 }}
            className="flex-1"
          />
        </View>
      )}

      {entries.length > 0 && (
        <View className="p-4 border-t border-gray-200 dark:border-gray-700">
          <TouchableOpacity
            className="bg-red-100 dark:bg-red-900/30 rounded-xl py-3 items-center"
            onPress={handleClearAll}
          >
            <Text className="text-red-600 dark:text-red-400 text-base font-semibold">Clear All Storage</Text>
          </TouchableOpacity>
        </View>
      )}
    </AnimatedModal>
  );
}
