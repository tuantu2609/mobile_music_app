import axios from "axios";
import useFetch from "./useFetch";

export type Playlist = {
  id: string;
  name: string;
  description: string;
  creatorName: string;
  total_tracks: number;
  external_url: string;
};

const API_URL = "http://192.168.1.4:3001/api/users/liked-playlists";

const useLikedPlaylists = () =>
  useFetch<Playlist[]>(() => axios.get(API_URL, { withCredentials: true }).then((res) => res.data));

export default useLikedPlaylists;
