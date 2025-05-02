import { Audio, AVPlaybackStatus } from "expo-av"; // Ensure AVPlaybackStatus is imported
import { View, Text, Image, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import { usePlayerStore } from "@/store/usePlayerStore";
import { icons } from "@/constants/icons";
import { useRouter } from "expo-router";
import { useState, useEffect, useRef } from "react";

const MiniPlayer = () => {
  const currentSong = usePlayerStore((state) => state.currentSong);
  const router = useRouter();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false); // State for play/pause
  const [position, setPosition] = useState(0); // Track the position of the song
  const [duration, setDuration] = useState(0); // Track the duration of the song
  const soundRef = useRef<Audio.Sound | null>(null);

  // Giải phóng tài nguyên âm thanh trước khi chuyển bài
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync(); // Unload previous song
      }
    };
  }, [currentSong]);

  // Khởi tạo lại âm thanh và reset vị trí khi bài hát thay đổi
  useEffect(() => {
    setPosition(0); // Reset position khi bài hát thay đổi
    if (currentSong?.duration_ms) {
      setDuration(currentSong.duration_ms / 1000); // Set song duration từ DB
    }

    // Dừng âm thanh cũ và phát bài mới
    if (soundRef.current) {
      soundRef.current.stopAsync();
      playMusic(); // Bắt đầu phát bài hát mới
    } else {
      playMusic(); // Nếu không có âm thanh, tạo mới và phát bài hát
    }
  }, [currentSong]);

  // Cập nhật vị trí khi bài hát đang phát
  useEffect(() => {
    if (sound) {
      const interval = setInterval(async () => {
        const status = (await sound.getStatusAsync()) as AVPlaybackStatus;
        if (status && "positionMillis" in status) {
          setPosition(status.positionMillis / 1000 || 0); // Lưu lại vị trí bài hát
        }
      }, 500);

      return () => {
        clearInterval(interval); // Dọn dẹp interval khi component unmount
      };
    }
  }, [sound]);

  const playPauseSong = async () => {
    if (isPlaying) {
      // Tạm dừng bài hát
      await sound?.pauseAsync();
      setIsPlaying(false); // Cập nhật trạng thái pause

      // Lưu vị trí bài hát
      const status = await sound?.getStatusAsync();
      if (status && "positionMillis" in status) {
        setPosition(status.positionMillis / 1000 || 0); // Lưu lại vị trí khi tạm dừng
      }
    } else {
      // Phát bài hát
      if (sound) {
        await sound.playFromPositionAsync(position * 1000); // Tiếp tục phát từ vị trí đã dừng
        setIsPlaying(true); // Cập nhật trạng thái đang phát
      } else {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: currentSong?.url ?? "" }, // Dùng URL của bài hát
          { shouldPlay: true }
        );
        soundRef.current = newSound;
        setSound(newSound);
        setIsPlaying(true); // Cập nhật trạng thái đang phát
      }
    }
  };

  // Phát bài hát tự động khi người dùng bấm vào
  const playMusic = async () => {
    if (sound) {
      await sound.playAsync(); // Phát bài hát
      setIsPlaying(true); // Cập nhật trạng thái đang phát
    } else {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: currentSong?.url ?? "" }, // Dùng URL của bài hát
        { shouldPlay: true }
      );
      soundRef.current = newSound;
      setSound(newSound);
      setIsPlaying(true); // Cập nhật trạng thái đang phát
    }
  };

  return (
    <View style={{ position: "relative" }}>
      <TouchableOpacity
        onPress={() => {
          playMusic(); // Tự động phát bài hát khi bấm
          router.push(`/song/${currentSong?.id}`); // Chuyển tới trang bài hát
        }}
        className="absolute left-0 right-0 bottom-20"
      >
        <BlurView
          intensity={50}
          tint="dark"
          className="flex-row items-center justify-between px-4 py-3 rounded-xl"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          {/* Left: Ảnh + text */}
          <View className="flex-row items-center flex-1 mr-4">
            <Image
              source={{ uri: currentSong?.image }}
              className="w-12 h-12 rounded-md mr-3"
              resizeMode="cover"
            />
            <View className="flex-1">
              <Text
                className="text-white font-semibold"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {currentSong?.title}
              </Text>
            </View>
          </View>

          {/* Right: Nút play/pause */}
          <TouchableOpacity onPress={playPauseSong}>
            <Image
              source={isPlaying ? icons.pause : icons.play} // Chuyển giữa play và pause
              className="w-6 h-6 mr-2"
              tintColor="white"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </BlurView>

        {/* Progress bar */}
        <View className="px-4">
          <View
            style={{
              position: "absolute",
              bottom: 0,
              height: 2,
              width: `${(position / duration) * 100}%`,
              backgroundColor: "white",
            }}
          />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default MiniPlayer;
