import axios from "axios";
import useFetch from "./useFetch";
import Constants from "expo-constants";
import { useAuthStore } from "@/store/useAuthStore";

const API_URL = Constants.expoConfig?.extra?.API_URL;
const BASE_URL = `${API_URL}/albums`;

export interface Album {
  id: string;
  name: string;
  album_cover: string;
  Artists: { id: string; name: string }[];
}

export default function useAlbumList() {
  const { token } = useAuthStore();

  return useFetch<Album[]>(async () => {
    const res = await axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  });
}
