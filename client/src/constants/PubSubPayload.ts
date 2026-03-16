import type { Notification, NotificationResponse } from 'expo-notifications';
import PubSubEvent from "@/src/constants/PubSubEvent";
import { Message } from "@/src/services";

interface PubSubPayload {
  [PubSubEvent.MESSAGE_RECEIVED]: Message;
  [PubSubEvent.NOTIFICATION_RECEIVED]: Notification;
  [PubSubEvent.NOTIFICATION_TAPPED]: NotificationResponse;
}

export default PubSubPayload;
