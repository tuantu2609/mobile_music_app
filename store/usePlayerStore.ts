// import { Audio, AVPlaybackStatus } from "expo-av";
// import { create } from "zustand";

// import axios from "axios";
// import Constants from "expo-constants";

// const API_URL = Constants.expoConfig?.extra?.API_URL;

// interface Song {
//   id: string;
//   title: string;
//   subtitle?: string;
//   image: string;
//   url: string;
//   duration_ms: number;
// }

// interface PlayerState {
//   currentSong: Song | null;
//   queue: Song[];
//   history: Song[];
//   isPlaying: boolean;
//   position: number;
//   duration: number;
//   setCurrentSong: (song: Song) => void;
//   setQueue: (queue: Song[]) => void;
//   playNext: () => Promise<void>;
//   playPrevious: () => Promise<void>;
//   loadSong: (song: Song) => Promise<void>;
//   playPause: () => Promise<void>;
//   seekTo: (sec: number) => Promise<void>;
//   resetPlayer: () => void;
// }

// let soundRef: Audio.Sound | null = null;
// let intervalRef: number | null = null;
// let loadVersionRef = 0;

// export const usePlayerStore = create<PlayerState>((set, get) => ({
//   currentSong: null,
//   queue: [],
//   history: [],
//   isPlaying: false,
//   position: 0,
//   duration: 0,

//   setCurrentSong: (song) => set({ currentSong: song }),
//   setQueue: (queue) => set({ queue }),

//   playNext: async () => {
//     const { queue, currentSong, history, loadSong, setQueue } = get();

//     if (queue.length > 0) {
//       const [next, ...rest] = queue;

//       if (currentSong) {
//         set({ history: [...history, currentSong] });
//       }

//       await loadSong(next);

//       try {
//         const excludeIds = [
//           currentSong?.id,
//           ...rest.map((s) => s.id),
//           ...history.map((s) => s.id),
//         ]
//           .filter(Boolean)
//           .join(",");

//         const response = await axios.get(
//           `${API_URL}/songs/${next.id}/next?limit=1&exclude=${excludeIds}`
//         );
//         const newSong = response.data[0];
//         const updatedQueue = [...rest];

//         if (newSong && !updatedQueue.some((s) => s.id === newSong.id)) {
//           updatedQueue.push(newSong);
//         }

//         setQueue(updatedQueue.slice(0, 5));
//       } catch (err) {
//         console.error("Error fetching new song for up next:", err);
//         setQueue(rest);
//       }
//     } else {
//       set({ isPlaying: false });
//     }
//   },

//   playPrevious: async () => {
//     const { history, loadSong } = get();
//     if (history.length > 0) {
//       const prev = history[history.length - 1];
//       set({ history: history.slice(0, -1) });
//       await loadSong(prev);
//     } else {
//       await get().seekTo(0);
//     }
//   },

//   loadSong: async (song: Song) => {
//     const version = ++loadVersionRef;

//     const fixedSong = {
//       ...song,
//       image: song.image || (song as any).album_cover || "",
//     };

//     if (soundRef) {
//       try {
//         await soundRef.stopAsync();
//         await soundRef.unloadAsync();
//       } catch (e) {
//         console.warn("Unload error:", e);
//       }
//       soundRef = null;
//     }

//     set({ currentSong: fixedSong, position: 0 });

//     if (fixedSong.duration_ms) {
//       set({ duration: fixedSong.duration_ms / 1000 });
//     }

//     try {
//       const { sound } = await Audio.Sound.createAsync(
//         { uri: fixedSong.url },
//         { shouldPlay: true }
//       );

//       if (version !== loadVersionRef) {
//         await sound.unloadAsync();
//         return;
//       }

//       soundRef = sound;
//       set({ isPlaying: true });

//       if (intervalRef) clearInterval(intervalRef);

