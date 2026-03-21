import { createContext } from 'react';

export type LogLevel = 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR';

export interface LogEntry {
  timestamp: Date;
  type: string;
  data?: any;
  level: LogLevel;
}

export interface LogContextType {
  addLog: (key: string, type: string, data?: any, level?: LogLevel) => void;
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
