import React, { useContext, useEffect, useRef, ReactNode } from 'react';
import PubSubEvent from "@/src/constants/PubSubEvent";
import PubSubPayload from "@/src/constants/PubSubPayload";
import { PubSub, PubSubContext } from "@/src/providers/contexts/PubSubContext";

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

// const publish = usePublish();
// publish(PubSubEvent.SOME_EVENT, data);
export const usePublish = () => {
    const { publish } = usePubSub();
    return publish;
};

// useSubscribe(PubSubEvent.SOME_EVENT, (data) => { ... });
export const useSubscribe = <T extends PubSubEvent>(
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
