import {
  View,
  Text,
  Image,
  FlatList,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useEffect } from "react";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Link } from "expo-router";

const trendingArtists = [
  { id: "1", name: "Soobin Hoàng Sơn", image: images.artist },
  { id: "2", name: "Childish Gambino", image: images.artist },
  { id: "3", name: "Marvin Gaye", image: images.artist },
  { id: "4", name: "Kanye West", image: images.artist },
  { id: "5", name: "Justin Beiber", image: images.artist },
];

const genres = [
  { id: "1", title: "TAMIL", image: images.gener },
  { id: "2", title: "INTERNATIONAL", image: images.gener },
  { id: "3", title: "POP", image: images.gener },
  { id: "4", title: "HIP-HOP", image: images.gener },
  { id: "5", title: "DANCE", image: images.gener },
  { id: "6", title: "COUNTRY", image: images.gener },
  { id: "7", title: "INDIE", image: images.gener },
  { id: "8", title: "JAZZ", image: images.gener },
  { id: "9", title: "PUNK", image: images.gener },
  { id: "10", title: "R&B", image: images.gener },
  { id: "11", title: "DISCO", image: images.gener },
  { id: "12", title: "ROCK", image: images.gener },
];

const recentSearches = [
  {
    id: "1",
    title: "You (feat. Travis Scott)",
    type: "Song",
    subtitle: "Don Toliver",
    image: images.song,
  },
  {
    id: "2",
    title: "John Wick: Chapter 4 (Original Soundtrack)",
    type: "Album",
    subtitle: "Tyler Bates, Joel J. Richard",
    image: images.song2,
  },
  {
    id: "3",
    title: "Maroon 5",
    type: "Artist",
    subtitle: "",
    image: images.song3,
  },
  {
    id: "4",
    title: "Phonk Madness",
    type: "Playlist",
    subtitle: "",
    image: images.song2,
  },
];

const search = () => {
  const [isSearching, setIsSearching] = React.useState(false);
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full h-full z-0"
        resizeMode="cover"
        tintColor={"#000000"}
      />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 24 }}
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
            onFocus={() => setIsSearching(true)}
            onBlur={() => setIsSearching(false)}
            placeholder="Search songs, artist, album or playlist"
            placeholderTextColor="#999"
            className="flex-1 text-gray"
          />
        </View>

        {isSearching ? (
          <>
            <Text className="text-white text-base font-semibold mx-4 mb-3">
              Recent searches
            </Text>
            {recentSearches.map((item) => (
              <View
                key={item.id}
                className="flex-row items-center justify-between px-4 mb-4"
              >
                {item.type === "Artist" ? (
                  <Link href={`/artist/${item.id}`} asChild>
                    <TouchableOpacity className="flex-row items-center flex-1">
                      <Image
                        source={item.image}
                        className="w-12 h-12 rounded-md mr-3"
                        resizeMode="cover"
                      />
                      <View style={{ flexShrink: 1 }}>
                        <Text
                          className="text-white font-semibold"
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {item.title}
                        </Text>
                        <Text
                          className="text-white/60 text-xs"
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {item.type}
                          {item.subtitle ? ` • ${item.subtitle}` : ""}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </Link>
                ) : (
                  <TouchableOpacity className="flex-row items-center flex-1">
                    {/* Trường hợp khác không phải Artist */}
                    <Image
                      source={item.image}
                      className="w-12 h-12 rounded-md mr-3"
                      resizeMode="cover"
                    />
                    <View style={{ flexShrink: 1 }}>
                      <Text
                        className="text-white font-semibold"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.title}
                      </Text>
                      <Text
                        className="text-white/60 text-xs"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.type}
                        {item.subtitle ? ` • ${item.subtitle}` : ""}
                      </Text>
                    </View>
                  </TouchableOpacity>
                )}

                <Text className="text-white/60 text-xl ml-3">×</Text>
              </View>
            ))}
            <Text className="text-right text-white/40 text-sm mr-4 mt-4">
              Clear history
            </Text>
          </>
        ) : (
          <>
            {/* Trending section */}
            <View className="flex-row items-center mb-4 mx-4">
              <Image
                source={icons.trending}
                style={{ width: 18, height: 18, marginRight: 6 }}
                resizeMode="contain"
                tintColor="white"
              />
              <Text className="text-white font-semibold text-lg">
                Trending artists
              </Text>
            </View>

            <FlatList
              className="mx-4 mb-4"
              horizontal
              showsHorizontalScrollIndicator={false}
              data={trendingArtists}
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

            {/* Browse section title */}
            <View className="mx-4 mb-3">
              <Text className="text-white font-semibold text-lg">Browse</Text>
            </View>
            {/* Browse section grid */}
            <View className="flex-row flex-wrap justify-between mx-4 pb-20">
              {genres.map((item) => (
                <View
                  key={item.id}
                  className="w-[48%] h-24 mb-4 rounded-xl overflow-hidden"
                >
                  <Image
                    source={item.image}
                    className="w-full h-full absolute"
                    resizeMode="cover"
                  />
                  <View className="flex-1 items-center justify-end bg-black/50 pb-2">
                    <Text className="text-white font-bold text-sm">
                      {item.title}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default search;
