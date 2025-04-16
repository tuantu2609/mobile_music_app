// app/library/artists.tsx
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { images } from "@/constants/images";

const artists = [
  { name: "One Republic", image: images.artist },
  { name: "Coldplay", image: images.artist },
  { name: "The Chainsmokers", image: images.artist },
  { name: "Linkin Park", image: images.artist },
  { name: "Sia", image: images.artist},
  { name: "Ellie Goulding", image: images.artist },
  { name: "Katy Perry", image: images.artist },
  { name: "Maroon 5", image: images.artist },
];

export default function ArtistsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-black px-4 pt-14">
      {/* Header */}
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-white text-2xl mr-4">{`‹`}</Text>
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Artists Following</Text>
      </View>

      <Text className="text-gray-400 mb-4">8 artists following</Text>

      {/* Search */}
      <View className="flex-row bg-white/10 rounded-xl px-4 py-2 mb-6 items-center justify-between">
        <TextInput
          placeholder="Search"
          placeholderTextColor="#aaa"
          className="text-white flex-1"
        />
        <Text className="text-white text-xl">⇅</Text>
      </View>

      {/* Grid */}
      <ScrollView>
        <View className="flex-row flex-wrap justify-between">
          {artists.map((item, index) => (
            <View key={index} className="w-[23%] items-center mb-6">
              <Image
                source={item.image}
                className="w-16 h-16 rounded-full mb-2"
                resizeMode="cover"
              />
              <Text className="text-white text-sm text-center" numberOfLines={1}>
                {item.name}
              </Text>
            </View>
          ))}
          {/* Add More */}
          <TouchableOpacity className="w-[23%] items-center mb-6">
            <View className="w-16 h-16 rounded-full border border-white/30 items-center justify-center">
              <Text className="text-white text-3xl">＋</Text>
            </View>
            <Text className="text-white text-sm mt-1">Add More</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
