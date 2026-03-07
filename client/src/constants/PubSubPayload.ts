import PubSubEvent from "@/src/constants/PubSubEvent";
import ThemeMode from "@/src/constants/ThemeMode";
import { Message } from "@/src/services";

interface PubSubPayload {
  [PubSubEvent.API_URL_CHANGED]: string;
  [PubSubEvent.PHONE_NUMBER_CHANGED]: string;
  [PubSubEvent.THEME_TOGGLED]: ThemeMode;
  [PubSubEvent.MESSAGE_RECEIVED]: Message;
}

export default PubSubPayload;
