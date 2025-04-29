import { Audio } from "expo-av";
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
  const soundRef = useRef<Audio.Sound | null>(null);

  useEffect(() => {
    return () => {
      // Clean up the sound when the component is unmounted
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  if (!currentSong) return null;

  const playPauseSong = async () => {
    if (isPlaying) {
      // Pause the song
      await sound?.pauseAsync();
      setIsPlaying(false); // Update state to paused

      // Get the status of the song to store the position
      const status = await sound?.getStatusAsync();

      // Type guard to check if status is of type AVPlaybackStatus
      if (status && "positionMillis" in status) {
        setPosition(status.positionMillis || 0); // Store the position when paused
      }
    } else {
      // Play the song
      if (sound) {
        // Continue from the last position
        await sound.playFromPositionAsync(position);
        setIsPlaying(true);
      } else {
        // If there's no sound object, create a new one and start from the beginning
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: currentSong.url }, // Using `url` instead of `songURL`
          { shouldPlay: true }
        );
        soundRef.current = newSound;
        setSound(newSound);
        setIsPlaying(true); // Update state to playing
      }
    }
  };

  // Play music automatically on press
  const playMusic = async () => {
    if (sound) {
      await sound.playAsync(); // Start playing
      setIsPlaying(true); // Ensure the state is updated immediately
    } else {
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: currentSong.url }, // Using `url` instead of `songURL`
        { shouldPlay: true }
      );
      soundRef.current = newSound;
      setSound(newSound);
      setIsPlaying(true); // Update state to playing
    }
  };

  return (
    <TouchableOpacity
      onPress={() => {
        playMusic(); // Automatically play the song when pressed
        router.push(`/song/${currentSong.id}`);
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
            source={{ uri: currentSong.image }}
            className="w-12 h-12 rounded-md mr-3"
            resizeMode="cover"
          />
          <View className="flex-1">
            <Text
              className="text-white font-semibold"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {currentSong.title}
            </Text>
            <Text
              className="text-white/60 text-xs"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {currentSong.subtitle}
            </Text>
          </View>
        </View>

        {/* Right: Nút play/pause */}
        <TouchableOpacity onPress={playPauseSong}>
          <Image
            source={isPlaying ? icons.pause : icons.play} // Switch between play and pause
            className="w-6 h-6 mr-2"
            tintColor="white"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </BlurView>
    </TouchableOpacity>
  );
};

export default MiniPlayer;
