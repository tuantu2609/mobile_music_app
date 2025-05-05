import { Audio, AVPlaybackStatusSuccess } from "expo-av";
import { useRef } from "react";

export default function useAudioPlayer() {
  const soundRef = useRef<Audio.Sound | null>(null);

  const play = async (uri: string) => {
    try {
      // Unload cũ nếu có
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const { sound, status } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true }
      );
      console.log("🎶 Playing audio from URI:", uri);
      soundRef.current = sound;

      sound.setOnPlaybackStatusUpdate((status) => {
        if ((status as AVPlaybackStatusSuccess).isLoaded) {
          // handle progress, etc.
        }
      });

    } catch (err) {
      console.error("🎧 Error playing sound:", err);
    }
  };

  const stop = async () => {
    if (soundRef.current) {
      await soundRef.current.stopAsync();
    }
  };

  const unload = async () => {
    if (soundRef.current) {
      await soundRef.current.unloadAsync();
      soundRef.current = null;
    }
  };

  return { play, stop, unload };
}
