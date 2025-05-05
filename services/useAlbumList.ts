import { useEffect, useState } from "react";
import axios from "axios";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.API_URL;

export interface Album {
  id: string;
  name: string;
  album_cover: string;
  Artists: { id: string; name: string }[];
}

export default function useAlbumList() {
  const [data, setData] = useState<Album[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const res = await axios.get(`${API_URL}/albums`);
        setData(res.data);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchAlbums();
  }, []);

  return { data, loading, error };
}
