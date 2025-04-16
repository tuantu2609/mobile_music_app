import { create } from "zustand";

interface Song {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
}

interface PlayerState {
  currentSong: Song | null;
  setCurrentSong: (song: Song) => void;
}

export const usePlayerStore = create<PlayerState>((set) => ({
  currentSong: null,
  setCurrentSong: (song) => set({ currentSong: song }),
}));
