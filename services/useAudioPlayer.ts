import { Audio, AVPlaybackStatusSuccess } from "expo-av";
import { useRef } from "react";

export default function useAudioPlayer() {
  const soundRef = useRef<Audio.Sound | null>(null);

  const play = async (uri: string) => {
    try {
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
          // handle progress outside
        }
      });
    } catch (err) {
      console.error("🎧 Error playing sound:", err);
    }
  };

  const pause = async () => {
    if (soundRef.current) {
      const status = await soundRef.current.getStatusAsync();
      if ((status as AVPlaybackStatusSuccess).isPlaying) {
        await soundRef.current.pauseAsync();
      }
    }
  };

  const resume = async () => {
    if (soundRef.current) {
      const status = await soundRef.current.getStatusAsync();
      if (
        (status as AVPlaybackStatusSuccess).isLoaded &&
        !(status as AVPlaybackStatusSuccess).isPlaying
      ) {
        await soundRef.current.playAsync();
      }
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

  const getStatus = async () => {
    if (soundRef.current) {
      return await soundRef.current.getStatusAsync();
    }
    return null;
  };

  const seekTo = async (seconds: number) => {
    if (soundRef.current) {
      await soundRef.current.setPositionAsync(seconds * 1000);
    }
  };

  return {
    play,
    pause,
    resume,
    stop,
    unload,
    getStatus,
    seekTo,
    sound: soundRef.current,
  };
}
