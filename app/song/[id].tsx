// import {
//   View,
//   Text,
//   Image,
//   TouchableOpacity,
//   ScrollView,
//   ActivityIndicator,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import { icons } from "@/constants/icons";
// import { images } from "@/constants/images";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useRouter, useLocalSearchParams } from "expo-router";
// import SongListCard from "@/components/SongListCard";
// import SongCard from "@/components/SongCard";
// import { useAuth } from "@/app/auth/useAuth";

// import { usePlayerStore } from "@/store/usePlayerStore";
// import { likeSong, unlikeSong, getTotalLikesOfSong } from "@/services/useAuth";
// import axios from "axios";
// import Constants from "expo-constants";

// import {
//   isSongDownloaded,
//   downloadSongToDevice,
//   deleteDownloadedSong,
// } from "@/services/useDownloadedManager";

// const API_URL = Constants.expoConfig?.extra?.API_URL;

// const SongDetails = () => {
//   const { id } = useLocalSearchParams();
//   const router = useRouter();
//   const { setQueue, queue } = usePlayerStore();
//   const { loadToken } = useAuth();
//   const [likes, setLikes] = useState<number>(0);
//   const [isLiked, setIsLiked] = useState<boolean>(false);
//   const [song, setSong] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [downloaded, setDownloaded] = useState(false);

//   useEffect(() => {
//     const fetchSong = async () => {
//       try {
//         const token = await loadToken();
//         if (!token) {
//           console.error("Không tìm thấy token!");
//           return;
//         }

//         // // Fetch danh sách bài tiếp theo
//         // const nextRes = await axios.get(`${API_URL}/songs/${id}/next`);
//         // setQueue(nextRes.data);

//         const res = await axios.get(`${API_URL}/songs/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         setSong(res.data);

//         const likeRes = await getTotalLikesOfSong(id, token);
//         setLikes(likeRes.likeCount);

//         setIsLiked(res.data.isLiked); // Backend gửi isLiked
//       } catch (error) {
//         console.error("Lỗi khi lấy thông tin bài hát:", error);
//       } finally {
//         setLoading(false);
//       }
//     };
//     const checkDownloaded = async () => {
//       const isDownloaded = await isSongDownloaded(id);
//       setDownloaded(isDownloaded);
//     };
//     checkDownloaded();

//     fetchSong();
//   }, [id]);

//   const handleLike = async () => {
//     try {
//       const token = await loadToken();
//       if (!token) {
//         console.error("Không tìm thấy token!");
//         return;
//       }

//       // Gọi API like/unlike
//       if (isLiked) {
//         await unlikeSong(song.id, token);
//       } else {
//         await likeSong(song.id, token);
//       }

//       // Cập nhật lại trạng thái sau khi gọi API thành công
//       const likeRes = await getTotalLikesOfSong(song.id, token);
//       setLikes(likeRes.likeCount);
//       setIsLiked(!isLiked); // Toggle trạng thái sau khi cập nhật thành công
//     } catch (error) {
//       console.error("Error liking/unliking song:", error);
//     }
//   };

//   if (loading) {
//     return (
//       <SafeAreaView className="flex-1 justify-center items-center bg-black">
//         <ActivityIndicator size="large" color="#fff" />
//       </SafeAreaView>
//     );
//   }

//   if (!song) {
//     return (
//       <SafeAreaView className="flex-1 justify-center items-center bg-black">
//         <Text className="text-white">Không tìm thấy bài hát.</Text>
//       </SafeAreaView>
//     );
//   }

//   return (
//     <SafeAreaView className="flex-1 bg-black">
//       {/* Header */}
//       <View className="flex-row justify-between items-center mb-6">
//         <TouchableOpacity
//           onPress={() => router.back()}
//           className="top-4 left-4 z-50 bg-black/60 p-3 rounded-full"
//         >
//           <Image
//             source={icons.back}
//             className="w-5 h-5"
//             tintColor="white"
//             resizeMode="contain"
//           />
//         </TouchableOpacity>
//         <TouchableOpacity
//           onPress={async () => {
//             const token = await loadToken();
//             if (!token) return;

