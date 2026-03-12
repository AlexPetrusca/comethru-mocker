import { Animated, Text, View } from 'react-native';
import { useSseStatus } from '../providers/SseProvider';

export function SseStatusBanner() {
  const status = useSseStatus();

  if (status === 'connected') return null;

  return (
    <View className="bg-yellow-500 px-4 py-2 items-center">
      <Text className="text-white text-sm">
        {status === 'reconnecting' ? 'Reconnecting...' : 'Disconnected'}
      </Text>
    </View>
  );
}
