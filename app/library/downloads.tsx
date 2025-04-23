import { View, Text, FlatList, Image, TouchableOpacity, TextInput } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import useDownloadedSongs from "@/services/useDownloadedSongs";

export default function DownloadsScreen() {
  const router = useRouter();
  const { data: downloadedSongs } = useDownloadedSongs();

  return (
    <View className="flex-1 bg-black px-4 pt-14">
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-white text-2xl mr-4">{`‹`}</Text>
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Downloads</Text>
      </View>

      <Text className="text-gray-400 mb-4">{downloadedSongs?.length || 0} downloaded songs</Text>

      <View className="flex-row bg-white/10 rounded-xl px-4 py-2 mb-4 items-center">
        <TextInput
          placeholder="Search downloads"
          placeholderTextColor="#aaa"
          className="text-white flex-1"
        />
      </View>

      <FlatList
        data={downloadedSongs}
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
