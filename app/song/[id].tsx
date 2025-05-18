import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, useLocalSearchParams } from "expo-router";
import SongListCard from "@/components/SongListCard";
import SongCard from "@/components/SongCard";
import { usePlayerStore } from "@/store/usePlayerStore";
import { likeSong, unlikeSong, getTotalLikesOfSong } from "@/services/useAuth";
import axios from "axios";
import Constants from "expo-constants";
import {
  downloadSongToDevice,
  deleteDownloadedSong,
  getLocalSongPath,
} from "@/services/useDownloadedManager";
import Slider from "@react-native-community/slider";
import { useAuthStore } from "@/store/useAuthStore";
import NetInfo from "@react-native-community/netinfo";

const API_URL = Constants.expoConfig?.extra?.API_URL;

const formatDuration = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

const ProgressBar = React.memo(() => {
  const position = usePlayerStore((state) => state.position);
  const duration = usePlayerStore((state) => state.duration);
  const seekTo = usePlayerStore((state) => state.seekTo);

  return (
    <View className="mb-4">
      <View className="flex-row justify-between">
        <Text className="text-white text-xs">{formatDuration(position)}</Text>
        <Text className="text-white text-xs">{formatDuration(duration)}</Text>
      </View>
      <Slider
        style={{ width: "100%", height: 40 }}
        minimumValue={0}
        maximumValue={duration}
        value={position}
        minimumTrackTintColor="#fff"
        maximumTrackTintColor="#555"
        thumbTintColor="#fff"
        onSlidingComplete={(value) => {
          seekTo(value);
        }}
      />
    </View>
  );
});

ProgressBar.displayName = "ProgressBar";

