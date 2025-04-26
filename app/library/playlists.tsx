import { View, Text, ScrollView, TextInput, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import useLikedPlaylists from "@/services/useLikedPlaylists";

export default function PlaylistsScreen() {
  const router = useRouter();
  const { data: likedPlaylists } = useLikedPlaylists();

  return (
    <View className="flex-1 bg-black px-4 pt-14">
      {/* Header */}
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-white text-2xl mr-4">{`‹`}</Text>
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Playlists</Text>
      </View>

      {/* Số lượng playlists */}
      <Text className="text-gray-400 mb-4">
        {likedPlaylists?.length || 0} playlists added
      </Text>

      {/* Search */}
      <View className="flex-row bg-white/10 rounded-xl px-4 py-2 mb-4">
        <TextInput
          placeholder="Search playlists"
          placeholderTextColor="#aaa"
          className="text-white flex-1"
        />
      </View>

      {/* Danh sách playlists */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {likedPlaylists?.map((item, index) => (
          <View key={index} className="mr-4">
            <Image
              source={{ uri: item.images?.[0]?.url || "https://via.placeholder.com/150" }}
              className="w-32 h-32 rounded-lg"
            />
            <Text className="text-white mt-2 text-center">{item.name}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
