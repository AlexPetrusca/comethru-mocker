import type { Notification, NotificationResponse } from 'expo-notifications';
import PubSubEvent from "@/src/constants/PubSubEvent";
import ThemeMode from "@/src/constants/ThemeMode";
import { Message } from "@/src/services";

interface PubSubPayload {
  [PubSubEvent.API_URL_CHANGED]: string;
  [PubSubEvent.PHONE_NUMBER_CHANGED]: string;
  [PubSubEvent.THEME_TOGGLED]: ThemeMode;
  [PubSubEvent.MESSAGE_RECEIVED]: Message;
  [PubSubEvent.NOTIFICATION_RECEIVED]: Notification;
  [PubSubEvent.NOTIFICATION_TAPPED]: NotificationResponse;
}

export default PubSubPayload;
