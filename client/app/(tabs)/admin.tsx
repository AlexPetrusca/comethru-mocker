import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, } from 'react-native';
import { PhoneDisplay } from '@/src/components';
import { verificationService } from '@/src/services/verification';
import StorageKey from "@/src/constants/StorageKey";
import { useSubscribe } from "@/src/providers/PubSubContext";
import PubSubEvent from "@/src/constants/PubSubEvent";
import { messagesService } from "@/src/services/messages";
import { useStorage } from "@/src/providers/StorageProvider";
import { PhoneNumber } from "@/src/constants";



export default function AdminTabScreen() {
    const { storage } = useStorage();
    const [phoneNumber, setPhoneNumber] = useState(PhoneNumber.DEFAULT as string);
    const [verificationCode, setVerificationCode] = useState('');
    const [verifyStatus, setVerifyStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [requestCodeStatus, setRequestCodeStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // on mount
    useEffect(() => {
        const savedNumber = storage[StorageKey.PHONE_NUMBER_KEY];
        if (savedNumber != null) {
            setPhoneNumber(savedNumber);
        }
    }, []);

    useSubscribe(PubSubEvent.PHONE_NUMBER_CHANGED, phoneNumber => {
        setPhoneNumber(phoneNumber);
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
        <ScrollView style={styles.container}>
            <PhoneDisplay phoneNumber={phoneNumber} label="Your Phone Number" />

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Verification Code</Text>
                <TouchableOpacity style={styles.button} onPress={handleSendVerification}>
                    <Text style={styles.buttonText}>Request Code</Text>
                </TouchableOpacity>
                {requestCodeStatus && (
                    <Text style={[styles.statusMessage, requestCodeStatus.type === 'success' ? styles.statusSuccess : styles.statusError]}>
                        {requestCodeStatus.message}
                    </Text>
                )}
                <TextInput
                    style={styles.input}
                    placeholder="Enter code"
                    value={verificationCode}
                    onChangeText={setVerificationCode}
                    keyboardType="number-pad"
                />
                <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
                    <Text style={styles.buttonText}>Verify</Text>
                </TouchableOpacity>
                {verifyStatus && (
                    <Text style={[styles.statusMessage, verifyStatus.type === 'success' ? styles.statusSuccess : styles.statusError]}>
                        {verifyStatus.message}
                    </Text>
                )}
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        marginBottom: 12,
        fontSize: 16,
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 12,
    },
    secondaryButton: {
        backgroundColor: '#5856D6',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    statusMessage: {
        marginBottom: 12,
        padding: 10,
        borderRadius: 6,
        fontSize: 14,
    },
    statusSuccess: {
        backgroundColor: '#d4edda',
        color: '#155724',
    },
    statusError: {
        backgroundColor: '#f8d7da',
        color: '#721c24',
    },
});
