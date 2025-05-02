import { create } from "zustand";

interface Song {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
  url: string;
  duration_ms: number;
}

interface PlayerState {
  currentSong: Song | null;
  queue: Song[];
  setCurrentSong: (song: Song) => void;
  setQueue: (queue: Song[]) => void;
  playNext: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentSong: null,
  queue: [],
  setCurrentSong: (song) => set({ currentSong: song }),
  setQueue: (queue) => set({ queue }),
  playNext: () => {
    const { queue } = get();
    if (queue.length > 0) {
      const [nextSong, ...restQueue] = queue;
      set({ currentSong: nextSong, queue: restQueue });
    } else {
      console.log("End of queue");
      set({ currentSong: null });
    }
  },
}));
