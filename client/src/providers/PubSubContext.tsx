import React, { useContext, useEffect, useRef, ReactNode } from 'react';
import { PubSubPayload, PubSubEvent } from "@/src/constants";
import { PubSub, PubSubContext } from "@/src/providers/contexts";

export const PubSubProvider = ({ children }: { children: ReactNode }) => {
  return (
    <PubSubContext.Provider value={{ publish: PubSub.publish, subscribe: PubSub.subscribe }}>
      {children}
    </PubSubContext.Provider>
  );
};

// const { publish, subscribe } = usePubSub();
export const usePubSub = () => {
  const context = useContext(PubSubContext);
  if (!context) throw new Error('usePubSub must be used within a PubSubProvider');
  return context;
};

// useSubscribe(PubSubEvent.SOME_EVENT, (data) => { ... });
export const useSubscription = <T extends PubSubEvent>(
  event: T,
  callback: (data: PubSubPayload[T]) => void
) => {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const unsubscribe = PubSub.subscribe(event, (data) => {
      (callbackRef.current as any)(data);
    });

    return () => unsubscribe();
  }, [event]);
};