const SongDetails = () => {
  console.log("render song hehe");
  const params = useLocalSearchParams();
  const fromDownloadedPage = Array.isArray(params.fromDownloadedPage)
    ? params.fromDownloadedPage[0]
    : params.fromDownloadedPage;

  // const songParam = useMemo(() => {
  //   const raw = Array.isArray(params.id) ? params.id[0] : params.id;
  //   return raw ?? "";
  // }, [params.id]);
  const songParam = useMemo(() => {
    const raw = Array.isArray(params.song) ? params.song[0] : params.song;
    return raw ?? "";
  }, [params.song]);

  const router = useRouter();
  const { token, user } = useAuthStore();

  // const {
  //   setQueue,
  //   queue,
  //   currentSong,
  //   setCurrentSong,
  //   isPlaying,
  //   position,
  //   duration,
  //   seekTo,
  //   togglePlayback,
  //   forcePause,
  //   loadSong,
  //   unload,
  //   playNext,
  //   playPrevious,
  // } = usePlayerStore();

  const setQueue = usePlayerStore((state) => state.setQueue);
  const queue = usePlayerStore((state) => state.queue);
  const currentSong = usePlayerStore((state) => state.currentSong);
  const setCurrentSong = usePlayerStore((state) => state.setCurrentSong);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const duration = usePlayerStore((state) => state.duration);
  const togglePlayback = usePlayerStore((state) => state.togglePlayback);
  const playNext = usePlayerStore((state) => state.playNext);
  const playPrevious = usePlayerStore((state) => state.playPrevious);
  const seekTo = usePlayerStore((state) => state.seekTo);
  const forcePause = usePlayerStore((state) => state.forcePause);
  const unload = usePlayerStore((state) => state.unload);
  const loadSong = usePlayerStore((state) => state.loadSong);

  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  const checkIsOffline = async () => {
    const net = await NetInfo.fetch();
    return !(net.isConnected && net.isInternetReachable);
  };

  useEffect(() => {
    const loadSongInfo = async () => {
      try {
        // Nếu là bài offline từ local
        if (fromDownloadedPage === "true" && songParam) {
          const localSong = JSON.parse(decodeURIComponent(songParam));
          const path = getLocalSongPath(localSong.id);
          const offlineSong = { ...localSong, url: path };

          const isReallyOffline = await checkIsOffline();

          await forcePause();
          await unload();
          setIsOffline(isReallyOffline);
          await loadSong(offlineSong); // load luôn bài offline vào player store
          return;
        }

        // Không cần xử lý currentSong ở đây nữa
      } catch (e) {
        console.error("Error loading song info", e);
      } finally {
        setLoading(false);
      }
    };

    loadSongInfo();
    return () => {
      // unload(); // cleanup
    };
  }, [songParam]);

  useEffect(() => {
    const fetchLikes = async () => {
      if (!token || !user?.id || !currentSong?.id) return;

      const net = await NetInfo.fetch();
      if (!net.isConnected || !net.isInternetReachable) {
        return;
      }

      try {
        const res = await getTotalLikesOfSong(currentSong.id, token);
        setLikes(res.likeCount);
      } catch (e) {
        console.error("Failed to fetch like count", e);
      }
    };

    fetchLikes();
  }, [currentSong?.id]);

  useEffect(() => {
    if (currentSong) {
      setIsLiked(currentSong.isLiked ?? false);
      setDownloaded(currentSong.isDownloaded ?? false);
    }
  }, [currentSong?.id]);

  const hasFetchedQueue = useRef(false);
  useEffect(() => {
    if (isOffline || !currentSong?.id || hasFetchedQueue.current) return;

    const fetchQueue = async () => {
      setLoading(true);
      try {
        if (await checkIsOffline()) {
          setIsOffline(true);
          return;
        }

        const exclude = currentSong.id;
        const { data } = await axios.get(
          `${API_URL}/songs/${exclude}/next?limit=20&exclude=${exclude}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setQueue(data);
        hasFetchedQueue.current = true;
      } catch (err: any) {
        console.error("❌ Failed to fetch next queue:", err);
        if (err.message?.includes("Network Error")) {
          setIsOffline(true); // ✅ tự động switch về offline mode
        }
      } finally {
        setLoading(false);
      }
    };

    fetchQueue();
  }, [currentSong?.id, token]);

  // const handleLike = async () => {
  //   if (!currentSong?.id) return;
  //   try {
  //     if (!token) return;
  //     if (isLiked) await unlikeSong(currentSong?.id, token);
  //     else await likeSong(currentSong?.id, token);

  //     const res = await getTotalLikesOfSong(currentSong?.id, token);
  //     setLikes(res.likeCount);
  //     setIsLiked(!isLiked);
  //   } catch (e) {
  //     console.error("Like/unlike failed", e);
  //   }
  // };

  const handleLike = async () => {
    if (!currentSong?.id) return;

    if (await checkIsOffline()) {
      return;
    }
    try {
      if (!token) return;
      if (isLiked) {
        await unlikeSong(currentSong.id, token);
      } else {
        await likeSong(currentSong.id, token);
      }

      const res = await getTotalLikesOfSong(currentSong.id, token);
      setLikes(res.likeCount);
      setIsLiked(!isLiked);

      setCurrentSong({
        ...currentSong,
        isLiked: !isLiked,
      });
    } catch (e) {
      console.error("Like/unlike failed", e);
    }
  };

  const handleDownload = async () => {
    if (!currentSong?.id) return;
    if (await checkIsOffline()) {
      return;
    }
    try {
      if (!token || !user?.id) return;
      if (downloaded) {
        await deleteDownloadedSong(currentSong?.id, user.id, token);
        setDownloaded(false);
      } else {
        const url = currentSong.url;
        if (!url) return;
        await downloadSongToDevice(
          { id: currentSong.id, url: url as string },
          user.id,
          token
        );
        setDownloaded(true);
      }
    } catch (e) {
      console.error("Download failed", e);
    }
  };

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
            source={
              currentSong?.album_cover
                ? { uri: currentSong?.album_cover }
                : images.song
            }
            className="w-72 h-72 rounded-2xl"
            resizeMode="cover"
          />
        </View>

        <View className="mb-6 flex-row justify-between items-center">
          <View style={{ flex: 1, flexShrink: 1 }}>
            <Text className="text-white text-xl font-bold" numberOfLines={1}>
              {currentSong.title}
            </Text>
            <Text className="text-white/70 text-sm mt-1">
              {currentSong.artists?.map((a) => a.name).join(", ") || "Unknown"}
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
          <ProgressBar />
          {/* <View className="flex-row justify-between">
            <Text className="text-white text-xs">
              {formatDuration(position)}
            </Text>
            <Text className="text-white text-xs">
              {formatDuration(duration)}
            </Text>
          </View>
          <Slider
            style={{ width: "100%", height: 40 }}
            minimumValue={0}
            maximumValue={duration}
            value={position}
            minimumTrackTintColor="#fff"
            maximumTrackTintColor="#555"
            thumbTintColor="#fff"
            onSlidingComplete={(value) => {
              seekTo(value);
            }}
          /> */}
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
            onPress={() => {
              togglePlayback();
            }}
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
        {isOffline && (
          <Text className="text-white/50 italic text-center p-4">
            Không thể tải danh sách khi offline
          </Text>
        )}
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
                      artists: s.artists?.map((a: any) => a.name).join(", "),
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
