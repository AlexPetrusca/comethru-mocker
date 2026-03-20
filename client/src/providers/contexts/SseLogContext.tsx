import { createContext } from 'react';

export interface SseLogEntry {
  timestamp: Date;
  type: string;
  data?: any;
}

export interface SseLogContextType {
  logs: SseLogEntry[];
  addLog: (type: string, data?: any) => void;
  clearLogs: () => void;
}

export const SseLogContext = createContext<SseLogContextType>({
  logs: [],
  addLog: () => {},
  clearLogs: () => {},
});
