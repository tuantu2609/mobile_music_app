import axios from "axios";
import useFetch from "./useFetch";

export type Song = {
  id: string;
  title: string;
  album_cover: string;
  Artists: { id: string; name: string }[];
  Album?: { id: string; name: string; release_date: string };
};

const API_URL = "API_URL=http://192.168.1.4:3001/api/songs";

const useSongList = () =>
  useFetch<Song[]>(() => axios.get(API_URL).then((res) => res.data));

export default useSongList;
