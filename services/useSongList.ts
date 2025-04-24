import axios from "axios";
import useFetch from "./useFetch";
import Constants from "expo-constants";
export type Song = {
  id: string;
  title: string;
  album_cover: string;
  Artists: { id: string; name: string }[];
  Album?: { id: string; name: string; release_date: string };
};
const API_URL = Constants.expoConfig?.extra?.API_URL;
const BASE_URL = `${API_URL}/api/songs`;

const useSongList = () =>
  useFetch<Song[]>(() => axios.get(BASE_URL).then((res) => res.data));

export default useSongList;
