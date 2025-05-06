import axios from "axios";
import useFetch from "./useFetch";
import Constants from "expo-constants";
// import { useAuth } from "@/app/auth/useAuth";
import { useAuthStore } from "@/store/useAuthStore";
export type Song = {
  id: string;
  title: string;
  album_cover: string;
  Artists: { id: string; name: string }[];
  Album?: { id: string; name: string; release_date: string };
  release_date?: string;
  url: string;
  duration_ms: number;
};

const API_URL = Constants.expoConfig?.extra?.API_URL;
const BASE_URL = `${API_URL}/songs/new-releases`;

const useNewReleases = () => {
  const { token } = useAuthStore();
  return useFetch<Song[]>(async () => {
    const response = await axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  });
};

export default useNewReleases;
