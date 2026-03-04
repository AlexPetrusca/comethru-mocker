import axios from 'axios';
import { Platform } from "react-native";

const API_PORT = 8090;
const API_BASE_URL = Platform.OS === "android"
    ? `http://10.0.2.2:${API_PORT}`
    : `http://localhost:${API_PORT}`;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});
