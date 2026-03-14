import { createContext } from 'react';
import type { Notification, NotificationResponse } from 'expo-notifications';

export interface NotificationContextType {
  token: string | null;
  notification: Notification | null;
  notificationTap: NotificationResponse | null | undefined;
}

export const NotificationContext = createContext<NotificationContextType>({
  token: null,
  notification: null, // todo: do we need to expose this?
  notificationTap: null, // todo: do we need to expose this?
});
