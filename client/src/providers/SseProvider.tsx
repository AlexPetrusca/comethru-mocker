import React, { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import EventSource from 'react-native-sse';
import { useMMKVString } from "react-native-mmkv";
import { usePubSub } from "@/src/providers/PubSubProvider";
import { PubSubEvent, StorageKey } from "@/src/constants";
import { SseStatus, SseStatusContext } from "@/src/providers/contexts/SseStatusContext";
import { useLog } from "@/src/providers/LogProvider";

type SseEvents = 'message';

const MAX_RETRY_DELAY = 30000; // 30 seconds
const INITIAL_RETRY_DELAY = 1000; // 1 second

export function SseProvider({ children }: { children: ReactNode }) {
  const { publish } = usePubSub();
  const { addLog } = useLog('sse');
  const [phoneNumber] = useMMKVString(StorageKey.PHONE_NUMBER);
  const [apiUrl] = useMMKVString(StorageKey.API_URL);
  const [status, setStatus] = useState<SseStatus>('reconnecting');
  const esRef = useRef<EventSource<SseEvents> | null>(null);
  const retryDelay = useRef(INITIAL_RETRY_DELAY);
  const retryTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // todo: need to handle apiUrl changing
  //  - close existing connection
  //  - open new one
  const connect = () => {
    // Clean up existing connection
    if (esRef.current != null) {
      esRef.current.removeAllEventListeners();
      esRef.current.close();
    }

    const es = new EventSource<SseEvents>(
      `${apiUrl}/sse/subscribe?id=${encodeURIComponent(phoneNumber!)}`
    );

    esRef.current = es;

    es.addEventListener('open', () => {
      setStatus('connected');
      addLog('connection', { status: 'connected' });
      retryDelay.current = INITIAL_RETRY_DELAY; // reset backoff on success
    });

    es.addEventListener('message', (e) => {
      addLog('message', JSON.parse(e.data!));
      publish(PubSubEvent.MESSAGE_RECEIVED, JSON.parse(e.data!));
    });

    es.addEventListener('error', e => {
      setStatus('reconnecting');
      addLog('error', { status: 'reconnecting', error: e });
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

export const useSseStatus = () => useContext(SseStatusContext);
