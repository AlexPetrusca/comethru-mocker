import { PubSubEvent } from "@/src/constants";

interface PubSubPayload {
  [PubSubEvent.API_URL_CHANGED]: string;
  [PubSubEvent.PHONE_NUMBER_CHANGED]: string;
  [PubSubEvent.THEME_TOGGLED]: 'light' | 'dark';
}

export default PubSubPayload;
