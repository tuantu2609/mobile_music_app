import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { icons } from "@/constants/icons"; // thêm icon heart, download, playlist, artist
import { images } from "@/constants/images"; // bg, thumbnails mẫu

export default function LibraryScreen() {
  const router = useRouter();

  const libraryItems = [
    {
      title: "Liked Songs",
      subtitle: "120 songs",
      icon: icons.heart,
      route: "/library/liked",
    },
    {
      title: "Downloads",
      subtitle: "210 songs",
      icon: icons.download,
      route: "/library/downloads",
    },
    {
      title: "Playlists",
      subtitle: "12 playlists",
      icon: icons.playlist,
      route: "/library/playlists",
    },
    {
      title: "Artists",
      subtitle: "3 artists",
      icon: icons.artist,
      route: "/library/artists",
    },
  ];

  const recentlyPlayed = [
    {
      title: "Inside Out",
      artist: "The Chainsmokers, Charlee",
      image: images.song1,
    },
    {
      title: "Young",
      artist: "The Chainsmokers",
      image: images.song2,
    },
    {
      title: "Beach House",
      artist: "The Chainsmokers - Sick",
      image: images.song3,
    },
  ];

  return (
    <View className="flex-1 bg-black px-4 pt-14">
      <Text className="text-white text-2xl font-bold mb-6">Your Library</Text>

      {/* Grid 2x2 */}
      <View className="flex-row flex-wrap justify-between mb-6">
        {libraryItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => router.push(item.route)}
            className="w-[48%] bg-white/5 rounded-xl p-4 mb-4"
            activeOpacity={0.9}
          >
            <Image
              source={item.icon}
              className="w-6 h-6 mb-3"
              resizeMode="contain"
              tintColor="#fff"
            />
            <Text className="text-white font-semibold text-base">
              {item.title}
            </Text>
            <Text className="text-gray-400 text-sm">{item.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Recently Played */}
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-white text-lg font-semibold">Recently Played</Text>
        <TouchableOpacity>
          <Text className="text-gray-400 text-sm">See more</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {recentlyPlayed.map((item, index) => (
          <View key={index} className="flex-row items-center mb-4">
            <Image
              source={item.image}
              className="w-12 h-12 rounded-md mr-4"
              resizeMode="cover"
            />
            <View className="flex-1">
              <Text className="text-white font-medium text-base">
                {item.title}
              </Text>
              <Text className="text-gray-400 text-sm">{item.artist}</Text>
            </View>
            <Text className="text-white">⋮</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
