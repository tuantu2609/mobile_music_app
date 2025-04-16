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
import SongListCard from "@/components/SongListCard";

const sampleAlbum = {
  name: "Bật Nó Lên",
  image: {
    uri: "https://i.ytimg.com/vi/6QMu7-3DMi0/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLC3TTvn-zCoGHe990qz6fun1Gz0Vw",
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

const Artists = [
  { id: "1", name: "Soobin Hoàng Sơn", image: images.artist },
  { id: "2", name: "Childish Gambino", image: images.artist },
  { id: "3", name: "Marvin Gaye", image: images.artist },
  { id: "4", name: "Kanye West", image: images.artist },
  { id: "5", name: "Justin Beiber", image: images.artist },
];

const screenWidth = Dimensions.get("window").width;

const AlbumDetails = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const width = screenWidth * 0.25;

  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-1 relative">
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
              source={sampleAlbum.image}
              className="w-full h-full"
              resizeMode="cover"
            />
            <View className="absolute inset-0 bg-black/40 justify-end px-4 pb-4">
              <Text className="text-white text-3xl font-bold">
                {sampleAlbum.name}
              </Text>
              <Text className="text-white/70 text-sm mt-1">Album</Text>
            </View>
          </View>

          <View className="px-4 mt-4 mb-2">
            <View className="flex-row items-center space-x-2">
              <Text className="text-white/70 mr-1">
                {sampleAlbum.listeners}
              </Text>
              <Text className="text-white/40 text-sm">
                • {sampleTracks.length} songs
              </Text>
            </View>
            <View className="flex-row items-center space-x-4 mt-2 justify-between">
              <View className="flex-row items-center justify-center">
                <TouchableOpacity>
                  <Image
                    source={icons.heart}
                    className="w-6 h-6"
                    resizeMode="contain"
                    tintColor={"white"}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image
                    source={icons.download}
                    className="w-6 h-6 ml-6"
                    resizeMode="contain"
                    tintColor={"white"}
                  />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image
                    source={icons.share}
                    className="w-6 h-6 ml-6"
                    resizeMode="contain"
                    tintColor={"white"}
                  />
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity
                  className="rounded-full bg-white flex items-center justify-center"
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
          </View>

          {/* Songs */}
          {sampleTracks.map((track) => (
            <SongListCard key={track.id} song={track} />
          ))}

          <View className="mt-4 mb-2">
            <Text className="text-white font-semibold text-lg ml-4 mb-2">
              Featuring Artists
            </Text>
            <FlatList
              className="mx-4 mb-4"
              horizontal
              showsHorizontalScrollIndicator={false}
              data={Artists}
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
      </View>
    </SafeAreaView>
  );
};

export default AlbumDetails;
