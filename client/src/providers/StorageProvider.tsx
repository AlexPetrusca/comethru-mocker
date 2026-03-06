import React, { useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageContext, StorageContextData } from "@/src/providers/contexts";

export const StorageProvider: React.FC<{
  children: React.ReactNode,
  initialData?: Record<string, string | null>
}> = ({ children, initialData = {} }) => {
  const [storage, setStorage] = useState<StorageContextData>(initialData);

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
