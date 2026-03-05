import { createContext } from "react";

export type StorageContextData = Record<string, string | null>;

export type StorageContextType = {
  storage: StorageContextData;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

export const StorageContext = createContext<StorageContextType>({
  storage: {},
  setItem: async () => {},
  removeItem: async () => {},
});
