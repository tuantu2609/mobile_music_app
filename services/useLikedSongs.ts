import axios from "axios";
import useFetch from "./useFetch";
import { Song } from "./useSongList";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.API_URL;
const BASE_URL = `${API_URL}/api/users`;

const useLikedSongs = () =>
  useFetch<Song[]>(() => 
    axios.get(`${BASE_URL}/liked-songs`, { withCredentials: true }).then((res) => res.data)
  );

export default useLikedSongs;
