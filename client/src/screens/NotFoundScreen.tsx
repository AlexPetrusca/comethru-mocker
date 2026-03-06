import { Link, Stack } from 'expo-router';
import { View, Text } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }}/>
      <View className="flex-1 items-center justify-center p-5 bg-white dark:bg-gray-900">
        <Text className="text-xl font-bold mb-4 text-gray-900 dark:text-white">This screen doesn't exist.</Text>
        <Link href="/" className="mt-4 py-4">
          <Text className="text-blue-500 text-base font-semibold">Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}
