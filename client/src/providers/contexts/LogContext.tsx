import { createContext } from 'react';

export interface LogEntry {
  timestamp: Date;
  type: string;
  data?: any;
}

export interface LogContextType {
  addLog: (key: string, type: string, data?: any) => void;
  getLogs: (key: string) => LogEntry[];
  clearLogs: (key: string) => void;
  clearAllLogs: () => void;
}

export const LogContext = createContext<LogContextType>({
  addLog: () => {},
  getLogs: () => [],
  clearLogs: () => {},
  clearAllLogs: () => {},
});
