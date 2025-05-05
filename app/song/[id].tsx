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
import { useAuth } from "@/app/auth/useAuth";
import { usePlayerStore } from "@/store/usePlayerStore";
import { likeSong, unlikeSong, getTotalLikesOfSong } from "@/services/useAuth";
import axios from "axios";
import Constants from "expo-constants";

import {
  isSongDownloaded,
  downloadSongToDevice,
  deleteDownloadedSong,
  getLocalSongPath,
} from "@/services/useDownloadedManager";
import useAudioPlayer from "@/services/useAudioPlayer";
import Slider from "@react-native-community/slider";


const API_URL = Constants.expoConfig?.extra?.API_URL;

const formatDuration = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const SongDetails = () => {
  const { id, fromDownloadedPage, song: songParam } = useLocalSearchParams();
  const { user, loadToken } = useAuth();
  const { play, unload } = useAudioPlayer();

  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [song, setSong] = useState<any>(null);
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
  const [downloaded, setDownloaded] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    const loadSong = async () => {
      // 🧠 Xử lý chế độ offline trước
      if (fromDownloadedPage === "true" && songParam) {
        try {
          const localSong = JSON.parse(decodeURIComponent(songParam));
          const path = getLocalSongPath(id);
          setSong({
            ...localSong,
            preview_url: path,
          });
          setIsOffline(true);
          setLoading(false); // ✅ stop loading!
          return;
        } catch (e) {
          console.error("❌ Lỗi giải mã songParam:", e);
          setLoading(false);
          return;
        }
      }

      // 🔁 Nếu không phải offline, thì tiếp tục fetch như cũ
      if (!user) return;

      try {
        const token = await loadToken();
        if (!token || !user?.id) throw new Error("Thiếu token hoặc user");

        const isDown = await isSongDownloaded(id, user.id, token);
        setDownloaded(isDown);

        const res = await axios.get(${API_URL}/songs/${id}, {
          headers: { Authorization: Bearer ${token} },
        });
        setSong(res.data);
        setIsLiked(res.data.isLiked);

        const likeRes = await getTotalLikesOfSong(id, token);
        setLikes(likeRes.likeCount);
      } catch (err) {
        console.warn("❌ loadSong error:", err);
      } finally {
        setLoading(false); // ✅ đảm bảo luôn kết thúc loading
      }
    };

    loadSong();

    return () => {
      unload();
    };
  }, [id, user]);

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
  
  const handleLike = async () => {
    try {
      const token = await loadToken();
      if (!token) return;
      if (isLiked) await unlikeSong(song.id, token);
      else await likeSong(song.id, token);

      const res = await getTotalLikesOfSong(song.id, token);
      setLikes(res.likeCount);
      setIsLiked(!isLiked);
    } catch (err) {
      console.error("Like error", err);
    }
  };

  const handleDownload = async () => {
    try {
      const token = await loadToken();
      if (!token || !user?.id || !(song.preview_url || song.url)) return;

      if (downloaded) {
        await deleteDownloadedSong(song.id, user.id, token);
        setDownloaded(false);
      } else {
        await downloadSongToDevice(
          { id: song.id, url: song.preview_url || song.url },
          user.id,
          token
        );
        setDownloaded(true);
      }
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  const handlePlay = () => {
    if (song?.preview_url) {
      setCurrentSong(song);
      play(song.preview_url);
    }
  };

//   const renderImage = () => {
//     if (typeof song.album_cover === "number") return song.album_cover;
//     if (typeof song.album_cover === "string") return { uri: song.album_cover };
//     return images.song;
//   };
  
  if (loading || !currentSong) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#fff" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-row justify-between items-center mb-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="top-4 left-4 z-50 bg-black/60 p-3 rounded-full"
        >
          <Image source={icons.back} className="w-5 h-5" tintColor="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleDownload}
          className="top-4 right-4 z-50 bg-black/60 p-3 rounded-full"
        >
          <Image
            source={downloaded ? icons.downloaded : icons.download}
            className="w-6 h-6"
            tintColor="white"
          />
        </TouchableOpacity>
      </View>

      <ScrollView className="px-6 pt-6">
        <View className="items-center mb-4">
          <Image
<!--             source={renderImage()} -->
            key={currentSong.id}
            source={{ uri: currentSong.image }}
            className="w-72 h-72 rounded-2xl"
            resizeMode="cover"
          />
        </View>

        <TouchableOpacity className="self-end bg-white/10 px-4 py-2 rounded-full mb-6">
          <Text className="text-white text-xs">Connect to a device</Text>
        </TouchableOpacity>

        <View className="mb-6 flex-row justify-between items-center">
          <View>
          <Text className="text-white text-xl font-bold">
            {currentSong.title}
          </Text>
          <Text className="text-white/70 text-sm mt-1">
            {currentSong.subtitle}
          </Text>
          </View>
          {!isOffline && (
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
          )}
        </View>

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

        {!isOffline && (
          <>
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-white font-semibold text-base">
                Up Next
              </Text>
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
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default SongDetails;
