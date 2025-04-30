import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { icons } from "@/constants/icons";

import { useAuth } from "@/app/auth/useAuth"; // Import the useAuth hook
import { getUserLikedSongs } from "@/services/useAuth"; // Import the API to fetch liked songs

export default function LibraryScreen() {
  const router = useRouter();
  const { user, loadToken } = useAuth(); // Get user and loadToken from useAuth
  const [likedSongsCount, setLikedSongsCount] = useState(0); // Store the liked songs count
  const [loading, setLoading] = useState(true); // Loading state for fetching liked songs

  useEffect(() => {
    const fetchLikedSongsCount = async () => {
      try {
        const token = await loadToken(); // Load the token using loadToken from useAuth
        if (!token || !user?.id) {
          console.error("Token or user not found!");
          return;
        }

        // Fetch the liked songs count using the API
        const response = await getUserLikedSongs(user.id, token, 10, 0); // Adjust limit and offset as needed
        setLikedSongsCount(response.length); // Set the count of liked songs
      } catch (err) {
        console.error("Error fetching liked songs count:", err);
      } finally {
        setLoading(false); // Stop loading when the data is fetched
      }
    };

    if (user?.id) {
      fetchLikedSongsCount(); // Call the function when user ID is available
    }
  }, [user]); // Fetch liked songs count when the user changes

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white">Loading...</Text>
      </View>
    );
  }

  const libraryItems = [
    {
      title: "Liked Songs",
      subtitle: `${likedSongsCount} songs`, // Display the dynamic liked songs count
      icon: icons.heart,
      route: "/library/liked",
    },
    {
      title: "Downloads",
      subtitle: "0 songs", // Example, modify accordingly
      icon: icons.download,
      route: "/library/downloads",
    },
    {
      title: "Playlists",
      subtitle: "0 playlists", // Example, modify accordingly
      icon: icons.playlist,
      route: "/library/playlists",
    },
    {
      title: "Artists",
      subtitle: "0 artists", // Example, modify accordingly
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
            <Image
              source={item.icon}
              className="w-6 h-6 mb-3"
              resizeMode="contain"
              tintColor="#fff"
            />
            <Text className="text-white font-semibold text-base">{item.title}</Text>
            <Text className="text-gray-400 text-sm">{item.subtitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
