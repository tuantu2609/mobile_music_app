import {
  View,
  Text,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import useSongList from "@/services/useSongList";
import { usePlayerStore } from "@/store/usePlayerStore";
import { icons } from "@/constants/icons";

import { Song } from "@/interfaces/interfaces";

export default function RecentlyPlayedScreen() {
  const { data: songs, loading, error } = useSongList();
  const router = useRouter();

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
            className="w-6 h-6 mr-4"
            resizeMode="contain"
            tintColor="#ffffff"
          />
        </TouchableOpacity>
        <Text className="text-white text-3xl font-bold">Recently Played</Text>
      </View>

      {/* Song list */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {songs?.map((song: Song) => (
          <TouchableOpacity
            key={song.id}
            className="flex-row items-center mb-5"
            onPress={async () => {
              await usePlayerStore.getState().loadSong({
                id: song.id,
                title: song.title,
                artists: song.artists ?? [],
                album_cover: song.album_cover,
                url: song.url,
                duration_ms: song.duration_ms,
                isLiked: song.isLiked,
                isDownloaded: song.isDownloaded,
              });
              router.back();
            }}
          >
            <Image
              source={{ uri: song.album_cover }}
              className="w-16 h-16 rounded-lg mr-4"
              resizeMode="cover"
            />
            <View className="flex-1">
              <Text
                className="text-white text-lg font-semibold"
                numberOfLines={1}
              >
                {song.title}
              </Text>
              {song.artists?.length > 0 && (
                <Text
                  className="text-gray-400 text-base mt-1"
                  numberOfLines={1}
                >
                  {song.artists.map((a) => a.name).join(", ")}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
