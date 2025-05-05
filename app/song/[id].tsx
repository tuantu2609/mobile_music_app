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
import {
  useRouter,
  // useLocalSearchParams
} from "expo-router";
import SongListCard from "@/components/SongListCard";
import SongCard from "@/components/SongCard";
import { usePlayerStore } from "@/store/usePlayerStore";
import axios from "axios";
import Constants from "expo-constants";
import Slider from "@react-native-community/slider";

const API_URL = Constants.expoConfig?.extra?.API_URL;

const SongDetails = () => {
  // const { id } = useLocalSearchParams();
  const router = useRouter();
  const {
    currentSong,
    setQueue,
    queue,
    isPlaying,
    position,
    duration,
    playPause,
    seekTo,
    playNext,
    playPrevious,
  } = usePlayerStore();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQueue = async () => {
      if (!currentSong?.id) return;

      setLoading(true);
      try {
        // Nếu muốn loại luôn current song khỏi queue ban đầu
        const exclude = currentSong.id;

        const { data } = await axios.get(
          `${API_URL}/songs/${currentSong.id}/next?limit=5&exclude=${exclude}`
        );

        setQueue(data);
      } catch (err) {
        console.error("Failed to fetch next queue:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQueue();
  }, [currentSong?.id, setQueue]);

  // useEffect(() => {
  //   const fetchQueue = async () => {
  //     if (!currentSong?.id) return;
  //     setLoading(true);
  //     try {
  //       const nextRes = await axios.get(
  //         `${API_URL}/songs/${currentSong.id}/next`
  //       );
  //       setQueue(nextRes.data);
  //     } catch (error) {
  //       console.error("Error fetching next songs:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchQueue();
  // }, [currentSong?.id, setQueue]);

  if (loading || !currentSong) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#fff" />
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
          <Image source={icons.back} className="w-5 h-5" tintColor="white" />
        </TouchableOpacity>
        <TouchableOpacity className="top-4 right-4 z-50 bg-black/60 p-3 rounded-full">
          <Image source={icons.more} className="w-5 h-5" tintColor="white" />
        </TouchableOpacity>
      </View>

      <ScrollView className="px-6 pt-6">
        {/* Album cover */}
        <View className="items-center mb-4">
          <Image
            key={currentSong.id}
            source={{ uri: currentSong.image }}
            className="w-72 h-72 rounded-2xl"
            resizeMode="cover"
          />
        </View>

        {/* Connect to device */}
        <TouchableOpacity className="self-end bg-white/10 px-4 py-2 rounded-full mb-6">
          <Text className="text-white text-xs">Connect to a device</Text>
        </TouchableOpacity>

        {/* Song info */}
        <View className="mb-6">
          <Text className="text-white text-xl font-bold">
            {currentSong.title}
          </Text>
          <Text className="text-white/70 text-sm mt-1">
            {currentSong.subtitle}
          </Text>
        </View>

        {/* Player controls */}
        <View className="mb-4">
          <View className="flex-row justify-between">
            <Text className="text-white text-xs">
              {Math.floor(position / 60)}:
              {("0" + Math.floor(position % 60)).slice(-2)}
            </Text>
            <Text className="text-white text-xs">
              {Math.floor(duration / 60)}:
              {("0" + Math.floor(duration % 60)).slice(-2)}
            </Text>
          </View>
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            minimumTrackTintColor="#ffffff"
            maximumTrackTintColor="#555"
            thumbTintColor="#fff"
            onSlidingComplete={(value) => seekTo(value)}
          />
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
          <TouchableOpacity onPress={playPrevious}>
            <Image source={icons.prev} className="w-6 h-6" tintColor="white" />
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-white rounded-full p-4"
            onPress={playPause}
          >
            <Image
              source={isPlaying ? icons.pause : icons.play}
              className="w-6 h-6"
              tintColor="black"
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={playNext}>
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
