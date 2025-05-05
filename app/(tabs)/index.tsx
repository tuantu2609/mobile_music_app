import { useRouter } from "expo-router";
import { Text, View, Image, ScrollView, TouchableOpacity } from "react-native";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import { useState } from "react";
import SongCard from "@/components/SongCard";
import MixCard from "@/components/MixCard";
import AlbumCard from "@/components/AlbumCard";
import PlaylistCard from "@/components/PlaylistCard";
import RecommendationCard from "@/components/RecommendationCard";
import BannerCard from "@/components/BannerCard";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePlayerStore } from "@/store/usePlayerStore";
// lấy danh sách bài hát từ API
import useSongList, { Song } from "@/services/useSongList";

// lấy danh sách bài hát mới từ API
import useNewReleases from "@/services/useNewReleases";

// lấy danh sách playlists từ API
import usePlaylistList from "@/services/usePlaylistList";

// lấy danh sách album từ API
import useAlbumList from "@/services/useAlbumList";

import { useAuth } from "@/app/auth/useAuth";
import Constants from "expo-constants";
const API_URL = Constants.expoConfig?.extra?.API_URL;

export default function Index() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("For you");

  const tabs = ["For you", "Relax", "Workout", "Travel"];
  const { user } = useAuth();
  // lấy bài hát
  const { data: songs, loading, error } = useSongList();
  // lấy bài hát mới
  const {
    data: newReleases,
    loading: loadingNewReleases,
    error: errorNewReleases,
  } = useNewReleases();
  // lấy playlist
  const {
    data: playlists,
    loading: loadingPlaylists,
    error: errorPlaylists,
  } = usePlaylistList(10);

  const {
    data: albums,
    loading: loadingAlbums,
    error: errorAlbums,
  } = useAlbumList();

  const handleSongPress = async (song: Song) => {
    if (!user) {
      console.log("Chưa đăng nhập");
      return;
    }

    // Cập nhật bài hát đang phát
    await usePlayerStore.getState().loadSong({
      id: song.id,
      title: song.title,
      subtitle: song.Artists?.[0]?.name ?? "Unknown Artist",
      image: song.album_cover,
      url: song.url,
      duration_ms: song.duration_ms,
    });

    // Gửi API ghi lịch sử phát
    // try {
    //   await axios.post(`${API_URL}/api/plays/play`, {
    //     userId: user.id,
    //     songId: song.id,
    //   });
    // } catch (err) {
    //   console.error("Lỗi ghi lại bài hát", err);
    // }
  };

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full h-full z-0"
        resizeMode="cover"
        tintColor={"#000000"}
      />

      {/* ScrollView chính chứa toàn bộ nội dung */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* đã fix header*/}
        {/* Phần header */}
        <View className="pb-5 px-5">
          <View className="flex-row justify-between items-center">
            <View>
              <View className="flex-row items-center">
                <Image
                  source={icons.hello}
                  className="w-6 h-6 mr-2"
                  resizeMode="contain"
                />
                <Text className="text-white text-2xl font-bold">
                  Hi {user?.name || "User"},
                </Text>
              </View>

              <Text className="text-white text-3xl">Good Evening</Text>
            </View>

            <View className="flex-row items-center">
              <TouchableOpacity className="mr-5">
                <Image
                  source={icons.bell}
                  className="w-[32px] h-[32px]"
                  resizeMode="contain"
                  tintColor="#FFFFFF"
                  style={{ opacity: 0.25 }}
                />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => router.push("/profile")}>
                <Image
                  source={
                    user?.avatar
                      ? user.avatar.startsWith("http")
                        ? { uri: user.avatar }
                        : { uri: `${API_URL}${user.avatar}` }
                      : images.avatar
                  }
                  className="w-[48px] h-[48px] rounded-full"
                  resizeMode="cover"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Tab section */}
        <View className="px-5">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="h-13 mb-6"
            contentContainerStyle={{ height: 40 }}
          >
            <View className="flex-row space-x-3 h-full">
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-full min-w-[190px] ${
                    activeTab === tab ? "bg-white/25" : "bg-transparent"
                  } flex items-center justify-center`}
                >
                  <Text
                    className={`text-xl ${
                      activeTab === tab
                        ? "text-white font-semibold"
                        : "text-gray-400"
                    }`}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {activeTab === "For you" && (
          <>
            {/* Banner section */}
            <View className="px-5">
              <Text className="text-white text-3xl font-bold mb-5">
                Featuring Today
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 20 }}
              >
                {/* Mỗi banner nằm trong View riêng với width cố định */}
                <BannerCard source={images.banner1} />
                <BannerCard source={images.banner2} />
                <BannerCard source={images.banner3} />
                <BannerCard source={images.banner4} />
                <BannerCard source={images.banner5} />
              </ScrollView>
            </View>

            {/* Recently played section */}
            <View className="px-5 mt-10">
              <View className="flex-row justify-between items-center mb-5">
                <Text className="text-white text-3xl font-bold">
                  Recently Played
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/recently-played")}
                >
                  <Text className="text-gray-400 text-base text-xl">
                    See more
                  </Text>
                </TouchableOpacity>
              </View>
              {loading ? (
                <Text className="text-white">Đang tải...</Text>
              ) : error ? (
                <Text className="text-red-400">{error.message}</Text>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingRight: 20 }}
                >
                  {songs?.slice(0, 10).map((song) => (
                    <SongCard
                      key={song.id}
                      title={song.title}
                      image={{ uri: song.album_cover }}
                      onPress={() => handleSongPress(song)}
                    />
                  ))}
                </ScrollView>
              )}
            </View>

            {/* Mix section */}
            <View className="px-5 mt-10">
              <Text className="text-white text-3xl font-bold mb-5">
                Mix for you
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 20 }}
              >
                <MixCard
                  artists={[
                    { name: "Artist 1" },
                    { name: "Artist 2" },
                    { name: "Artist 3" },
                    { name: "Artist 4" },
                    { name: "Artist 5" },
                    { name: "Artist 6" },
                  ]}
                  image={images.mix}
                />
                <MixCard
                  artists={[
                    { name: "Artist 1" },
                    { name: "Artist 2" },
                    { name: "Artist 3" },
                    { name: "Artist 4" },
                    { name: "Artist 5" },
                    { name: "Artist 6" },
                  ]}
                  image={images.mix}
                />
                <MixCard
                  artists={[
                    { name: "Artist 1" },
                    { name: "Artist 2" },
                    { name: "Artist 3" },
                    { name: "Artist 4" },
                    { name: "Artist 5" },
                    { name: "Artist 6" },
                  ]}
                  image={images.mix}
                />
              </ScrollView>
            </View>

            {/* Album */}
            <View className="px-5 mt-10">
              <Text className="text-white text-3xl font-bold mb-5">
                For Artists You Follow
              </Text>
              {loadingAlbums ? (
                <Text className="text-white">Đang tải album...</Text>
              ) : errorAlbums ? (
                <Text className="text-red-400">{errorAlbums.message}</Text>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingRight: 20 }}
                >
                  {albums?.map((album) => (
                    <TouchableOpacity
                      key={album.id}
                      onPress={() => router.push(`/album/${album.id}`)}
                    >
                      <AlbumCard
                        album={{
                          name: album.name,
                          images: [
                            {
                              url: album.album_cover,
                              width: 640,
                              height: 640,
                            },
                          ],
                        }}
                        artist={{
                          name: album.Artists?.[0]?.name ?? "Unknown Artist",
                        }}
                      />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>

            {/* New Releases */}
            <View className="px-5 mt-10">
              <View className="flex-row justify-between items-center mb-5">
                <Text className="text-white text-3xl font-bold">
                  New Releases
                </Text>
                <TouchableOpacity onPress={() => router.push("/new-releases")}>
                  <Text className="text-gray-400 text-base text-xl">
                    See more
                  </Text>
                </TouchableOpacity>
              </View>
              {loadingNewReleases ? (
                <Text className="text-white">Đang tải New Releases...</Text>
              ) : errorNewReleases ? (
                <Text className="text-red-400">{errorNewReleases.message}</Text>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingRight: 20 }}
                >
                  {newReleases?.slice(0, 10).map((song) => (
                    <SongCard
                      key={song.id}
                      title={song.title}
                      image={{ uri: song.album_cover }}
                      onPress={() => handleSongPress(song)}
                    />
                  ))}
                </ScrollView>
              )}
            </View>

            {/* Playlist */}
            <View className="px-5 mt-10 pb-20">
              <View className="flex-row justify-between items-center mb-5">
                <Text className="text-white text-3xl font-bold">
                  Top Playlists
                </Text>
                <TouchableOpacity onPress={() => router.push("/playlists")}>
                  <Text className="text-gray-400 text-base text-xl">
                    See more
                  </Text>
                </TouchableOpacity>
              </View>

              {loadingPlaylists ? (
                <Text className="text-white">Đang tải playlists...</Text>
              ) : errorPlaylists ? (
                <Text className="text-red-400">{errorPlaylists.message}</Text>
              ) : (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ paddingRight: 20 }}
                >
                  {playlists?.map((playlist) => (
                    <PlaylistCard key={playlist.id} playlist={playlist} />
                  ))}
                </ScrollView>
              )}
            </View>
          </>
        )}

        {activeTab === "Relax" && (
          <>
            {/* Recommend Playlist */}
            <View className="px-5 mt-10">
              <Text className="text-white text-3xl font-bold mb-5">
                Today’s Refreshing Song-Recommendations
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 20 }}
              >
                <RecommendationCard />
                <RecommendationCard />
                <RecommendationCard />
              </ScrollView>
            </View>

            {/* Mix section */}
            <View className="px-5 mt-10">
              <Text className="text-white text-3xl font-bold mb-5">
                Mix for you
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 20 }}
              >
                <MixCard
                  artists={[
                    { name: "Artist 1" },
                    { name: "Artist 2" },
                    { name: "Artist 3" },
                    { name: "Artist 4" },
                    { name: "Artist 5" },
                    { name: "Artist 6" },
                  ]}
                  image={images.mix}
                />
                <MixCard
                  artists={[
                    { name: "Artist 1" },
                    { name: "Artist 2" },
                    { name: "Artist 3" },
                    { name: "Artist 4" },
                    { name: "Artist 5" },
                    { name: "Artist 6" },
                  ]}
                  image={images.mix}
                />
                <MixCard
                  artists={[
                    { name: "Artist 1" },
                    { name: "Artist 2" },
                    { name: "Artist 3" },
                    { name: "Artist 4" },
                    { name: "Artist 5" },
                    { name: "Artist 6" },
                  ]}
                  image={images.mix}
                />
              </ScrollView>
            </View>

            {/* Playlist */}
            <View className="px-5 mt-10 pb-20">
              <View className="flex-row justify-between items-center mb-5">
                <Text className="text-white text-3xl font-bold">Playlists</Text>
                <Text
                  className="text-gray-400 text-base text-xl"
                  onPress={() => {
                    console.log("See more pressed");
                  }}
                >
                  See more
                </Text>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingRight: 20 }}
              >
                <PlaylistCard
                  playlist={{
                    name: "Bật Nó Lên",
                    images: [
                      {
                        url: "https://product.hstatic.net/1000304920/product/soobin_batnolen_430f2bf37eb44a37a8349b645081e221_master.jpg",
                        width: 640,
                        height: 640,
                      },
                    ],
                    creatorName: "John Doe",
                  }}
                />
              </ScrollView>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
