import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import SongListCard from "@/components/SongListCard";
import SongCard from "@/components/SongCard";
import { useAuth } from "@/app/auth/useAuth";

import { usePlayerStore } from "@/store/usePlayerStore";
import { likeSong, unlikeSong, getTotalLikesOfSong } from "@/services/useAuth";
import axios from "axios";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.API_URL;

const SongDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { setQueue, queue } = usePlayerStore();
  const { loadToken } = useAuth();
  const [likes, setLikes] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [song, setSong] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        const token = await loadToken();
        if (!token) {
          console.error("Không tìm thấy token!");
          return;
        }

            // // Fetch danh sách bài tiếp theo
            // const nextRes = await axios.get(`${API_URL}/songs/${id}/next`);
            // setQueue(nextRes.data);

        const res = await axios.get(`${API_URL}/songs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setSong(res.data);

        const likeRes = await getTotalLikesOfSong(id, token);
        setLikes(likeRes.likeCount);

        setIsLiked(res.data.isLiked); // Backend gửi isLiked
      } catch (error) {
        console.error("Lỗi khi lấy thông tin bài hát:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
  }, [id]);

  const handleLike = async () => {
    try {
      const token = await loadToken();
      if (!token) {
        console.error("Không tìm thấy token!");
        return;
      }

      // Gọi API like/unlike
      if (isLiked) {
        await unlikeSong(song.id, token);
      } else {
        await likeSong(song.id, token);
      }

      // Cập nhật lại trạng thái sau khi gọi API thành công
      const likeRes = await getTotalLikesOfSong(song.id, token);
      setLikes(likeRes.likeCount);
      setIsLiked(!isLiked); // Toggle trạng thái sau khi cập nhật thành công
    } catch (error) {
      console.error("Error liking/unliking song:", error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  if (!song) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-black">
        <Text className="text-white">Không tìm thấy bài hát.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="top-4 left-4 z-50 bg-black/60 p-3 rounded-full"
        >
          <Image
            source={icons.back}
            className="w-5 h-5"
            tintColor="white"
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity className="top-4 right-4 z-50 bg-black/60 p-3 rounded-full">
          <Image
            source={icons.download}
            className="w-6 h-6"
            tintColor="white"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <ScrollView className="px-6 pt-6">
        {/* Album cover */}
        <View className="items-center mb-4">
          <Image
            source={{ uri: song.album_cover }}
            className="w-72 h-72 rounded-2xl"
            resizeMode="cover"
          />
        </View>

        {/* Connect to device */}
        <TouchableOpacity className="self-end bg-white/10 px-4 py-2 rounded-full mb-6">
          <Text className="text-white text-xs">Connect to a device</Text>
        </TouchableOpacity>

        {/* Song info */}
        <View className="mb-6 flex-row justify-between items-center">
          <View>
            <Text className="text-white text-xl font-bold">{song.title}</Text>
            <Text className="text-white/70 text-sm mt-1">
              {song.Artists?.map((a: any) => a.name).join(", ")}
            </Text>
          </View>

          <TouchableOpacity
            onPress={handleLike}
            className="flex-row items-center ml-auto"
          >
            <Text className="text-white mr-2 text-sm">{likes}</Text>
            <Image
              source={isLiked ? icons.heart_fill : icons.heart}
              className="w-6 h-6"
              tintColor="white"
            />
          </TouchableOpacity>
        </View>

        {/* Player controls */}
        <View className="mb-4">
          <View className="flex-row justify-between">
            <Text className="text-white text-xs">0:00</Text>
            <Text className="text-white text-xs">
              {song.duration_ms
                ? (song.duration_ms / 60000).toFixed(2)
                : "3:00"}
            </Text>
          </View>
          <View className="w-full h-1 bg-white/20 rounded-full mt-2">
            <View className="w-[20%] h-full bg-white rounded-full" />
          </View>
        </View>

        {/* Buttons */}
        <View className="flex-row items-center justify-between px-4 mt-4 mb-6">
          <TouchableOpacity>
            <Image
              source={icons.shuffle}
              className="w-5 h-5"
              tintColor="white"
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={icons.prev} className="w-6 h-6" tintColor="white" />
          </TouchableOpacity>
          <TouchableOpacity className="bg-white rounded-full p-4">
            <Image source={icons.play} className="w-6 h-6" tintColor="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={icons.next} className="w-6 h-6" tintColor="white" />
          </TouchableOpacity>

          <TouchableOpacity>
            <Image
              source={icons.repeat}
              className="w-5 h-5"
              tintColor="white"
            />
          </TouchableOpacity>
        </View>

        {/* Up Next */}
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-white font-semibold text-base">Up Next</Text>
          <Text className="text-white/50 text-sm">Queue</Text>
        </View>

        <View className="bg-white/5 rounded-xl">
          {queue.length === 0 ? (
            <Text className="text-white p-4">Danh sách Up Next trống</Text>
          ) : (
            queue.map((s: any) => (
              <SongListCard
                key={s.id}
                song={{
                  id: s.id,
                  title: s.title,
                  subtitle: s.Artists?.map((a: any) => a.name).join(", "),
                  image: s.album_cover,
                }}
              />
            ))
          )}
        </View>

        {/* Similar Songs */}
        <View className="mt-10">
          <Text className="text-white text-3xl font-bold mb-2">
            Songs similar to this
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            <SongCard title="Tên bài hát 1" image={images.song2} />
            <SongCard title="Tên bài hát 2" image={images.song} />
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SongDetails;
