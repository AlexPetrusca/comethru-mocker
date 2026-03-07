import React, { ReactNode, useEffect, useState } from 'react';
import EventSource from 'react-native-sse';
import { api } from "@/src/services";
import { usePubSub } from "@/src/providers/PubSubProvider";
import { PhoneNumber, PubSubEvent, StorageKey } from "@/src/constants";
import { useStorage } from "@/src/providers/StorageProvider";

type SseEvents = 'connected' | 'message' | 'heartbeat';

export function SseProvider({ children }: { children: ReactNode }) {
  const { storage } = useStorage();
  const { publish } = usePubSub();
  const [phoneNumber] = useState(storage[StorageKey.PHONE_NUMBER_KEY] || PhoneNumber.DEFAULT);

  useEffect(() => {
    const es = new EventSource<SseEvents>(
      `${api.defaults.baseURL}/sse/subscribe?id=${encodeURIComponent(phoneNumber)}`
    );

    es.addEventListener('open', () => {
      console.log('SSE connection opened');
    });

    // es.addEventListener('connected', (e) => {
    //   publish();
    // });

    es.addEventListener('message', (e) => {
      publish(PubSubEvent.MESSAGE_RECEIVED, JSON.parse(e.data as string));
    });

    es.addEventListener('error', (e) => {
      console.error('SSE error:', e);
    });

    return () => {
      es.removeAllEventListeners();
      es.close();
    };
  }, [phoneNumber]);

  return <>{children}</>;
}
