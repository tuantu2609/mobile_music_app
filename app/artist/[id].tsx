import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import AlbumCard from "@/components/AlbumCard";
import SongListCard from "@/components/SongListCard";
import Modal from "react-native-modal";
import { useState } from "react";

const sampleArtist = {
  name: "Soobin",
  image: {
    uri: "https://i.ytimg.com/vi/d44UTUSTYKU/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLCdlK1p5-fGP2nK6wRRAF92c9m_aA",
  },
  listeners: "2.3 L monthly listeners",
};

const sampleTracks = [
  {
    id: "1",
    title: "Misery",
    subtitle: "Maroon 5 - Misery",
    image: "https://i.imgur.com/WzJDvql.png",
  },
  {
    id: "2",
    title: "Payphone",
    subtitle: "Maroon 5 - Overexposed",
    image: "https://i.imgur.com/3HtV6oY.png",
  },
  {
    id: "3",
    title: "Animals",
    subtitle: "Maroon 5 - V",
    image: "https://i.imgur.com/jXcAhwV.png",
  },
  {
    id: "4",
    title: "Sugar",
    subtitle: "Maroon 5 - Singles",
    image: "https://i.imgur.com/lSZg2SH.png",
  },
  {
    id: "5",
    title: "The Sun",
    subtitle: "Maroon 5 - Songs About Jane",
    image: "https://i.imgur.com/vP4ZOpF.png",
  },
  {
    id: "6",
    title: "What Lovers Do",
    subtitle: "Maroon 5 - Red Pill Blues Deluxe",
    image: "https://i.imgur.com/vkP2HeX.png",
  },
  {
    id: "7",
    title: "Daylight",
    subtitle: "Maroon 5 - Overexposed",
    image: "https://i.imgur.com/0rVZ0WZ.png",
  },
  {
    id: "8",
    title: "Wait",
    subtitle: "Maroon 5 - Red Pill Blues",
    image: "https://i.imgur.com/2nCt3Sb.png",
  },
  {
    id: "9",
    title: "Beautiful Goodbye",
    subtitle: "Maroon 5 - V",
    image: "https://i.imgur.com/b7b9xN3.png",
  },
  {
    id: "10",
    title: "She Will Be Loved",
    subtitle: "Maroon 5 - Songs About Jane",
    image: "https://i.imgur.com/fRBxzju.png",
  },
];

const similarArtists = [
  { id: "1", name: "Soobin Hoàng Sơn", image: images.artist },
  { id: "2", name: "Childish Gambino", image: images.artist },
  { id: "3", name: "Marvin Gaye", image: images.artist },
  { id: "4", name: "Kanye West", image: images.artist },
  { id: "5", name: "Justin Beiber", image: images.artist },
];

const screenWidth = Dimensions.get("window").width;

const ArtistDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const width = screenWidth * 0.25;
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 relative">
        {/* Nút back cố định */}
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
          <View className="relative w-full h-64">
            <Image
              source={sampleArtist.image}
              className="w-full h-full"
              resizeMode="cover"
            />
            <View className="absolute inset-0 bg-black/40 justify-end px-4 pb-4">
              <Text className="text-white text-3xl font-bold">
                {sampleArtist.name}
              </Text>
              <Text className="text-white/70 text-sm mt-1">Artist</Text>
            </View>
          </View>

          <View className="px-4 mt-4 mb-2">
            <Text className="text-white/70">{sampleArtist.listeners}</Text>
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

          {/* Popular releases */}
          <View className="flex-row justify-between items-center px-4 mt-4 mb-2">
            <Text className="text-white font-bold text-lg">
              Popular releases
            </Text>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Text className="text-white/50 text-sm">See more</Text>
            </TouchableOpacity>
          </View>
          {sampleTracks.slice(0, 6).map((track) => (
            <SongListCard key={track.id} song={track} />
          ))}

          {/* Artist Album */}
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
              <AlbumCard
                album={{
                  name: "Bật Nó Lên",
                  images: [
                    {
                      url: "https://product.hstatic.net/1000304920/product/soobin_batnolen_430f2bf37eb44a37a8349b645081e221_master.jpg",
                      width: 640,
                      height: 640,
                    },
                  ],
                }}
                artist={{ name: "Artist 1" }}
              />
              <AlbumCard
                album={{
                  name: "Nắng Hoa Niên",
                  images: [
                    {
                      url: "https://product.hstatic.net/1000304920/product/vuong_binh-anh_bo_vai-full_album_bc551e2e0ffe41b08c3ee2feb81aaa3e.jpg",
                      width: 640,
                      height: 640,
                    },
                  ],
                }}
                artist={{ name: "Artist 2" }}
              />
              <AlbumCard
                album={{
                  name: "Album 3",
                  images: [
                    {
                      url: "https://i.scdn.co/image/ab67616d0000b273794744c57c9f35db88249842",
                      width: 640,
                      height: 640,
                    },
                  ],
                }}
                artist={{ name: "Artist 3" }}
              />
            </ScrollView>
          </View>

          <View className="mt-4 mb-2">
            <Text className="text-white font-semibold text-lg ml-4 mb-2">
              Similar artists
            </Text>
            <FlatList
              className="mx-4 mb-4"
              horizontal
              showsHorizontalScrollIndicator={false}
              data={similarArtists}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View className="items-center mr-5">
                  <Image
                    source={item.image}
                    className="w-16 h-16 rounded-full mb-1"
                    resizeMode="cover"
                  />
                  <Text className="text-white text-xs text-center w-20">
                    {item.name}
                  </Text>
                </View>
              )}
            />
          </View>
        </ScrollView>
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
              data={sampleTracks}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <SongListCard song={item} />}
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
