import { createContext } from "react";

export type SseStatus = 'connected' | 'disconnected' | 'reconnecting';

export type SseStatusContextType = SseStatus;

export const SseStatusContext = createContext<SseStatusContextType>('reconnecting');
