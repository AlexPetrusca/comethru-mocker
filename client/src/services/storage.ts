import { createMMKV } from 'react-native-mmkv'
import { PhoneNumber, StorageKey } from '@/src/constants';
import { API_BASE_URL } from '@/src/services/api';
import ThemeMode from '../constants/ThemeMode';

export const storage = createMMKV();

if (!storage.contains(StorageKey.API_URL)) {
  storage.set(StorageKey.API_URL, API_BASE_URL);
}
if (!storage.contains(StorageKey.PHONE_NUMBER)) {
  storage.set(StorageKey.PHONE_NUMBER, PhoneNumber.DEFAULT);
}
if (!storage.contains(StorageKey.THEME)) {
  storage.set(StorageKey.THEME, ThemeMode.SYSTEM);
}
