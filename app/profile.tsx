import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Switch,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { BlurView } from "expo-blur";
import { useAuth } from "@/app/auth/useAuth";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth(); // ✅ lấy user từ useAuth

  const [autoPlay, setAutoPlay] = useState(false);
  const [showLyrics, setShowLyrics] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace("/auth/login");
  };

  const handleBack = () => {
    router.replace("/(tabs)");
  };

  return (
    <View className="flex-1 bg-black px-6 pb-4">
      {/* Header cố định */}
      <View className="absolute top-12 left-6 right-6 z-10 flex-row justify-between items-center">
        <TouchableOpacity
          onPress={handleBack}
          className="flex-row items-center space-x-2 bg-white/15 border border-white/20 px-4 py-2 rounded-full shadow-md"
        >
          <Image
            source={icons.backBtn}
            className="w-4 h-4"
            resizeMode="contain"
            tintColor="#fff"
          />
        </TouchableOpacity>

        <Text className="text-white text-xl font-bold">My Profile</Text>

        <TouchableOpacity className="bg-white/10 px-4 py-2 rounded-full">
          <Text className="text-white font-medium text-sm">Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Nội dung scroll */}
      <ScrollView
        contentContainerStyle={{
          paddingTop: 100,
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar + Info */}
        <View className="items-center mb-8">
          <Image
            source={images.avatar}
            className="w-24 h-24 rounded-full mb-4"
            resizeMode="cover"
          />
          <Text className="text-white text-xl font-semibold mb-1">
            {user?.name || "Chưa có tên"}
          </Text>
          <Text className="text-white text-sm mt-2 font-semibold">Email</Text>
          <Text className="text-gray-400 text-sm mb-2">
            {user?.email || "-"}
          </Text>
          <Text className="text-white text-sm font-semibold">Phone Number</Text>
          <Text className="text-gray-400 text-sm">{user?.phone || "-"}</Text>
        </View>

        {/* Stats */}
        <View className="flex-row justify-between mb-8">
          {/* Songs */}
          <TouchableOpacity
            onPress={() => router.push("/profile/songs")}
            className="flex-1 mr-2"
            activeOpacity={0.9}
          >
            <BlurView
              intensity={60}
              tint="dark"
              className="rounded-2xl items-center px-4 py-4 overflow-hidden"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              <View className="p-2 rounded-full bg-white/10 border border-white/30 mb-2">
                <Image
                  source={icons.heart}
                  style={{ width: 20, height: 20, tintColor: "#fff" }}
                  resizeMode="contain"
                />
              </View>
              <Text className="text-gray-200 text-xs font-medium">
                120 songs
              </Text>
            </BlurView>
          </TouchableOpacity>

          {/* Playlists */}
          <TouchableOpacity
            onPress={() => router.push("/profile/playlists")}
            className="flex-1 mx-2"
            activeOpacity={0.9}
          >
            <BlurView
              intensity={60}
              tint="dark"
              className="rounded-2xl items-center px-4 py-4 overflow-hidden"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              <View className="p-2 rounded-full bg-white/10 border border-white/30 mb-2">
                <Image
                  source={icons.playlist}
                  style={{ width: 20, height: 20, tintColor: "#fff" }}
                  resizeMode="contain"
                />
              </View>
              <Text className="text-gray-200 text-xs font-medium">
                12 playlists
              </Text>
            </BlurView>
          </TouchableOpacity>

          {/* Artists */}
          <TouchableOpacity
            onPress={() => router.push("/profile/artists")}
            className="flex-1 ml-2"
            activeOpacity={0.9}
          >
            <BlurView
              intensity={60}
              tint="dark"
              className="rounded-2xl items-center px-4 py-4 overflow-hidden"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.05)",
                borderWidth: 1,
                borderColor: "rgba(255,255,255,0.1)",
              }}
            >
              <View className="p-2 rounded-full bg-white/10 border border-white/30 mb-2">
                <Image
                  source={icons.artist}
                  style={{ width: 20, height: 20, tintColor: "#fff" }}
                  resizeMode="contain"
                />
              </View>
              <Text className="text-gray-200 text-xs font-medium">
                3 artists
              </Text>
            </BlurView>
          </TouchableOpacity>
        </View>

        {/* Settings */}
        <Text className="text-white text-xl font-semibold mb-6">Settings</Text>

        <View className="mb-8">
          {/* các mục settings giữ nguyên */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white">Language(s)</Text>
            <Text className="text-gray-300">English, Vietnamese</Text>
          </View>

          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white">Streaming Quality</Text>
            <Text className="text-gray-300">HD</Text>
          </View>

          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white">Download Quality</Text>
            <Text className="text-gray-300">HD</Text>
          </View>

          <TouchableOpacity className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-white">Equalizer</Text>
              <Text className="text-gray-400 text-xs">
                Adjust audio settings
              </Text>
            </View>
            <Text className="text-gray-300">{`›`}</Text>
          </TouchableOpacity>

          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-white">Auto-Play</Text>
            <Switch value={autoPlay} onValueChange={setAutoPlay} />
          </View>

          <View className="flex-row justify-between items-center">
            <Text className="text-white">Show Lyrics on Player</Text>
            <Switch value={showLyrics} onValueChange={setShowLyrics} />
          </View>
        </View>

        {/* Others */}
        <Text className="text-white text-xl font-semibold mb-4">Others</Text>

        <View className="space-y-6">
          <TouchableOpacity className="flex-row justify-between items-center">
            <Text className="text-white">Help & Support</Text>
            <Text className="text-gray-300">{`›`}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Logout cố định dưới */}
      <View className="absolute bottom-6 left-6 right-6 z-10">
        <TouchableOpacity
          onPress={handleLogout}
          className="bg-red-600 py-4 rounded-full items-center"
        >
          <Text className="text-white text-base font-semibold">Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
