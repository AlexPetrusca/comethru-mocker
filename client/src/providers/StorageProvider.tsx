import React, { useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageContext, StorageContextData } from "@/src/providers/contexts";

export const StorageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [storage, setStorage] = useState<StorageContextData>({});

  // Load all keys on mount
  useEffect(() => {
    const loadStorage = async () => {
      const keys = await AsyncStorage.getAllKeys();
      const entries = await AsyncStorage.multiGet(keys);
      const initialData: StorageContextData = {};
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
