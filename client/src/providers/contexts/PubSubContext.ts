import { createContext } from "react";
import { PubSubEvent, PubSubPayload } from "@/src/constants";

const listeners: Record<string, Function[]> = {};

export const PubSub = {
  subscribe: <T extends PubSubEvent>(event: T, callback: (data: PubSubPayload[T]) => void) => {
    if (!listeners[event]) {
      listeners[event] = [];
    }

    listeners[event].push(callback);

    return () => {
      listeners[event] = listeners[event].filter((cb) => cb !== callback);
    };
  },

  publish: <T extends PubSubEvent>(event: T, data: PubSubPayload[T]) => {
    listeners[event]?.forEach((callback) => callback(data));
  }
};

export interface PubSubContextType {
  publish: typeof PubSub.publish;
  subscribe: typeof PubSub.subscribe;
}

export const PubSubContext = createContext<PubSubContextType | undefined>(undefined);
