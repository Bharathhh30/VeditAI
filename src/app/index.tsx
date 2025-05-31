import { Text, View, useColorScheme } from 'react-native';

export default function Index() {
  const colorScheme = useColorScheme(); // 'light' or 'dark'

  const bgColor = colorScheme === 'dark' ? 'bg-white' : 'bg-black';
  const textColor = colorScheme === 'dark' ? 'text-black' : 'text-white';

  return (
    <View className={`flex-1 items-center justify-center ${bgColor}`}>
      <Text className={`text-xl font-bold ${textColor}`}>Checking if this is working</Text>
      <Text className={`mt-2 ${textColor}`}>Color Scheme: {colorScheme}</Text>
    </View>
  );
}
