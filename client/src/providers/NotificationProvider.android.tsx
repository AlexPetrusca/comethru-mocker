import { useContext, useEffect, useRef, useState } from 'react';
import { Platform } from "react-native";
import { useMMKVString } from "react-native-mmkv";
import { useRouter } from 'expo-router';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { NotificationContext } from "@/src/providers/contexts";
import { usePubSub } from "@/src/providers/PubSubProvider";
import { PubSubEvent, StorageKey } from "@/src/constants";
import { pushTokenService } from "@/src/services/push-tokens";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false
  })
});

const IS_IOS_SIMULATOR = !Device.isDevice && Platform.OS === 'ios';

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { publish } = usePubSub();

  const [phoneNumber] = useMMKVString(StorageKey.PHONE_NUMBER);
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);

  const notificationTap = Notifications.useLastNotificationResponse();
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);

  async function registerForPushNotifications(): Promise<string | null> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Permission not granted for push notifications');
      return null;
    }

    try {
      const expoPushToken = await Notifications.getExpoPushTokenAsync();
      return expoPushToken.data;
    } catch (e) {
      console.warn('Failed to get push token:', e);
      return null;
    }
  }

  useEffect(() => {
    if (IS_IOS_SIMULATOR) {
      console.warn('Push notifications not supported on iOS simulator');
      return;
    }

    registerForPushNotifications().then(pushToken => {
      if (pushToken) {
        setPushToken(pushToken);
        console.log('Register Push notification listener', pushToken, phoneNumber);
        pushTokenService.register(phoneNumber!);
      }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification', notification);
      setNotification(notification);
      publish(PubSubEvent.NOTIFICATION_RECEIVED, notification);
    });

    return () => {
      notificationListener.current?.remove();
    };
  }, []);

  useEffect(() => {
    if (notificationTap != null) {
      console.log("Notification Tap:", notificationTap)
      const data = notificationTap.notification.request.content.data;

      // Navigate to conversation if notification contains conversation data
      if (data?.type === 'conversation') {
        const otherParty = data.from as string;
        console.log('Navigating to conversation with:', otherParty);
        router.push(`/messages/${encodeURIComponent(otherParty)}`);
      }

      publish(PubSubEvent.NOTIFICATION_TAPPED, notificationTap);
    }
  }, [notificationTap]);

  useEffect(() => {
    if (IS_IOS_SIMULATOR) return;
    pushTokenService.register(phoneNumber!);
  }, [phoneNumber])

  return (
    <NotificationContext.Provider value={{ pushToken, notification, notificationTap }}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => useContext(NotificationContext);
