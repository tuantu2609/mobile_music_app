import { View, Text, ScrollView, TextInput, TouchableOpacity } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import PlaylistCard from "@/components/PlaylistCard";
import { images } from "@/constants/images";

const playlists = [
  {
    name: "Bật Nó Lên",
    images: [{ url: images.playlist1 }],
    creatorName: "John Doe",
  },
  {
    name: "Relax Vibes",
    images: [{ url: images.playlist2 }],
    creatorName: "Admin",
  },
];

export default function PlaylistsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-black px-4 pt-14">
      {/* Header */}
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-white text-2xl mr-4">{`‹`}</Text>
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Playlists</Text>
      </View>

      {/* Search bar */}
      <View className="flex-row bg-white/10 rounded-xl px-4 py-2 mb-4">
        <TextInput
          placeholder="Search"
          placeholderTextColor="#aaa"
          className="text-white flex-1"
        />
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {playlists.map((item, index) => (
          <PlaylistCard key={index} playlist={item} />
        ))}
      </ScrollView>
    </View>
  );
}
