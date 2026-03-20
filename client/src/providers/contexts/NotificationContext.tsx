import { createContext } from 'react';
import type { Notification, NotificationResponse } from 'expo-notifications';

export interface NotificationContextType {
  pushToken: string | null;
  notification: Notification | null;
  notificationTap: NotificationResponse | null | undefined;
}

export const NotificationContext = createContext<NotificationContextType>({
  pushToken: null,
  notification: null,
  notificationTap: null,
});
