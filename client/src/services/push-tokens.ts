import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { api } from './api';

export interface PushToken {
  phoneNumber: string;
  token: string;
  platform: string;
}

export const pushTokenService = {
  async register(phoneNumber: string): Promise<void> {
    const token = await Notifications.getExpoPushTokenAsync();
    await api.post('/notifications/push-tokens', {
      phoneNumber,
      token: token.data,
      platform: Platform.OS,
    });
  },

  async unregister(): Promise<void> {
    const token = await Notifications.getExpoPushTokenAsync();
    await api.delete(`/notifications/push-tokens/${encodeURIComponent(token.data)}`);
  },

  async sendDebug(phoneNumber: string, title: string, body?: string): Promise<void> {
    await api.post('/notifications/debug', null, {
      params: {
        phoneNumber,
        title,
        body: body || 'This is a debug notification',
      },
    });
  },
};
