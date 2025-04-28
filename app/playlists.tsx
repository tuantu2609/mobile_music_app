import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { icons } from "@/constants/icons";
import usePlaylistList from "@/services/usePlaylistList";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.API_URL;

export default function PlaylistScreen() {
  const router = useRouter();
  const { data: playlists, loading, error } = usePlaylistList(20); // lấy 20 playlist luôn

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-primary">
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-primary">
        <Text className="text-red-400">{error.message}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-primary px-5">
      {/* Header */}
      <View className="flex-row items-center mt-5 mb-5">
        <TouchableOpacity onPress={() => router.back()}>
          <Image
            source={icons.back}
            className="w-8 h-8 mr-5"
            resizeMode="contain"
            tintColor="white"
          />
        </TouchableOpacity>

        <Text className="text-white text-3xl font-bold">Top Playlists</Text>
      </View>

      {/* List playlists */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {playlists?.map((playlist) => (
          <TouchableOpacity
            key={playlist.id}
            className="flex-row items-center mb-5"
            activeOpacity={0.7}
            onPress={() => {
              // Có thể handle gì đó nếu muốn, ví dụ mở chi tiết playlist
            }}
          >
            {/* Ảnh Playlist */}
            <Image
              source={{
                uri:
                  playlist.images?.[0]?.url ||
                  "https://via.placeholder.com/640",
              }}
              className="w-16 h-16 rounded-lg mr-4"
              resizeMode="cover"
            />

            {/* Tên playlist + người tạo */}
            <View className="flex-1">
              <Text
                className="text-white text-lg font-semibold"
                numberOfLines={1}
              >
                {playlist.name}
              </Text>
              <Text className="text-gray-400 text-base mt-1" numberOfLines={1}>
                Created by {playlist.creatorName || "Unknown"}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
