// app/library/downloads.tsx
import { View, Text, TextInput, FlatList, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { images } from "@/constants/images";

const downloadedSongs = [
  { id: "1", title: "Inside Out", artist: "The Chainsmokers, Charlee", image: images.song },
  { id: "2", title: "Young", artist: "The Chainsmokers", image: images.song2 },
  // thêm nếu muốn
];

export default function DownloadsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-black px-4 pt-14">
      {/* Header */}
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-white text-2xl mr-4">{`‹`}</Text>
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Downloads</Text>
      </View>

      <Text className="text-gray-400 mb-4">210 songs downloaded</Text>

      {/* Search */}
      <View className="flex-row bg-white/10 rounded-xl px-4 py-2 mb-4 items-center justify-between">
        <TextInput
          placeholder="Search"
          placeholderTextColor="#aaa"
          className="text-white flex-1"
        />
        <Text className="text-white text-xl">⇅</Text>
      </View>

      <FlatList
        data={downloadedSongs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View className="flex-row items-center mb-4">
            <Image source={item.image} className="w-12 h-12 rounded-md mr-4" />
            <View className="flex-1">
              <Text className="text-white font-medium">{item.title}</Text>
              <Text className="text-gray-400 text-sm">{item.artist}</Text>
            </View>
            <Text className="text-white">⋮</Text>
          </View>
        )}
      />
    </View>
  );
}
