import React, { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import EventSource from 'react-native-sse';
import { api } from "@/src/services";
import { usePubSub, useSubscription } from "@/src/providers/PubSubProvider";
import { PhoneNumber, PubSubEvent, StorageKey } from "@/src/constants";
import { useStorage } from "@/src/providers/StorageProvider";

type SseEvents = 'connected' | 'message' | 'heartbeat';
export type SseStatus = 'connected' | 'disconnected' | 'reconnecting';

const MAX_RETRY_DELAY = 30000; // 30 seconds
const INITIAL_RETRY_DELAY = 1000; // 1 second

export function SseProvider({ children }: { children: ReactNode }) {
  const { storage } = useStorage();
  const { publish } = usePubSub();
  const [phoneNumber, setPhoneNumber] = useState(storage[StorageKey.PHONE_NUMBER] || PhoneNumber.DEFAULT);
  const [status, setStatus] = useState<SseStatus>('reconnecting');
  const esRef = useRef<EventSource<SseEvents> | null>(null);
  const retryDelay = useRef(INITIAL_RETRY_DELAY);
  const retryTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useSubscription(PubSubEvent.PHONE_NUMBER_CHANGED, number => {
    setPhoneNumber(number);
  })

  const connect = () => {
    // Clean up existing connection
    if (esRef.current) {
      esRef.current.removeAllEventListeners();
      esRef.current.close();
    }

    const es = new EventSource<SseEvents>(
      `${api.defaults.baseURL}/sse/subscribe?id=${encodeURIComponent(phoneNumber)}`
    );

    esRef.current = es;

    es.addEventListener('open', () => {
      setStatus('connected');
      retryDelay.current = INITIAL_RETRY_DELAY; // reset backoff on success
    });

    // es.addEventListener('connected', (e) => {
    //   publish();
    // });

    es.addEventListener('message', (e) => {
      publish(PubSubEvent.MESSAGE_RECEIVED, JSON.parse(e.data as string));
    });

    es.addEventListener('error', () => {
      setStatus('reconnecting');
      esRef.current?.close();

      // Exponential backoff
      retryTimeout.current = setTimeout(() => {
        retryDelay.current = Math.min(retryDelay.current * 2, MAX_RETRY_DELAY);
        connect();
      }, retryDelay.current);
    });
  };

  useEffect(() => {
    connect();

    return () => {
      if (retryTimeout.current) clearTimeout(retryTimeout.current);
      esRef.current?.removeAllEventListeners();
      esRef.current?.close();
    };
  }, [phoneNumber]);

  return (
    <SseStatusContext.Provider value={status}>
      {children}
    </SseStatusContext.Provider>
  );
}

export const SseStatusContext = React.createContext<SseStatus>('reconnecting');
export const useSseStatus = () => useContext(SseStatusContext);
