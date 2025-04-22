import axios from "axios";
import useFetch from "./useFetch";
import { Song } from "./useSongList";

const API_URL = "http://192.168.1.4:3001/api/users/liked-songs";

const useLikedSongs = () =>
  useFetch<Song[]>(() => axios.get(API_URL, { withCredentials: true }).then((res) => res.data));

export default useLikedSongs;
