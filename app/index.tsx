//logic điều hướng ban đầu
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";

export default function IndexScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("auth/login"); // hoặc sang tabs nếu có token
    }, 10);
    return () => clearTimeout(timer);
  }, []);
  console.log("✅ index.tsx đã được load!");
  return (
    <View className="flex-1 justify-center items-center bg-black">
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
}
