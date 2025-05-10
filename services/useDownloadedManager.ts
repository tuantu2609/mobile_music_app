import * as FileSystem from "expo-file-system";
import axios from "axios";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = Constants.expoConfig?.extra?.API_URL;

// ✅ Trả về đường dẫn local của file nhạc
export const getLocalSongPath = (songId: string) => {
  return `${FileSystem.documentDirectory}songs/${songId}.mp3`;
};

// ✅ Kiểm tra xem bài hát đã tải chưa (gồm cả local file & API check)
export const isSongDownloaded = async (
  songId: string,
  userId: string,
  token: string
): Promise<boolean> => {
  try {
    const [apiRes, file] = await Promise.all([
      axios.get(`${API_URL}/api/users/${userId}/downloaded-songs`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
      FileSystem.getInfoAsync(getLocalSongPath(songId)),
    ]);

    const downloadedIds = apiRes.data.map((s: any) => s.id);
    return downloadedIds.includes(songId) && file.exists;
  } catch (err) {
    console.warn("⚠️ isSongDownloaded error:", err);
    return false;
  }
};

// ✅ Tải bài hát về thiết bị
export const downloadSongToDevice = async (
  song: { id: string; url: string },
  userId: string,
  token: string
) => {
  const dir = `${FileSystem.documentDirectory}songs`;
  const fileUri = `${dir}/${song.id}.mp3`;

  // Tạo thư mục nếu chưa có
  const dirInfo = await FileSystem.getInfoAsync(dir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(dir, { intermediates: true });
  }

  // Tải file từ URL
  const downloadResumable = FileSystem.createDownloadResumable(
    song.url,
    fileUri,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  await downloadResumable.downloadAsync();

  // Gọi API backend để lưu bài hát đã tải vào user
  const res = await axios.post(
    `${API_URL}/api/users/${userId}/download-song`,
    { songId: song.id },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  // ✅ Lưu vào AsyncStorage cache
  try {
    const cacheKey = `cached_downloaded_songs_${userId}`;
    const existing = await AsyncStorage.getItem(cacheKey);
    const cached = existing ? JSON.parse(existing) : [];

    const updated = [
      ...cached.filter((s: any) => s.id !== song.id),
      res.data, // backend trả về bài hát đã lưu
    ];

    await AsyncStorage.setItem(cacheKey, JSON.stringify(updated));
  } catch (err) {
    console.warn("⚠️ Cache save failed", err);
  }
};

// ✅ Xoá bài hát khỏi thiết bị và backend
export const deleteDownloadedSong = async (
  songId: string,
  userId: string,
  token: string
) => {
  const path = getLocalSongPath(songId);

  try {
    // Xoá local file
    await FileSystem.deleteAsync(path, { idempotent: true });

    // Gọi backend để xoá khỏi user download list
    await axios.delete(`${API_URL}/api/users/download-song/${songId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Xoá cache local
    const cacheKey = `cached_downloaded_songs_${userId}`;
    const cached = await AsyncStorage.getItem(cacheKey);
    const list = cached ? JSON.parse(cached) : [];

    const updated = list.filter((s: any) => s.id !== songId);
    await AsyncStorage.setItem(cacheKey, JSON.stringify(updated));
  } catch (err) {
    console.warn("⚠️ deleteDownloadedSong error:", err);
  }
};

// ✅ Lấy danh sách bài hát đã tải (từ backend)
export const getDownloadedSongs = async (userId: string, token: string) => {
  const res = await axios.get(`${API_URL}/api/users/${userId}/downloaded-songs`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};