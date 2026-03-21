import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AdminInfoDisplay } from '@/src/components';
import { StorageModal } from '@/src/components/StorageModal';
import { SseLogModal } from '@/src/components/SseLogModal';
import { NotificationLogModal } from '@/src/components/NotificationLogModal';
import { messagesService, verificationService } from '@/src/services';
import { PhoneNumber, StorageKey } from "@/src/constants";
import { brandColors } from "@/src/constants/Colors";
import { useMMKVString } from "react-native-mmkv";
import { useNotifications } from "@/src/providers/NotificationProvider";

export default function AdminPanelScreen() {
  const { pushToken } = useNotifications();
  const [phoneNumber] = useMMKVString(StorageKey.PHONE_NUMBER);
  const [lastVerificationCode, setLastVerificationCode] = useMMKVString(StorageKey.LAST_VERIFICATION_CODE);
  const [verificationCode, setVerificationCode] = useState('');
  const [showStorageModal, setShowStorageModal] = useState(false);
  const [showSseLogModal, setShowSseLogModal] = useState(false);
  const [showNotificationLogModal, setShowNotificationLogModal] = useState(false);

  const rawToken = pushToken?.match(/\[(\w+)\]/)?.[1];

  const handleSendVerification = async () => {
    await verificationService.send({ to: phoneNumber! });
    const messages = await messagesService.getBetween(PhoneNumber.VERIFICATION, phoneNumber!);

    const lastVerificationCode = messages[messages.length - 1].body.match(/\d{6}/)?.[0];
    if (lastVerificationCode) {
      setLastVerificationCode(lastVerificationCode);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      Alert.alert('Error', 'Please enter verification code');
      return;
    }

    const result = await verificationService.verify({
      to: phoneNumber!,
      code: verificationCode,
    });
    if (result.valid) {
      Alert.alert('Success', 'Code verified successfully!');
    } else {
      Alert.alert('Error', result.message || 'Invalid or expired code');
    }
  };

  return (
    <ScrollView className="flex-1 p-4 bg-white dark:bg-gray-900">
      <AdminInfoDisplay
        phoneNumber={phoneNumber!}
        pushToken={rawToken}
        lastVerificationCode={lastVerificationCode}
      />

      <View className="mb-6">
        <Text className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Verification Code</Text>
        <TouchableOpacity className="bg-blue-500 rounded-xl py-3.5 items-center mb-3" onPress={handleSendVerification}>
          <Text className="text-white text-base font-semibold">Request Code</Text>
        </TouchableOpacity>
        <TextInput
          className="singleline-textinput"
          placeholder="Enter code..."
          placeholderTextColor={brandColors.placeholder}
          value={verificationCode}
          onChangeText={setVerificationCode}
          keyboardType="number-pad"
        />
        <TouchableOpacity className="bg-blue-500 rounded-xl py-3.5 items-center mb-3" onPress={handleVerifyCode}>
          <Text className="text-white text-base font-semibold">Verify</Text>
        </TouchableOpacity>
      </View>

      <View className="mb-6">
        <Text className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">SSE Events</Text>
        <TouchableOpacity
          className="bg-blue-500 rounded-xl py-3.5 items-center mb-3"
          onPress={() => setShowSseLogModal(true)}
        >
          <Text className="text-white text-base font-semibold">View SSE Log</Text>
        </TouchableOpacity>
      </View>

      <View className="mb-6">
        <Text className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Notifications</Text>
        <TouchableOpacity
          className="bg-blue-500 rounded-xl py-3.5 items-center mb-3"
          onPress={() => setShowNotificationLogModal(true)}
        >
          <Text className="text-white text-base font-semibold">View Notification Log</Text>
        </TouchableOpacity>
      </View>

      <View className="mb-6">
        <Text className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Storage</Text>
        <TouchableOpacity
          className="bg-blue-500 rounded-xl py-3.5 items-center mb-3"
          onPress={() => setShowStorageModal(true)}
        >
          <Text className="text-white text-base font-semibold">View MMKV Storage</Text>
        </TouchableOpacity>
      </View>

      <StorageModal isOpen={showStorageModal} onRequestClose={() => setShowStorageModal(false)} />
      <SseLogModal isOpen={showSseLogModal} onRequestClose={() => setShowSseLogModal(false)} />
      <NotificationLogModal isOpen={showNotificationLogModal} onRequestClose={() => setShowNotificationLogModal(false)} />
    </ScrollView>
  );
}
