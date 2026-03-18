import { useContext } from 'react';
import { NotificationContext } from "@/src/providers/contexts";

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}

export const useNotifications = () => useContext(NotificationContext);
