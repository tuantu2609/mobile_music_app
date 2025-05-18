import axios from "axios";
import useFetch from "./useFetch";
import Constants from "expo-constants";
// import { useAuth } from "@/app/auth/useAuth";
import { useAuthStore } from "@/store/useAuthStore";
import { Song } from "@/interfaces/interfaces";

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
    const normalized = response.data.map((s: any) => ({
      ...s,
      artists: s.Artists ?? [],
    }));

    return normalized;
  });
};

export default useNewReleases;