//             if (downloaded) {
//               await deleteDownloadedSong(song.id, token);
//               setDownloaded(false);
//             } else {
//               await downloadSongToDevice(
//                 { id: song.id, preview_url: song.url },
//                 token
//               );
//               setDownloaded(true);
//             }
//           }}
//           className="top-4 right-4 z-50 bg-black/60 p-3 rounded-full"
//         >
//           <Image
//             source={downloaded ? icons.downloaded : icons.download}
//             className="w-6 h-6"
//             tintColor="white"
//           />
//         </TouchableOpacity>
//       </View>

//       <ScrollView className="px-6 pt-6">
//         {/* Album cover */}
//         <View className="items-center mb-4">
//           <Image
//             source={{ uri: song.album_cover }}
//             className="w-72 h-72 rounded-2xl"
//             resizeMode="cover"
//           />
//         </View>

//         {/* Connect to device */}
//         <TouchableOpacity className="self-end bg-white/10 px-4 py-2 rounded-full mb-6">
//           <Text className="text-white text-xs">Connect to a device</Text>
//         </TouchableOpacity>

//         {/* Song info */}
//         <View className="mb-6 flex-row justify-between items-center">
//           <View>
//             <Text className="text-white text-xl font-bold">{song.title}</Text>
//             <Text className="text-white/70 text-sm mt-1">
//               {song.Artists?.map((a: any) => a.name).join(", ")}
//             </Text>
//           </View>

//           <TouchableOpacity
//             onPress={handleLike}
//             className="flex-row items-center ml-auto"
//           >
//             <Text className="text-white mr-2 text-sm">{likes}</Text>
//             <Image
//               source={isLiked ? icons.heart_fill : icons.heart}
//               className="w-6 h-6"
//               tintColor="white"
//             />
//           </TouchableOpacity>
//         </View>

//         {/* Player controls */}
//         <View className="mb-4">
//           <View className="flex-row justify-between">
//             <Text className="text-white text-xs">0:00</Text>
//             <Text className="text-white text-xs">
//               {song.duration_ms
//                 ? (song.duration_ms / 60000).toFixed(2)
//                 : "3:00"}
//             </Text>
//           </View>
//           <View className="w-full h-1 bg-white/20 rounded-full mt-2">
//             <View className="w-[20%] h-full bg-white rounded-full" />
//           </View>
//         </View>

//         {/* Buttons */}
//         <View className="flex-row items-center justify-between px-4 mt-4 mb-6">
//           <TouchableOpacity>
//             <Image
//               source={icons.shuffle}
//               className="w-5 h-5"
//               tintColor="white"
//             />
//           </TouchableOpacity>
//           <TouchableOpacity>
//             <Image source={icons.prev} className="w-6 h-6" tintColor="white" />
//           </TouchableOpacity>
//           <TouchableOpacity className="bg-white rounded-full p-4">
//             <Image source={icons.play} className="w-6 h-6" tintColor="black" />
//           </TouchableOpacity>
//           <TouchableOpacity>
//             <Image source={icons.next} className="w-6 h-6" tintColor="white" />
//           </TouchableOpacity>

//           <TouchableOpacity>
//             <Image
//               source={icons.repeat}
//               className="w-5 h-5"
//               tintColor="white"
//             />
//           </TouchableOpacity>
//         </View>

//         {/* Up Next */}
//         <View className="flex-row justify-between items-center mb-2">
//           <Text className="text-white font-semibold text-base">Up Next</Text>
//           <Text className="text-white/50 text-sm">Queue</Text>
//         </View>

//         <View className="bg-white/5 rounded-xl">
//           {queue.length === 0 ? (
//             <Text className="text-white p-4">Danh sách Up Next trống</Text>
//           ) : (
//             queue.map((s: any) => (
//               <SongListCard
//                 key={s.id}
//                 song={{
//                   id: s.id,
//                   title: s.title,
//                   subtitle: s.Artists?.map((a: any) => a.name).join(", "),
//                   image: s.album_cover,
//                 }}
//               />
//             ))
//           )}
//         </View>

