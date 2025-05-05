import axios from "axios";
import useFetch from "./useFetch";

export type Artist = {
  id: string;
  name: string;
  genres: string[];
  popularity: number;
  external_url: string;
};

const API_URL = "http://192.168.1.4:3001/api/users/followed-artists";

const useFollowedArtists = () =>
  useFetch<Artist[]>(() => axios.get(API_URL, { withCredentials: true }).then((res) => res.data));

export default useFollowedArtists;
