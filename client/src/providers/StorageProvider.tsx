import React, { useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StorageContext, StorageContextData } from "@/src/providers/contexts";
import { StorageKey } from "@/src/constants";

export const StorageProvider: React.FC<{
  children: React.ReactNode,
  initialData?: StorageContextData
}> = ({ children, initialData = {} }) => {
  const [storage, setStorage] = useState<StorageContextData>(initialData as StorageContextData);

  const setItem = async (key: StorageKey, value: string) => {
    await AsyncStorage.setItem(key, value);
    setStorage((prev) => ({ ...prev, [key]: value }));
  };

  const removeItem = async (key: StorageKey) => {
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