//         {/* Similar Songs */}
//         <View className="mt-10">
//           <Text className="text-white text-3xl font-bold mb-2">
//             Songs similar to this
//           </Text>
//           <ScrollView
//             horizontal
//             showsHorizontalScrollIndicator={false}
//             contentContainerStyle={{ paddingRight: 20 }}
//           >
//             <SongCard title="Tên bài hát 1" image={images.song2} />
//             <SongCard title="Tên bài hát 2" image={images.song} />
//           </ScrollView>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// };

// export default SongDetails;

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
import {
  isSongDownloaded,
  downloadSongToDevice,
  deleteDownloadedSong,
  getLocalSongPath,
} from "@/services/useDownloadedManager";
import useAudioPlayer from "@/services/useAudioPlayer";

const API_URL = Constants.expoConfig?.extra?.API_URL;

const formatDuration = (ms: number) => {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const SongDetails = () => {
  const { id, fromDownloadedPage, song: songParam } = useLocalSearchParams();
  const router = useRouter();
  const { setQueue, queue, setCurrentSong } = usePlayerStore();
  const { user, loadToken } = useAuth();
  const { play, unload } = useAudioPlayer();

  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [song, setSong] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [downloaded, setDownloaded] = useState(false);
  const [isOffline, setIsOffline] = useState(false);

  // useEffect(() => {
  //   if (!user) return;
  //   const loadSong = async () => {
  //     try {
  //       const token = await loadToken();
  //       if (!token || !user?.id) throw new Error("Thiếu token hoặc user");

  //       const isDown = await isSongDownloaded(id, user.id, token);
  //       setDownloaded(isDown);

  //       if (fromDownloadedPage === "true" && songParam) {
  //         try {
  //           const localSong = JSON.parse(decodeURIComponent(songParam));
  //           const path = getLocalSongPath(id);
  //           setSong({
  //             ...localSong,
  //             preview_url: path,
  //           });
  //           setIsOffline(true);
  //           return;
  //         } catch (e) {
  //           console.error("❌ Lỗi giải mã songParam:", e);
  //         }
  //       }

  //       const res = await axios.get(`${API_URL}/songs/${id}`, {
  //         headers: { Authorization: `Bearer ${token}` },
  //       });
  //       setSong(res.data);
  //       setIsLiked(res.data.isLiked);

  //       const likeRes = await getTotalLikesOfSong(id, token);
  //       setLikes(likeRes.likeCount);
  //     } catch (err) {
  //       console.warn("❌ loadSong error:", err);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadSong();

  //   return () => {
  //     unload(); // Ngắt âm thanh khi rời trang
  //   };
  // }, [id, user]);
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

        const res = await axios.get(`${API_URL}/songs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
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

  const renderImage = () => {
    if (typeof song.album_cover === "number") return song.album_cover;
    if (typeof song.album_cover === "string") return { uri: song.album_cover };
    return images.song;
  };

  if (loading || !song) {
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
          <Image
            source={icons.back}
            className="w-5 h-5"
            tintColor="white"
            resizeMode="contain"
          />
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
            source={renderImage()}
            className="w-72 h-72 rounded-2xl"
            resizeMode="cover"
          />
        </View>

        <TouchableOpacity className="self-end bg-white/10 px-4 py-2 rounded-full mb-6">
          <Text className="text-white text-xs">Connect to a device</Text>
        </TouchableOpacity>

        <View className="mb-6 flex-row justify-between items-center">
          <View>
            <Text className="text-white text-xl font-bold">{song.title}</Text>
            <Text className="text-white/70 text-sm mt-1">
              {song.Artists?.map((a: any) => a.name).join(", ") ||
                "Unknown Artist"}
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
            <Text className="text-white text-xs">0:00</Text>
            <Text className="text-white text-xs">
              {formatDuration(song.duration_ms)}
            </Text>
          </View>
          <View className="w-full h-1 bg-white/20 rounded-full mt-2">
            <View className="w-[20%] h-full bg-white rounded-full" />
          </View>
        </View>

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
          <TouchableOpacity
            className="bg-white rounded-full p-4"
            onPress={handlePlay}
          >
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
