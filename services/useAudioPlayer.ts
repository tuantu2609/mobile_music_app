// import { Audio, AVPlaybackStatusSuccess } from "expo-av";
// import { useRef } from "react";

// export default function useAudioPlayer() {
//   const soundRef = useRef<Audio.Sound | null>(null);

//   const play = async (uri: string) => {
//     try {
//       // Unload cũ nếu có
//       if (soundRef.current) {
//         await soundRef.current.unloadAsync();
//         soundRef.current = null;
//       }

//       const { sound, status } = await Audio.Sound.createAsync(
//         { uri },
//         { shouldPlay: true }
//       );
//       console.log("🎶 Playing audio from URI:", uri);
//       soundRef.current = sound;

//       sound.setOnPlaybackStatusUpdate((status) => {
//         if ((status as AVPlaybackStatusSuccess).isLoaded) {
//           // handle progress, etc.
//         }
//       });

//     } catch (err) {
//       console.error("🎧 Error playing sound:", err);
//     }
//   };

//   const stop = async () => {
//     if (soundRef.current) {
//       await soundRef.current.stopAsync();
//     }
//   };

//   const unload = async () => {
//     if (soundRef.current) {
//       await soundRef.current.unloadAsync();
//       soundRef.current = null;
//     }
//   };

//   return { play, stop, unload };
// }

// //gần được
// import { Audio, AVPlaybackStatusSuccess } from "expo-av";
// import { useRef } from "react";

// export default function useAudioPlayer() {
//   const soundRef = useRef<Audio.Sound | null>(null);

//   /**
//    * ✅ Phát nhạc từ `preview_url` nếu có (offline), hoặc fallback sang `url` (online)
//    */
//   const play = async (uri: string, fallbackUri?: string) => {
//     try {
//       // Unload cũ nếu có
//       if (soundRef.current) {
//         await soundRef.current.unloadAsync();
//         soundRef.current = null;
//       }

//       const finalUri = uri || fallbackUri; // ✅ Ưu tiên local uri (preview_url)

//       const { sound, status } = await Audio.Sound.createAsync(
//         { uri: finalUri },
//         { shouldPlay: true }
//       );
//       console.log("🎶 Playing audio from URI:", finalUri);
//       soundRef.current = sound;

//       sound.setOnPlaybackStatusUpdate((status) => {
//         if ((status as AVPlaybackStatusSuccess).isLoaded) {
//           // handle progress, etc.
//         }
//       });

//     } catch (err) {
//       console.error("🎧 Error playing sound:", err);
//     }
//   };

//   const stop = async () => {
//     if (soundRef.current) {
//       await soundRef.current.stopAsync();
//     }
//   };

//   const unload = async () => {
//     if (soundRef.current) {
//       await soundRef.current.unloadAsync();
//       soundRef.current = null;
//     }
//   };

//   return { play, stop, unload };
// }

import { Audio, AVPlaybackStatusSuccess } from "expo-av";
import { useRef } from "react";

export default function useAudioPlayer() {
  const soundRef = useRef<Audio.Sound | null>(null);

  /**
   * ✅ Phát nhạc từ `preview_url` nếu có (offline), hoặc fallback sang `url` (online)
   */
  const play = async (uri: string, fallbackUri?: string) => {
    try {
      // Unload old sound if exists
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }

      const finalUri = uri || fallbackUri; // Prefer local URI (preview_url)

      const { sound, status } = await Audio.Sound.createAsync(
        { uri: finalUri },
        { shouldPlay: true }
      );
      console.log("🎶 Playing audio from URI:", finalUri);
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
