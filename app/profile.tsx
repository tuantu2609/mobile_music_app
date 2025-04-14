import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { images } from "@/constants/images"; // avatar
import { icons } from "@/constants/icons"; // icon quay lại

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = () => {
    router.replace("/auth/login");
  };

  const handleBack = () => {
    router.replace("/(tabs)");
  };

  return (
    <View className="flex-1 bg-black items-center justify-center px-6">
      {/* Nút quay lại */}
      <TouchableOpacity
        onPress={handleBack}
        className="absolute top-12 left-5 flex-row items-center space-x-2 bg-white/15 border border-white/20 px-4 py-2 rounded-full shadow-md"
      >
        <Image
          source={icons.backBtn}
          className="w-4 h-4"
          resizeMode="contain"
          tintColor="#fff"
        />
        {/* <Text className="text-white text-base">Quay lại</Text> */}
      </TouchableOpacity>

      {/* Avatar */}
      <Image
        source={images.avatar}
        className="w-32 h-32 rounded-full mb-6"
        resizeMode="cover"
      />

      {/* Tên người dùng */}
      <Text className="text-white text-2xl font-bold mb-6">Tu Đẹp Trai</Text>

      {/* Đăng xuất */}
      <TouchableOpacity
        onPress={handleLogout}
        className="bg-red-600 px-6 py-3 rounded-xl"
      >
        <Text className="text-white text-lg font-semibold">Đăng xuất</Text>
      </TouchableOpacity>
    </View>
  );
}
