import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { icons } from "@/constants/icons";
import SongListCard from "@/components/SongListCard";
import { useEffect, useState } from "react";
import axios from "axios";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.API_URL;

const screenWidth = Dimensions.get("window").width;

const AlbumDetails = () => {
  const { id } = useLocalSearchParams();
  console.log("🚀 Album ID đang fetch là:", id);
  const router = useRouter();
  const width = screenWidth * 0.25;

  const [album, setAlbum] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlbum = async () => {
      try {
        const res = await axios.get(`${API_URL}/albums/${id}`);
        setAlbum(res.data);
      } catch (error) {
        console.error("Error fetching album:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbum();
  }, [id]);

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  if (!album) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-black">
        <Text className="text-white">Không tìm thấy album.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 relative">
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-4 left-4 z-50 bg-black/60 p-3 rounded-full"
        >
          <Image
            source={icons.back}
            className="w-5 h-5"
            tintColor="white"
            resizeMode="contain"
          />
        </TouchableOpacity>

        <ScrollView>
          {/* Album Cover */}
          <View className="relative w-full h-64">
            <Image
              source={{ uri: album.album_cover }}
              className="w-full h-full"
              resizeMode="cover"
            />
            <View className="absolute inset-0 bg-black/40 justify-end px-4 pb-4">
              <Text className="text-white text-3xl font-bold">
                {album.name}
              </Text>
              <Text className="text-white/70 text-sm mt-1">Album</Text>
            </View>
          </View>

          {/* Info */}
          <View className="px-4 mt-4 mb-2">
            <Text className="text-white/70">
              {album.Songs?.length ?? 0} songs
            </Text>
          </View>

          {/* List Songs */}
          {album.Songs.map((song: any) => (
            <SongListCard
              key={song.id}
              song={{
                id: song.id,
                title: song.title,
                subtitle: song.Artists?.map((a: any) => a.name).join(", "),
                image: song.album_cover,
              }}
            />
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default AlbumDetails;
