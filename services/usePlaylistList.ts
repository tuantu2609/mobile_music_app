import axios from "axios";
import useFetch from "./useFetch";
import Constants from "expo-constants";

export type Playlist = {
  id: string;
  name: string;
  creatorName: string;
  images: { url: string; width: number; height: number }[];
};

const API_URL = Constants.expoConfig?.extra?.API_URL;
const BASE_URL = `${API_URL}/api/playlists`;

const usePlaylistList = (limit = 10) =>
  useFetch<Playlist[]>(async () => {
    const res = await axios.get(`${BASE_URL}?limit=${limit}`);
    const playlists = res.data;

    // Convert image -> images luôn
    const formatted = playlists.map((playlist: any) => ({
      id: playlist.id,
      name: playlist.name,
      creatorName: playlist.creatorName,
      images: playlist.image
        ? [{ url: playlist.image, width: 640, height: 640 }]
        : [],
    }));

    return formatted;
  });

export default usePlaylistList;
