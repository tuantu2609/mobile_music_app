import { View, Text, FlatList, Image, TouchableOpacity, TextInput } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import useLikedSongs from "@/services/useLikedSongs";

export default function LikedSongsScreen() {
  const router = useRouter();
  const { data: likedSongs } = useLikedSongs();

  return (
    <View className="flex-1 bg-black px-4 pt-14">
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-white text-2xl mr-4">{`‹`}</Text>
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Liked Songs</Text>
      </View>

      <Text className="text-gray-400 mb-4">{likedSongs?.length || 0} liked songs</Text>

      <View className="flex-row bg-white/10 rounded-xl px-4 py-2 mb-4 items-center">
        <TextInput
          placeholder="Search songs"
          placeholderTextColor="#aaa"
          className="text-white flex-1"
        />
      </View>

      <FlatList
        data={likedSongs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="flex-row items-center mb-4">
            <Image source={{ uri: item.album_cover }} className="w-12 h-12 rounded-md mr-4" />
            <View className="flex-1">
              <Text className="text-white font-medium">{item.title}</Text>
              <Text className="text-gray-400 text-sm">{item.Artists.map(a => a.name).join(", ")}</Text>
            </View>
            <Text className="text-white">⋮</Text>
          </View>
        )}
      />
    </View>
  );
}
