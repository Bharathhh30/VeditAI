import { useQuery } from "convex/react";
import { Text, View, useColorScheme } from 'react-native';
import { api } from "../../convex/_generated/api";

export default function Index() {
  const colorScheme = useColorScheme(); // 'light' or 'dark'
  const tasks = useQuery(api.tasks.get);

  const bgColor = colorScheme === 'dark' ? 'bg-white' : 'bg-black';
  const textColor = colorScheme === 'dark' ? 'text-black' : 'text-white';

  return (
    <View className={`flex-1 items-center justify-center ${bgColor}`}>
      <Text className={`text-xl font-bold ${textColor}`}>Checking if this is working</Text>
      <Text className={`mt-2 ${textColor}`}>Color Scheme: {colorScheme}</Text>
      <View>
        {tasks?.map(({ _id, text }) => <Text className="text-white" key={_id}>{text}</Text>)}
      </View>
    </View>
  );
}

