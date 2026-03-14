import React, { useEffect, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { PhoneDisplay } from '@/src/components';
import { verificationService, messagesService } from '@/src/services';
import { StorageKey, PhoneNumber, PubSubEvent } from "@/src/constants";
import { useStorage, useSubscription } from "@/src/providers";
import { brandColors } from "@/src/constants/Colors";

export default function AdminPanelScreen() {
  const { storage } = useStorage();
  const [phoneNumber, setPhoneNumber] = useState(storage[StorageKey.PHONE_NUMBER] || PhoneNumber.DEFAULT);
  const [verificationCode, setVerificationCode] = useState('');
  const [verifyStatus, setVerifyStatus] = useState<{
    type: 'success' | 'error';
    message: string
  } | null>(null);
  const [requestCodeStatus, setRequestCodeStatus] = useState<{
    type: 'success' | 'error';
    message: string
  } | null>(null);

  useSubscription(PubSubEvent.PHONE_NUMBER_CHANGED, newPhoneNumber => {
    setPhoneNumber(newPhoneNumber);
  });

  const handleSendVerification = async () => {
    try {
      await verificationService.send({ to: phoneNumber });
      const messages = await messagesService.getBetween(PhoneNumber.VERIFICATION, phoneNumber);

      const lastMessage = messages[messages.length - 1];
      const match = lastMessage.body.match(/\d{6}/);

      setRequestCodeStatus({ type: 'success', message: `Verification code sent: ${match?.[0]}!` });
      setVerifyStatus(null);
    } catch (error) {
      setRequestCodeStatus({ type: 'error', message: 'Failed to send verification code' });
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      setVerifyStatus({ type: 'error', message: 'Please enter verification code' });
      return;
    }

    try {
      const result = await verificationService.verify({
        to: phoneNumber,
        code: verificationCode,
      });
      if (result.valid) {
        setVerifyStatus({ type: 'success', message: 'Code verified successfully!' });
      } else {
        setVerifyStatus({ type: 'error', message: result.message || 'Invalid or expired code' });
      }
      setRequestCodeStatus(null);
    } catch (error) {
      setVerifyStatus({ type: 'error', message: 'Failed to verify code' });
    }
  };

  return (
    <ScrollView className="flex-1 p-4 bg-white dark:bg-gray-900">
      <PhoneDisplay phoneNumber={phoneNumber} label="Your Phone Number" />

      <View className="mb-6">
        <Text className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Verification Code</Text>
        <TouchableOpacity className="bg-blue-500 rounded-xl py-3.5 items-center mb-3" onPress={handleSendVerification}>
          <Text className="text-white text-base font-semibold">Request Code</Text>
        </TouchableOpacity>
        {requestCodeStatus && (
          <Text className={`mt-2 mb-4 p-2.5 rounded-lg text-sm ${requestCodeStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {requestCodeStatus.message}
          </Text>
        )}
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
        {verifyStatus && (
          <Text className={`mt-2 p-2.5 rounded-lg text-sm ${verifyStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {verifyStatus.message}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}
