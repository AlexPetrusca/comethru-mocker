import React, { ReactNode, useContext, useState, useCallback } from 'react';
import { LogContext, LogEntry, LogLevel } from './contexts/LogContext';

const MAX_LOG_ENTRIES = 50;

export function LogProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<Record<string, LogEntry[]>>({});

  const addLog = useCallback((key: string, type: string, data?: any, level: LogLevel = 'INFO') => {
    setLogs(prev => {
      const newLog: LogEntry = {
        timestamp: new Date(),
        type,
        data,
        level,
      };
      const existingLogs = prev[key] || [];
      const updated = [...existingLogs, newLog];
      // Keep only the most recent MAX_LOG_ENTRIES per key
      if (updated.length > MAX_LOG_ENTRIES) {
        return {
          ...prev,
          [key]: updated.slice(updated.length - MAX_LOG_ENTRIES),
        };
      }
      return {
        ...prev,
        [key]: updated,
      };
    });
  }, []);

  const getLogs = useCallback((key: string): LogEntry[] => {
    return logs[key] || [];
  }, [logs]);

  const clearLogs = useCallback((key: string) => {
    setLogs(prev => {
      const { [key]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  const clearAllLogs = useCallback(() => {
    setLogs({});
  }, []);

  return (
    <LogContext.Provider value={{ addLog, getLogs, clearLogs, clearAllLogs }}>
      {children}
    </LogContext.Provider>
  );
}

export const useLog = (key: string) => {
  const context = useContext(LogContext);
  return {
    logs: context.getLogs(key),
    addLog: (type: string, data?: any, level?: LogLevel) => context.addLog(key, type, data, level),
    clearLogs: () => context.clearLogs(key),
  };
};
