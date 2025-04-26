import { View, Text, ScrollView, TextInput, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import useFollowedArtists from "@/services/useFollowedArtists";

export default function ArtistsScreen() {
  const router = useRouter();
  const { data: followedArtists } = useFollowedArtists();

  return (
    <View className="flex-1 bg-black px-4 pt-14">
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-white text-2xl mr-4">{`‹`}</Text>
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Artists Following</Text>
      </View>

      <Text className="text-gray-400 mb-4">{followedArtists?.length || 0} artists following</Text>

      <View className="flex-row bg-white/10 rounded-xl px-4 py-2 mb-6 items-center">
        <TextInput placeholder="Search artists" placeholderTextColor="#aaa" className="text-white flex-1" />
      </View>

      <ScrollView>
        <View className="flex-row flex-wrap justify-between">
          {followedArtists?.map((item, index) => (
            <View key={index} className="w-[23%] items-center mb-6">
              <Image source={{ uri: "https://via.placeholder.com/100" }} className="w-16 h-16 rounded-full mb-2" />
              <Text className="text-white text-sm text-center" numberOfLines={1}>{item.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
