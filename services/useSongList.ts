// import axios from "axios";
// import useFetch from "./useFetch";
// import Constants from "expo-constants";
// export type Song = {
//   id: string;
//   title: string;
//   album_cover: string;
//   Artists: { id: string; name: string }[];
//   Album?: { id: string; name: string; release_date: string };
//   url: string;
// };
// const API_URL = Constants.expoConfig?.extra?.API_URL;
// const BASE_URL = `${API_URL}/songs`;

// const useSongList = () =>
//   useFetch<Song[]>(() => axios.get(BASE_URL).then((res) => res.data));

// export default useSongList;

import axios from "axios";
import useFetch from "./useFetch";
import Constants from "expo-constants";
import { useAuth } from "@/app/auth/useAuth";

export type Song = {
  id: string;
  title: string;
  album_cover: string;
  Artists: { id: string; name: string }[];
  Album?: { id: string; name: string; release_date: string };
  url: string;
  duration_ms: number;
};

const API_URL = Constants.expoConfig?.extra?.API_URL;
const BASE_URL = `${API_URL}/songs`;

const useSongList = () => {
  const { loadToken } = useAuth();

  return useFetch<Song[]>(async () => {
    const token = await loadToken();
    const response = await axios.get(BASE_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  });
};

export default useSongList;
