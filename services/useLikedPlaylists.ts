import axios from "axios";
import useFetch from "./useFetch";
import Constants from "expo-constants";

export type Playlist = {
  id: string;
  name: string;
  description: string;
  creatorName: string;
  total_tracks: number;
  external_url: string;
};

const API_URL = Constants.expoConfig?.extra?.API_URL;
const BASE_URL = `${API_URL}/api/users`;

const useLikedPlaylists = () =>
  useFetch<Playlist[]>(() => 
    axios.get(`${BASE_URL}/liked-playlists`, { withCredentials: true }).then((res) => res.data)
  );

export default useLikedPlaylists;
