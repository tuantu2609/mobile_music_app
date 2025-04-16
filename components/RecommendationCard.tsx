import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ImageSourcePropType,
} from "react-native";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import SongListCard from "./SongListCard";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const songs = [
  {
    id: "1",
    title: "Song Title 1",
    artists: "Artist Name 1",
    image: images.song,
  },
  {
    id: "2",
    title: "Song Title 2",
    artists: "Artist Name 2",
    image: images.song3,
  },
  {
    id: "3",
    title: "Song Title 3",
    artists: "Artist Name 3",
    image: images.song,
  },
  {
    id: "4",
    title: "Song Title 4",
    artists: "Artist Name 4",
    image: images.song3,
  },
];

const displayedSongs = songs.slice(0, 4);

interface SongItem {
  id: string;
  title: string;
  artists: string;
  image: ImageSourcePropType;
}

const renderSongItem = ({ item }: { item: SongItem }) => (
  <View className="p-4 flex-row items-center justify-between mt-2">
    <View className="flex-row items-center flex-1">
      <Image
        source={item.image}
        style={{
          width: screenWidth * 0.15,
          height: screenWidth * 0.15,
          borderRadius: 16,
        }}
        resizeMode="cover"
      />
      <View className="ms-3 flex-1">
        <Text className="text-white font-bold text-xl">{item.title}</Text>
        <Text className="text-white/70 text-xl">{item.artists}</Text>
      </View>
    </View>
    <TouchableOpacity className="opacity-50 flex items-center justify-center">
      <Image
        source={icons.more}
        style={{ width: 28, height: 28 }}
        resizeMode="contain"
        tintColor="white"
      />
    </TouchableOpacity>
  </View>
);

const RecommendationCard = () => {
  return (
    <View
      style={{
        width: screenWidth * 0.8,
        // height: screenHeight * 0.7,
        overflow: "hidden",
      }}
      className="mr-5 rounded-2xl"
    >
      <Image
        source={images.bg2}
        className="absolute w-full h-full rounded-2xl"
        resizeMode="cover"
      />
      <View className="p-4 flex-row items-start">
        <Image
          source={images.song2}
          style={{
            width: screenWidth * 0.25,
            height: screenWidth * 0.25,
            overflow: "hidden",
            borderRadius: 16,
          }}
          resizeMode="cover"
        />
        <View className="ms-5 flex-1 justify-between">
          <View>
            <Text className="text-white font-bold text-base">Song Title</Text>
            <Text className="text-white/50 font-bold text-base">22 Songs</Text>
          </View>

          <View
            className="flex-row items-center relative"
            style={{ top: screenHeight * 0.03 }}
          >
            <TouchableOpacity className="p-1 opacity-50 flex items-center justify-center">
              <Image
                source={icons.heart}
                // className="w-7 h-7"
                style={{
                  width: (screenWidth * 0.1) / 2,
                  height: (screenWidth * 0.1) / 2,
                }}
                resizeMode="contain"
                tintColor={"white"}
              />
            </TouchableOpacity>
            <TouchableOpacity className="p-1 opacity-50 flex items-center justify-center">
              <Image
                source={icons.more}
                // className="w-7 h-7"
                style={{
                  width: (screenWidth * 0.1) / 2,
                  height: (screenWidth * 0.1) / 2,
                }}
                resizeMode="contain"
                tintColor={"white"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="rounded-full bg-white flex items-center justify-center absolute right-0"
              style={{
                top: -(screenWidth * 0.075) / 2,
                width: screenWidth * 0.1,
                height: screenWidth * 0.1,
              }}
            >
              <Image
                source={icons.play}
                // className="w-6 h-6"
                style={{
                  width: (screenWidth * 0.1) / 3,
                  height: (screenWidth * 0.1) / 3,
                  marginLeft: 1,
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View className="mb-20">
        {/* Song component */}
        {displayedSongs.map((item) => (
          <SongListCard key={item.id} song={item} />
        ))}
      </View>

      <TouchableOpacity
        style={{
          position: "absolute",
          bottom: 16,
          right: 16,
          backgroundColor: "white",
          paddingHorizontal: 16,
          paddingVertical: 6,
          borderRadius: 999, // để bo tròn hoàn toàn
        }}
        onPress={() => {
          console.log("See All pressed");
        }}
      >
        <Text style={{ color: "black", fontWeight: "bold" }}>See All</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RecommendationCard;