//       intervalRef = setInterval(async () => {
//         const status = (await sound.getStatusAsync()) as AVPlaybackStatus;
//         if (status && "positionMillis" in status) {
//           set({ position: status.positionMillis / 1000 });
//           if (status.didJustFinish) {
//             await get().playNext();
//           }
//         }
//       }, 500);
//     } catch (e) {
//       console.warn("Load song error:", e);
//     }
//   },

//   playPause: async () => {
//     const { isPlaying } = get();
//     if (soundRef) {
//       if (isPlaying) {
//         await soundRef.pauseAsync();
//         set({ isPlaying: false });
//       } else {
//         await soundRef.playAsync();
//         set({ isPlaying: true });
//       }
//     }
//   },

//   seekTo: async (sec: number) => {
//     if (soundRef) {
//       await soundRef.setPositionAsync(sec * 1000);
//       set({ position: sec });
//     }
//   },

//   resetPlayer: async () => {
//     if (soundRef) {
//       try {
//         await soundRef.stopAsync();
//         await soundRef.unloadAsync();
//       } catch (e) {
//         console.warn("Unload error on reset:", e);
//       }
//       soundRef = null;
//     }

//     if (intervalRef) {
//       clearInterval(intervalRef);
//       intervalRef = null;
//     }

//     set({
//       currentSong: null,
//       queue: [],
//       history: [],
//       isPlaying: false,
//       position: 0,
//       duration: 0,
//     });
//   },
// }));

//99.5
// import { create } from "zustand";
// import axios from "axios";
// import Constants from "expo-constants";
// import { Audio, AVPlaybackStatus } from "expo-av";

// const API_URL = Constants.expoConfig?.extra?.API_URL;

// interface Song {
//   id: string;
//   title: string;
//   subtitle?: string;
//   image: string;
//   url?: string;
//   preview_url?: string;
//   duration_ms: number;
// }

// interface PlayerState {
//   currentSong: Song | null;
//   queue: Song[];
//   history: Song[];
//   isPlaying: boolean;
//   position: number;
//   duration: number;
//   setCurrentSong: (song: Song) => void;
//   setQueue: (queue: Song[]) => void;
//   playNext: () => Promise<void>;
//   playPrevious: () => Promise<void>;
//   loadSong: (song: Song) => Promise<void>;
//   playPause: () => Promise<void>;
//   seekTo: (sec: number) => Promise<void>;
//   resetPlayer: () => void;
// }

// let soundRef: Audio.Sound | null = null;
// let intervalRef: number | null = null;
// let loadVersionRef = 0;

// export const usePlayerStore = create<PlayerState>((set, get) => ({
//   currentSong: null,
//   queue: [],
//   history: [],
//   isPlaying: false,
//   position: 0,
//   duration: 0,

//   setCurrentSong: (song) => set({ currentSong: song }),
//   setQueue: (queue) => set({ queue }),

//   playNext: async () => {
//     const { queue, currentSong, history, loadSong, setQueue } = get();
//     if (queue.length === 0) {
//       set({ isPlaying: false });
//       return;
//     }

//     const nextSong = queue[0];
//     set({
//       history: currentSong ? [...history, currentSong] : history,
//       queue: queue.slice(1),
//     });
//     setCurrentSong(nextSong);
//     await loadSong(nextSong);

//     try {
//       const excludeIds = [
//         currentSong?.id,
//         ...queue.slice(1).map((s) => s.id),
//         ...history.map((s) => s.id),
//       ]
//         .filter(Boolean)
//         .join(",");

//       const response = await axios.get(
//         `${API_URL}/songs/${nextSong.id}/next?limit=1&exclude=${excludeIds}`
//       );
//       const newSong = response.data[0];
//       const updatedQueue = [...queue.slice(1)];

//       if (newSong && !updatedQueue.some((s) => s.id === newSong.id)) {
//         updatedQueue.push(newSong);
//       }

//       setQueue(updatedQueue.slice(0, 5));
//     } catch (err) {
//       console.error("Error fetching new song for up next:", err);
//       setQueue(queue.slice(1)); // Just slice without adding new song
//     }
//   },

