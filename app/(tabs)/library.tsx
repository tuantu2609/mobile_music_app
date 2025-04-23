import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import React from "react";
import { useRouter } from "expo-router";
import { icons } from "@/constants/icons";

import useLikedSongs from "@/services/useLikedSongs";
import useDownloadedSongs from "@/services/useDownloadedSongs";
import useLikedPlaylists from "@/services/useLikedPlaylists";
import useFollowedArtists from "@/services/useFollowedArtists";

export default function LibraryScreen() {
  const router = useRouter();

  const { data: likedSongs } = useLikedSongs();
  const { data: downloadedSongs } = useDownloadedSongs();
  const { data: likedPlaylists } = useLikedPlaylists();
  const { data: followedArtists } = useFollowedArtists();

  const libraryItems = [
    {
      title: "Liked Songs",
      subtitle: `${likedSongs?.length || 0} songs`,
      icon: icons.heart,
      route: "/library/liked",
    },
    {
      title: "Downloads",
      subtitle: `${downloadedSongs?.length || 0} songs`,
      icon: icons.download,
      route: "/library/downloads",
    },
    {
      title: "Playlists",
      subtitle: `${likedPlaylists?.length || 0} playlists`,
      icon: icons.playlist,
      route: "/library/playlists",
    },
    {
      title: "Artists",
      subtitle: `${followedArtists?.length || 0} artists`,
      icon: icons.artist,
      route: "/library/artists",
    },
  ];

  return (
    <View className="flex-1 bg-black px-4 pt-14">
      <Text className="text-white text-2xl font-bold mb-6">Your Library</Text>

      <View className="flex-row flex-wrap justify-between mb-6">
        {libraryItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => router.push(item.route)}
            className="w-[48%] bg-white/5 rounded-xl p-4 mb-4"
            activeOpacity={0.9}
          >
            <Image source={item.icon} className="w-6 h-6 mb-3" resizeMode="contain" tintColor="#fff" />
            <Text className="text-white font-semibold text-base">{item.title}</Text>
            <Text className="text-gray-400 text-sm">{item.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
