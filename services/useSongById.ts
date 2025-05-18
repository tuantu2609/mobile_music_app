import axios from "axios";
import Constants from "expo-constants";
const API_URL = Constants.expoConfig?.extra?.API_URL;

export const fetchSongById = async (id: string, token: string) => {
  const res = await axios.get(`${API_URL}/songs/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
