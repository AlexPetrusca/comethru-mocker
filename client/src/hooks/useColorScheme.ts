import { useColorScheme as useColorSchemeCore } from 'react-native';

export default function useColorScheme() {
  const coreScheme = useColorSchemeCore();
  return coreScheme === 'unspecified' ? 'light' : coreScheme;
};
