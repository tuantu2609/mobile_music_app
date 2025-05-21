import {
  View,
  Text,
  Image,
  // FlatList,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Pressable,
  Keyboard,
} from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import axios from "axios";
import Constants from "expo-constants";

import { useAuthStore } from "@/store/useAuthStore";
import { usePlayerStore } from "@/store/usePlayerStore";
import { fetchSongById } from "@/services/useSongById";

type SearchResultItem = {
  id: string;
  type: "Song" | "Artist" | "Album" | "Playlist";
  title: string;
  subtitle: string;
  image: string | { uri: string };
};

const API_URL = Constants.expoConfig?.extra?.API_URL;

const Search = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);
  const router = useRouter();
  const { token, user } = useAuthStore();

  const debounceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSongPress = async (item: SearchResultItem) => {
    if (!user || !token) {
      console.log("Chưa đăng nhập");
      return;
    }

    try {
      const detailedSong = await fetchSongById(item.id, token);

      await usePlayerStore.getState().loadSong({
        id: detailedSong.id,
        title: detailedSong.title,
        artists: detailedSong.Artists ?? [],
        album_cover: detailedSong.album_cover,
        url: detailedSong.url,
        duration_ms: detailedSong.duration_ms,
        isLiked: detailedSong.isLiked,
        isDownloaded: detailedSong.isDownloaded,
      });

      router.push({ pathname: "/song/[id]", params: { id: item.id } });
    } catch (error) {
      console.error("Error fetching song detail:", error);
    }
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/search?q=${encodeURIComponent(query)}`
      );
      const { songs, artists, albums, playlists } = response.data;

      const results: SearchResultItem[] = [
        ...songs.map((song: any) => ({
          id: song.id,
          type: "Song",
          title: song.title,
          subtitle: song.Artists?.map((a: any) => a.name).join(", ") || "",
          image: { uri: song.album_cover },
        })),
        ...artists.map((artist: any) => ({
          id: artist.id,
          type: "Artist",
          title: artist.name,
          subtitle: `${artist.followers?.toLocaleString()} followers` || "",
          image: artist.image ? { uri: artist.image } : images.artist,
        })),
        ...albums.map((album: any) => ({
          id: album.id,
          type: "Album",
          title: album.name,
          subtitle: album.label || "",
          image: { uri: album.album_cover },
        })),
        ...playlists.map((playlist: any) => ({
          id: playlist.id,
          type: "Playlist",
          title: playlist.name,
          subtitle: playlist.creatorName || "",
          image: { uri: playlist.image },
        })),
      ];

      setSearchResults(results);
    } catch (error: unknown) {
      console.error("Search failed:", (error as Error).message);
    }
  };

  // ✅ Debounce search
  useEffect(() => {
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    debounceTimeout.current = setTimeout(() => {
      handleSearch(searchQuery.trim());
    }, 500);

    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [searchQuery]);

  const getTypeIcon = (type: SearchResultItem["type"]) => {
    switch (type) {
      case "Song":
        return "🎵";
      case "Artist":
        return "👤";
      case "Album":
        return "💿";
      case "Playlist":
        return "📀";
      default:
        return "";
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full h-full z-0"
        resizeMode="cover"
        tintColor={"#000000"}
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 64 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Search bar */}
        <View className="bg-white rounded-xl flex-row items-center px-4 py-3 mb-6 m-4">
          <Image
            source={icons.search}
            className="w-5 h-5 mr-3"
            tintColor="gray"
          />
          <TextInput
            value={searchQuery}
            onChangeText={(text) => {
              setSearchQuery(text); // ✅ chỉ set state, không gọi search trực tiếp
            }}
            onFocus={() => setIsSearching(true)}
            placeholder="Search songs, artist, album or playlist"
            placeholderTextColor="#999"
            className="flex-1 text-gray"
          />
        </View>

        {isSearching ? (
          <>
            {searchQuery.trim() !== "" ? (
              <View>
                <Text className="text-white text-base font-semibold mx-4 mb-3">
                  Search results
                </Text>

                {searchResults.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    className="flex-row items-center px-4 mb-4"
                    onPress={() => {
                      if (item.type === "Song") {
                        handleSongPress(item);
                      } else {
                        const pathMap = {
                          Song: "/song/[id]",
                          Album: "/album/[id]",
                          Artist: "/artist/[id]",
                          Playlist: "/playlist/[id]",
                        } as const;
                        const path = pathMap[item.type];
                        router.push({
                          pathname: path,
                          params: { id: item.id },
                        });
                      }
                    }}
                  >
                    <Image
                      source={
                        typeof item.image === "string"
                          ? { uri: item.image }
                          : item.image
                      }
                      className="w-12 h-12 rounded-md mr-3"
                      resizeMode="cover"
                    />
                    <View style={{ flexShrink: 1 }}>
                      <Text
                        className="text-white font-semibold"
                        numberOfLines={1}
                      >
                        {getTypeIcon(item.type)} {item.title}
                      </Text>
                      <Text className="text-white/60 text-xs" numberOfLines={1}>
                        {item.type}
                        {item.subtitle ? ` • ${item.subtitle}` : ""}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}

                {searchResults.length === 0 && (
                  <Text className="text-white text-center mt-4">
                    No results found.
                  </Text>
                )}
              </View>
            ) : (
              <Pressable
                onPress={() => {
                  setIsSearching(false);
                  Keyboard.dismiss();
                }}
              >
                <Text className="text-white text-base font-semibold mx-4 mb-3">
                  Recent searches
                </Text>
              </Pressable>
            )}
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Search;
