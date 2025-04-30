import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/app/auth/useAuth";
import { getUserLikedSongs, unlikeSong } from "@/services/useAuth";
import { icons } from "@/constants/icons"; // ✅ Sử dụng icon từ constants

export default function LikedSongsScreen() {
  const router = useRouter();
  const { user, loadToken } = useAuth();
  const [likedSongs, setLikedSongs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSongs, setFilteredSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLikedSongs = async () => {
      try {
        const token = await loadToken();
        if (!token || !user) {
          console.error("Token or user not found!");
          return;
        }

        const songs = await getUserLikedSongs(user.id, token);
        setLikedSongs(songs);
        setFilteredSongs(songs);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchLikedSongs();
    }
  }, [user]);

  useEffect(() => {
    if (searchQuery === "") {
      setFilteredSongs(likedSongs);
    } else {
      const filtered = likedSongs.filter((song) =>
        song.song.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSongs(filtered);
    }
  }, [searchQuery, likedSongs]);

  const handleUnlike = async (songId) => {
    try {
      const token = await loadToken();
      if (!token) {
        console.error("Token not found!");
        return;
      }
      await unlikeSong(songId, token);
      setLikedSongs((prevSongs) =>
        prevSongs.filter((song) => song.song.id !== songId)
      );
      setFilteredSongs((prevSongs) =>
        prevSongs.filter((song) => song.song.id !== songId)
      );
    } catch (err) {
      console.error("Error unliking song:", err);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white">Đang tải...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black px-4 pt-14">
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-white text-2xl mr-4">‹</Text>
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Liked Songs</Text>
      </View>

      <Text className="text-gray-400 mb-4">
        {filteredSongs?.length || 0} liked songs
      </Text>

      <View className="flex-row bg-white/10 rounded-xl px-4 py-2 mb-4 items-center">
        <TextInput
          placeholder="Search songs"
          placeholderTextColor="#aaa"
          className="text-white flex-1"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {error ? (
        <Text className="text-red-400">{error.message}</Text>
      ) : (
        <FlatList
          data={filteredSongs}
          keyExtractor={(item) => item.song.id}
          renderItem={({ item }) => (
            <View className="flex-row items-center mb-4">
              <Image
                source={{ uri: item.song.album_cover }}
                className="w-12 h-12 rounded-md mr-4"
              />
              <View className="flex-1">
                <Text className="text-white font-medium">
                  {item.song.title}
                </Text>
                <Text className="text-gray-400 text-sm">
                  {item.song.Artists?.map((a) => a.name).join(", ") ||
                    "Unknown Artist"}
                </Text>
              </View>

              <TouchableOpacity onPress={() => handleUnlike(item.song.id)}>
                <Image
                  source={icons.remove}
                  className="w-5 h-5"
                  resizeMode="contain"
                  tintColor="#fff"
                />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}
