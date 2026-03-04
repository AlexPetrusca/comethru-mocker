import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type StorageData = Record<string, string | null>;

type StorageContextType = {
    storage: StorageData;
    setItem: (key: string, value: string) => Promise<void>;
    removeItem: (key: string) => Promise<void>;
};

const StorageContext = createContext<StorageContextType>({
    storage: {},
    setItem: async () => {},
    removeItem: async () => {},
});

export const StorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [storage, setStorage] = useState<StorageData>({});

    // Load all keys on mount
    useEffect(() => {
        const loadStorage = async () => {
            const keys = await AsyncStorage.getAllKeys();
            const entries = await AsyncStorage.multiGet(keys);
            const initialData: StorageData = {};
            entries.forEach(([key, value]) => {
                initialData[key] = value;
            });
            setStorage(initialData);
        };

        loadStorage();
    }, []);

    const setItem = async (key: string, value: string) => {
        await AsyncStorage.setItem(key, value);
        setStorage((prev) => ({ ...prev, [key]: value }));
    };

    const removeItem = async (key: string) => {
        await AsyncStorage.removeItem(key);
        setStorage((prev) => {
            const copy = { ...prev };
            delete copy[key];
            return copy;
        });
    };

    return (
        <StorageContext.Provider value={{ storage, setItem, removeItem }}>
            {children}
        </StorageContext.Provider>
    );
};

export const useStorage = () => useContext(StorageContext);
