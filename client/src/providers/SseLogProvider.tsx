import React, { ReactNode, useContext, useState, useCallback } from 'react';
import { SseLogContext, SseLogContextType, SseLogEntry } from './contexts/SseLogContext';

const MAX_SSE_LOG_ENTRIES = 50;

export function SseLogProvider({ children }: { children: ReactNode }) {
  const [logs, setLogs] = useState<SseLogEntry[]>([]);

  const addLog = useCallback((type: string, data?: any) => {
    setLogs(prev => {
      const newLog: SseLogEntry = {
        timestamp: new Date(),
        type,
        data,
      };
      const updated = [...prev, newLog];
      // Keep only the most recent MAX_SSE_LOG_ENTRIES
      if (updated.length > MAX_SSE_LOG_ENTRIES) {
        return updated.slice(updated.length - MAX_SSE_LOG_ENTRIES);
      }
      return updated;
    });
  }, []);

  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  return (
    <SseLogContext.Provider value={{ logs, addLog, clearLogs }}>
      {children}
    </SseLogContext.Provider>
  );
}

export const useSseLog = (): SseLogContextType => useContext(SseLogContext);