//   playPrevious: async () => {
//     const { history, loadSong, setCurrentSong } = get();
//     if (history.length > 0) {
//       const prevSong = history[history.length - 1];
//       set({
//         history: history.slice(0, -1),
//         queue: [get().currentSong!, ...get().queue],
//       });
//       setCurrentSong(prevSong);
//       await loadSong(prevSong);
//     } else {
//       await get().seekTo(0); // Start at the beginning of the current song if no history
//     }
//   },

//   loadSong: async (song: Song) => {
//     const version = ++loadVersionRef;

//     const fixedSong = {
//       ...song,
//       image: song.image || (song as any).album_cover || "",
//     };

//     if (soundRef) {
//       try {
//         await soundRef.stopAsync();
//         await soundRef.unloadAsync();
//       } catch (e) {
//         console.warn("Unload error:", e);
//       }
//       soundRef = null;
//     }

//     set({ currentSong: fixedSong, position: 0 });

//     if (fixedSong.duration_ms) {
//       set({ duration: fixedSong.duration_ms / 1000 });
//     }

//     try {
//       const { sound } = await Audio.Sound.createAsync(
//         { uri: fixedSong.url ?? "" },
//         { shouldPlay: true }
//       );

//       if (version !== loadVersionRef) {
//         await sound.unloadAsync();
//         return;
//       }

//       soundRef = sound;
//       set({ isPlaying: true });

//       if (intervalRef) clearInterval(intervalRef);

//       intervalRef = setInterval(async () => {
//         const status = (await sound.getStatusAsync()) as AVPlaybackStatus;
//         if (status && "positionMillis" in status) {
//           set({ position: status.positionMillis / 1000 });
//           if (status.didJustFinish) {
//             await get().playNext();
//           }
//         }
//       }, 500);
//     } catch (e) {
//       console.warn("Load song error:", e);
//     }
//   },

//   playPause: async () => {
//     const { isPlaying } = get();
//     if (soundRef) {
//       if (isPlaying) {
//         await soundRef.pauseAsync();
//         set({ isPlaying: false });
//       } else {
//         await soundRef.playAsync();
//         set({ isPlaying: true });
//       }
//     }
//   },

//   seekTo: async (sec: number) => {
//     if (soundRef) {
//       await soundRef.setPositionAsync(sec * 1000);
//       set({ position: sec });
//     }
//   },

//   resetPlayer: async () => {
//     if (soundRef) {
//       try {
//         await soundRef.stopAsync();
//         await soundRef.unloadAsync();
//       } catch (e) {
//         console.warn("Unload error on reset:", e);
//       }
//       soundRef = null;
//     }

//     if (intervalRef) {
//       clearInterval(intervalRef);
//       intervalRef = null;
//     }

//     set({
//       currentSong: null,
//       queue: [],
//       history: [],
//       isPlaying: false,
//       position: 0,
//       duration: 0,
//     });
//   },
// }));

import { create } from "zustand";
import axios from "axios";
import Constants from "expo-constants";
import { Audio, AVPlaybackStatus } from "expo-av";

const API_URL = Constants.expoConfig?.extra?.API_URL;

interface Song {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  url?: string;
  preview_url?: string;
  duration_ms: number;
}

interface PlayerState {
  currentSong: Song | null;
  queue: Song[];
  history: Song[];
  isPlaying: boolean;
  position: number;
  duration: number;
  setCurrentSong: (song: Song) => void;
  setQueue: (queue: Song[]) => void;
  playNext: () => Promise<void>;
  playPrevious: () => Promise<void>;
  loadSong: (song: Song) => Promise<void>;
  playPause: () => Promise<void>;
  pause: () => Promise<void>; // ✅ ADDED
  seekTo: (sec: number) => Promise<void>;
  resetPlayer: () => void;
}

