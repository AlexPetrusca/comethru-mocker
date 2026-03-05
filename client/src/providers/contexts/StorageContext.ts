import { createContext } from "react";

export type StorageData = Record<string, string | null>;

export type StorageContextType = {
    storage: StorageData;
    setItem: (key: string, value: string) => Promise<void>;
    removeItem: (key: string) => Promise<void>;
};

export const StorageContext = createContext<StorageContextType>({
    storage: {},
    setItem: async () => {},
    removeItem: async () => {},
});
