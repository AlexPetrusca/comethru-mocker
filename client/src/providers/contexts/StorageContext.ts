import { createContext } from "react";
import { StorageKey } from "@/src/constants";

export type StorageContextData = Record<StorageKey, string | null>;

export type StorageContextType = {
  storage: StorageContextData;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

const defaultStorage = Object.values(StorageKey).reduce(
  (acc, key) => ({ ...acc, [key]: null }),
  {} as StorageContextData
);

export const StorageContext = createContext<StorageContextType>({
  storage: defaultStorage,
  setItem: async () => {},
  removeItem: async () => {},
});
