import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useCallback } from "react";
import { useRouter, useFocusEffect } from "expo-router";
import useDownloadedSongs from "@/services/useDownloadedSongs";
import {
  deleteDownloadedSong,
  getLocalSongPath,
} from "@/services/useDownloadedManager";
import { useAuth } from "@/app/auth/useAuth";
import { icons } from "@/constants/icons";
import { useQueryClient } from "@tanstack/react-query";
import { usePlayerStore } from "@/store/usePlayerStore";

export default function DownloadsScreen() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { loadToken, user } = useAuth();
  const { setCurrentSong } = usePlayerStore();
  const { data: downloadedSongs = [] } = useDownloadedSongs(user?.id);

  // ✅ Refetch danh sách mỗi khi quay lại màn
  useFocusEffect(
    useCallback(() => {
      if (user?.id) {
        queryClient.invalidateQueries(["downloadedSongs", user.id]);
      }
    }, [user?.id])
  );

  const handleDelete = async (songId: string) => {
    try {
      const token = await loadToken();
      if (!token || !user?.id) return;

      await deleteDownloadedSong(songId, user.id, token);

      // ✅ Xoá khỏi cache ngay
      queryClient.setQueryData(["downloadedSongs", user.id], (oldData: any[]) =>
        oldData?.filter((s) => s.id !== songId)
      );
    } catch (err) {
      console.error("❌ Delete song failed:", err);
    }
  };

  const handlePlayOffline = async (item: any) => {
    const localPath = getLocalSongPath(item.id);

    setCurrentSong({
      ...item,
      preview_url: localPath,
    });

    router.push({
      pathname: `/song/${item.id}`,
      params: {
        id: item.id,
        fromDownloadedPage: "true",
        song: encodeURIComponent(JSON.stringify(item)),
      },
    });
  };

  return (
    <View className="flex-1 bg-black px-4 pt-14">
      {/* Header */}
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-white text-2xl mr-4">‹</Text>
        </TouchableOpacity>
        <Text className="text-white text-2xl font-bold">Downloads</Text>
      </View>

      {/* Summary */}
      <Text className="text-gray-400 mb-4">
        {downloadedSongs.length} downloaded songs
      </Text>

      {/* Search */}
      <View className="flex-row bg-white/10 rounded-xl px-4 py-2 mb-4 items-center">
        <TextInput
          placeholder="Search downloads"
          placeholderTextColor="#aaa"
          className="text-white flex-1"
        />
      </View>

      {/* List */}
      <FlatList
        data={downloadedSongs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handlePlayOffline(item)}
            className="flex-row items-center mb-4"
          >
            <Image
              source={{ uri: item.album_cover }}
              className="w-12 h-12 rounded-md mr-4"
            />
            <View className="flex-1">
              <Text className="text-white font-medium">{item.title}</Text>
              <Text className="text-gray-400 text-sm">
                {item.Artists?.map((a) => a.name).join(", ") || "Unknown Artist"}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              className="p-2"
            >
              <Image
                source={icons.remove}
                className="w-5 h-5"
                tintColor="white"
              />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
