import { useQuery } from "@tanstack/react-query";
import { getUserLikedSongs } from "./useAuth";
import { useAuth } from "@/app/auth/useAuth";

export default function useLikedSongs(userId: string | undefined) {
  const { loadToken } = useAuth();

  return useQuery({
    enabled: !!userId,
    queryKey: ["likedSongs", userId],
    queryFn: async () => {
      const token = await loadToken();
      if (token && userId) {
        return await getUserLikedSongs(userId, token);
      }
      return [];
    },
  });
}