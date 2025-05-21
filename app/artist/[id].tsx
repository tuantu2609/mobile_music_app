import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { icons } from "@/constants/icons";
import { SafeAreaView } from "react-native-safe-area-context";
import AlbumCard from "@/components/AlbumCard";
import SongListCard from "@/components/SongListCard";
import Modal from "react-native-modal";
import axios from "axios";
import Constants from "expo-constants";
import { Artist, Song, Album } from "@/interfaces/interfaces";

const screenWidth = Dimensions.get("window").width;

const ArtistDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const width = screenWidth * 0.25;
  const [isModalVisible, setModalVisible] = useState(false);
  const [artist, setArtist] = useState<Artist | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await axios.get<{
          artist: Artist;
          songs: Song[];
          albums: Album[];
        }>(`${Constants.expoConfig?.extra?.API_URL}/artists/${id}`);

        setArtist(response.data.artist);
        setSongs(response.data.songs);
        setAlbums(response.data.albums);
      } catch (err) {
        console.error("Failed to fetch artist", err);
      }
    };

    if (id) fetchArtist();
  }, [id]);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 relative">
        {/* Nút quay lại */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="absolute top-4 left-4 z-50 bg-black/60 p-3 rounded-full"
        >
          <Image
            source={icons.back}
            className="w-5 h-5"
            tintColor="white"
            resizeMode="contain"
          />
        </TouchableOpacity>

        <ScrollView>
          {/* Ảnh nền artist */}
          <View className="relative w-full h-64">
            {(() => {
              const artistImage =
                (artist as any)?.image || "https://example.com/default.jpg";

              return (
                <Image
                  source={{ uri: artistImage }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              );
            })()}
            <View className="absolute inset-0 bg-black/40 justify-end px-4 pb-4">
              <Text className="text-white text-3xl font-bold">
                {artist?.name || "Unknown Artist"}
              </Text>
              <Text className="text-white/70 text-sm mt-1">Artist</Text>
            </View>
          </View>

          {/* Tác vụ artist */}
          <View className="px-4 mt-4 mb-2">
            <Text className="text-white/70">
              {artist?.followers?.toLocaleString()} followers
            </Text>
            <View className="flex-row items-center space-x-4 mt-2 relative">
              <TouchableOpacity className="bg-white px-4 py-2 rounded-full">
                <Text className="text-black font-bold">Follow</Text>
              </TouchableOpacity>
              <TouchableOpacity>
                <Image
                  source={icons.share}
                  className="w-6 h-6 ml-5"
                  resizeMode="contain"
                  tintColor={"white"}
                />
              </TouchableOpacity>
              <TouchableOpacity
                className="absolute bottom-2 right-2 rounded-full bg-white flex items-center justify-center"
                style={{
                  width: width / 3,
                  height: width / 3,
                  borderRadius: width / 3 / 2,
                }}
              >
                <Image
                  source={icons.play}
                  style={{
                    width: width / 4 / 2,
                    height: width / 4 / 2,
                    marginLeft: 1,
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Top bài hát */}
          <View className="flex-row justify-between items-center px-4 mt-4 mb-2">
            <Text className="text-white font-bold text-lg">
              Popular releases
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text className="text-white/50 text-sm">See more</Text>
            </TouchableOpacity>
          </View>

          {songs.slice(0, 6).map((track) => (
            <SongListCard
              key={track.id}
              song={{
                ...track,
                image: track.album_cover,
              }}
            />
          ))}

          {/* Album section */}
          <View className="px-5 mt-10">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-white font-bold text-lg">Album</Text>
              <Text className="text-white/50 text-sm">See more</Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingRight: 20 }}
            >
              {albums.map((album) => {
                const album_cover =
                  (album as any).album_cover ||
                  "https://example.com/default.jpg";

                return (
                  <AlbumCard
                    key={album.id}
                    album={{
                      name: album.name,
                      images: [
                        {
                          url: album_cover,
                          width: 640,
                          height: 640,
                        },
                      ],
                    }}
                    artist={{ name: artist?.name || "Unknown" }}
                  />
                );
              })}
            </ScrollView>
          </View>
        </ScrollView>

        {/* Modal bài hát */}
        <Modal
          isVisible={isModalVisible}
          onBackdropPress={() => setModalVisible(false)}
          style={{ justifyContent: "flex-end", margin: 0 }}
          useNativeDriver
          animationIn="slideInUp"
          animationOut="slideOutDown"
          hideModalContentWhileAnimating
        >
          <View className="bg-black rounded-t-3xl px-4 pt-6 pb-10 max-h-[80%]">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-white text-xl font-bold">All Songs</Text>
              <View className="flex-row items-center space-x-4">
                <TouchableOpacity className="bg-white rounded-full p-2 mr-5">
                  <Image
                    source={icons.play}
                    className="w-4 h-4"
                    tintColor="black"
                    resizeMode="contain"
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Text className="text-white text-sm">Close</Text>
                </TouchableOpacity>
              </View>
            </View>

            <FlatList
              data={songs}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <SongListCard
                  song={{
                    ...item,
                    image: item.album_cover,
                  }}
                />
              )}
              showsVerticalScrollIndicator={false}
              initialNumToRender={10}
              maxToRenderPerBatch={10}
            />
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default ArtistDetails;
