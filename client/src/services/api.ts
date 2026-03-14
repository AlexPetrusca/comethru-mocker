import axios from 'axios';
import { Platform } from "react-native";
import * as Device from 'expo-device';

const API_BASE_URL = Device.isDevice
  ? `http://10.0.0.232:8099`
  : Platform.OS === "android"
    ? `http://10.0.2.2:8090`
    : `http://localhost:8090`;

console.log(Device);

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
