import { create } from "zustand";
import { Audio, AVPlaybackStatus } from "expo-av";

import type { Song } from "@/interfaces/interfaces";
import { useAuthStore } from "./useAuthStore";
import { fetchSongById } from "@/services/useSongById";
// import { useAuthStore } from "./useAuthStore";
// import { getTotalLikesOfSong, getUserLikedSongs } from "@/services/useAuth";
// import { isSongDownloaded } from "@/services/useDownloadedManager";

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
  togglePlayback: () => Promise<void>;
  forcePause: () => Promise<void>;
  seekTo: (sec: number) => Promise<void>;
  resetPlayer: () => void;
  unload: () => Promise<void>;
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

  loadSong: async (song: Song) => {
    const version = ++loadVersionRef;
    const uri = song.url;

    if (!uri) {
      console.warn("⚠️ Không có đường dẫn âm thanh để phát");
      return;
    }

    if (soundRef) {
      try {
        await soundRef.stopAsync();
        await soundRef.unloadAsync();
      } catch (e) {
        console.warn("🔁 Unload error:", e);
      }
      soundRef = null;
    }

    // ✅ Dùng nguyên song truyền vào
    set({ currentSong: song, position: 0 });

    if (song.duration_ms) {
      set({ duration: song.duration_ms / 1000 });
    }

    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri },
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

  togglePlayback: async () => {
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

  forcePause: async () => {
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

  //Dùng khi người dùng logout, đổi tài khoản, reset toàn bộ về mặc định
  resetPlayer: async () => {
    if (soundRef) {
      try {
        await soundRef.stopAsync();
        await soundRef.unloadAsync();
      } catch (e) {
        console.warn("❌ Reset unload error:", e);
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

  // Dùng khi chuyển sang bài hát mới, không cần reset toàn bộ
  unload: async () => {
    if (soundRef) {
      await soundRef.unloadAsync();
      soundRef = null;
      set({ isPlaying: false });
    }
  },

  playNext: async () => {
    const { queue, currentSong, history, loadSong, setQueue } = get();

    if (queue.length === 0) {
      set({ isPlaying: false });
      return;
    }

    const [next, ...rest] = queue;
    if (currentSong) {
      set({ history: [...history, currentSong] });
    }
    let detailedSong = next;

    try {
      const token = useAuthStore.getState().token;
      if (token) {
        const songFromApi = await fetchSongById(next.id, token); // Gọi API nếu online
        detailedSong = {
          ...songFromApi,
          artists: songFromApi.Artists ?? [], // <-- chuẩn hóa field
        };
      }
    } catch (e) {
      console.warn("⚠️ Không thể fetch chi tiết bài hát:", e);
    }
    await loadSong(detailedSong);
    setQueue(rest);
  },

  playPrevious: async () => {
    const { history, loadSong, setCurrentSong, currentSong, queue } = get();
    if (history.length > 0) {
      const prevSong = history[history.length - 1];
      set({
        history: history.slice(0, -1),
        queue: [currentSong!, ...queue],
      });
      setCurrentSong(prevSong);
      await loadSong(prevSong);
    } else {
      await get().seekTo(0);
    }
  },
}));
