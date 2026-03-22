import EventSource from 'react-native-sse';
import { api } from './api';

export type SseEvents = 'message' | 'debug';

export const sseService = {
  connect(phoneNumber: string): EventSource<SseEvents> {
    const apiUrl = api.defaults.baseURL;
    return new EventSource<SseEvents>(
      `${apiUrl}/sse/subscribe?id=${encodeURIComponent(phoneNumber)}`
    );
  },
  async sendDebugEvent(id: string, type: string, data?: string): Promise<void> {
    await api.post('/sse/debug', data, {
      params: {
        id,
        type,
      },
    });
  },
};
