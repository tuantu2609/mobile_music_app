import axios from "axios";
import useFetch from "./useFetch";
import Constants from "expo-constants";

export type Artist = {
  id: string;
  name: string;
  genres: string[];
  popularity: number;
  external_url: string;
};

const API_URL = Constants.expoConfig?.extra?.API_URL;
const BASE_URL = `${API_URL}/api/users`;

const useFollowedArtists = () =>
  useFetch<Artist[]>(() => 
    axios.get(`${BASE_URL}/followed-artists`, { withCredentials: true }).then((res) => res.data)
  );

export default useFollowedArtists;
