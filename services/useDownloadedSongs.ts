import { useQuery } from "@tanstack/react-query";
import { getDownloadedSongs } from "./useDownloadedManager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import { useAuth } from "@/app/auth/useAuth";

export default function useDownloadedSongs(userId: string | undefined) {
  const { loadToken, user } = useAuth();

  return useQuery({
    queryKey: ["downloadedSongs", userId],
    enabled: !!userId,
    queryFn: async () => {
      const id = userId || (await AsyncStorage.getItem("local_user_id"));
      const token = await loadToken();

      // 🔒 Bảo vệ thêm nếu token không khớp user
      if (!token || !id || user?.id !== id) {
        throw new Error("Token mismatch or missing user");
      }

      const { isConnected } = await NetInfo.fetch();
      const cacheKey = `cached_downloaded_songs_${id}`;

      if (isConnected) {
        const songs = await getDownloadedSongs(id, token);
        await AsyncStorage.setItem(cacheKey, JSON.stringify(songs));
        return songs;
      } else {
        const cached = await AsyncStorage.getItem(cacheKey);
        return cached ? JSON.parse(cached) : [];
      }
    },
    staleTime: 1000 * 60 * 60,
    cacheTime: 1000 * 60 * 60 * 24,
  });
}