let soundRef: Audio.Sound | null = null;
let intervalRef: number | null = null;
let loadVersionRef = 0;

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  queue: [],
  history: [],
  isPlaying: false,
  position: 0,
  duration: 0,

  setCurrentSong: (song) => set({ currentSong: song }),
  setQueue: (queue) => set({ queue }),

  playNext: async () => {
    const { queue, currentSong, history, loadSong, setQueue } = get();
    if (queue.length === 0) {
      set({ isPlaying: false });
      return;
    }

    const nextSong = queue[0];
    set({
      history: currentSong ? [...history, currentSong] : history,
      queue: queue.slice(1),
    });
    setCurrentSong(nextSong);
    await loadSong(nextSong);

    try {
      const excludeIds = [
        currentSong?.id,
        ...queue.slice(1).map((s) => s.id),
        ...history.map((s) => s.id),
      ]
        .filter(Boolean)
        .join(",");

      const response = await axios.get(
        `${API_URL}/songs/${nextSong.id}/next?limit=1&exclude=${excludeIds}`
      );
      const newSong = response.data[0];
      const updatedQueue = [...queue.slice(1)];

      if (newSong && !updatedQueue.some((s) => s.id === newSong.id)) {
        updatedQueue.push(newSong);
      }

      setQueue(updatedQueue.slice(0, 5));
    } catch (err) {
      console.error("Error fetching new song for up next:", err);
      setQueue(queue.slice(1));
    }
  },

  playPrevious: async () => {
    const { history, loadSong, setCurrentSong } = get();
    if (history.length > 0) {
      const prevSong = history[history.length - 1];
      set({
        history: history.slice(0, -1),
        queue: [get().currentSong!, ...get().queue],
      });
      setCurrentSong(prevSong);
      await loadSong(prevSong);
    } else {
      await get().seekTo(0);
    }
  },

  loadSong: async (song: Song) => {
    const version = ++loadVersionRef;

    const fixedSong = {
      ...song,
      image: song.image || (song as any).album_cover || "",
    };

    if (soundRef) {
      try {
        await soundRef.stopAsync();
        await soundRef.unloadAsync();
      } catch (e) {
        console.warn("Unload error:", e);
      }
      soundRef = null;
    }

    set({ currentSong: fixedSong, position: 0 });

    if (fixedSong.duration_ms) {
      set({ duration: fixedSong.duration_ms / 1000 });
    }

    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: fixedSong.url ?? "" },
        { shouldPlay: true }
      );

      if (version !== loadVersionRef) {
        await sound.unloadAsync();
        return;
      }

      soundRef = sound;
      set({ isPlaying: true });

      if (intervalRef) clearInterval(intervalRef);

      intervalRef = setInterval(async () => {
        const status = (await sound.getStatusAsync()) as AVPlaybackStatus;
        if (status && "positionMillis" in status) {
          set({ position: status.positionMillis / 1000 });
          if (status.didJustFinish) {
            await get().playNext();
          }
        }
      }, 500);
    } catch (e) {
      console.warn("Load song error:", e);
    }
  },

  playPause: async () => {
    const { isPlaying } = get();
    if (soundRef) {
      if (isPlaying) {
        await soundRef.pauseAsync();
        set({ isPlaying: false });
      } else {
        await soundRef.playAsync();
        set({ isPlaying: true });
      }
    }
  },

  pause: async () => {
    if (soundRef) {
      await soundRef.pauseAsync();
      set({ isPlaying: false });
    }
  },

  seekTo: async (sec: number) => {
    if (soundRef) {
      await soundRef.setPositionAsync(sec * 1000);
      set({ position: sec });
    }
  },

  resetPlayer: async () => {
    if (soundRef) {
      try {
        await soundRef.stopAsync();
        await soundRef.unloadAsync();
      } catch (e) {
        console.warn("Unload error on reset:", e);
      }
      soundRef = null;
    }

    if (intervalRef) {
      clearInterval(intervalRef);
      intervalRef = null;
    }

    set({
      currentSong: null,
      queue: [],
      history: [],
      isPlaying: false,
      position: 0,
      duration: 0,
    });
  },
}));

