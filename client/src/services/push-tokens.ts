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
    await api.post('/push-tokens', {
      phoneNumber,
      token: token.data,
      platform: Platform.OS,
    });
  },

  async unregister(): Promise<void> {
    const token = await Notifications.getExpoPushTokenAsync();
    await api.delete('/push-tokens', {
      data: { token: token.data },
    });
  },
};
