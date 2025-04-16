import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import React from "react";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import SongListCard from "@/components/SongListCard";
import SongCard from "@/components/SongCard";

const screenWidth = Dimensions.get("window").width;

const upNextTrack = {
  id: "1",
  title: "Young",
  subtitle: "The Chainsmokers",
  image: "https://i.imgur.com/3HtV6oY.png",
};

const SongDetails = () => {
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 bg-black">
      <View className="flex-row justify-between items-center mb-6">
        <TouchableOpacity
          onPress={() => router.back()}
          className="top-4 left-4 z-50 bg-black/60 p-3 rounded-full"
        >
          <Image
            source={icons.back}
            className="w-5 h-5"
            tintColor="white"
            resizeMode="contain"
          />
        </TouchableOpacity>
        <TouchableOpacity className="top-4 right-4 z-50 bg-black/60 p-3 rounded-full">
          <Image
            source={icons.more}
            className="w-5 h-5"
            tintColor="white"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <ScrollView className="px-6 pt-6">
        {/* Album cover */}
        <View className="items-center mb-4">
          <Image
            source={{
              uri: "https://photo-resize-zmp3.zadn.vn/w600_r1x1_jpeg/cover/1/d/6/a/1d6a1fa9aaf8b3be17dd64f396fe7ed6.jpg",
            }}
            className="w-72 h-72 rounded-2xl"
            resizeMode="cover"
          />
        </View>

        {/* Lyric preview */}
        {/* <Text className="text-white text-sm text-center mb-2 px-4">
          Let me see the dark sides as well as the bright
        </Text> */}

        {/* Connect to device */}
        <TouchableOpacity className="self-end bg-white/10 px-4 py-2 rounded-full mb-6">
          <Text className="text-white text-xs">Connect to a device</Text>
        </TouchableOpacity>

        {/* Song info */}
        <View className="mb-6">
          <Text className="text-white text-xl font-bold">Inside Out</Text>
          <Text className="text-white/70 text-sm mt-1">
            The Chainsmokers, Charlee
          </Text>
        </View>

        {/* Player controls */}
        <View className="mb-4">
          <View className="flex-row justify-between">
            <Text className="text-white text-xs">0:25</Text>
            <Text className="text-white text-xs">3:15</Text>
          </View>
          <View className="w-full h-1 bg-white/20 rounded-full mt-2">
            <View className="w-[20%] h-full bg-white rounded-full" />
          </View>
        </View>

        {/* Buttons */}
        <View className="flex-row items-center justify-between px-4 mt-4 mb-6">
          <TouchableOpacity>
            <Image
              source={icons.shuffle}
              className="w-5 h-5"
              tintColor="white"
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={icons.prev} className="w-6 h-6" tintColor="white" />
          </TouchableOpacity>
          <TouchableOpacity className="bg-white rounded-full p-4">
            <Image source={icons.play} className="w-6 h-6" tintColor="black" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={icons.next} className="w-6 h-6" tintColor="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={icons.repeat}
              className="w-5 h-5"
              tintColor="white"
            />
          </TouchableOpacity>
        </View>

        {/* Up Next */}

        {/* Song card */}
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-white font-semibold text-base">Up Next</Text>
          <Text className="text-white/50 text-sm">
            Queue
            <Image
              source={icons.go}
              className="w-6 h-6 mr-2"
              resizeMode="contain"
            />
          </Text>
        </View>

        <View className="bg-white/5 rounded-xl">
          <SongListCard song={upNextTrack} />
        </View>

        <View className="mt-10">
          <Text className="text-white text-3xl font-bold mb-2">
            Song similar to this
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            <SongCard title="Tên bài hát 1" image={images.song2} />
            <SongCard title="Tên bài hát 2" image={images.song} />
            <SongCard title="Tên bài hát 1" image={images.song2} />
            <SongCard title="Tên bài hát 2" image={images.song} />
            <SongCard title="Tên bài hát 1" image={images.song2} />
            <SongCard title="Tên bài hát 2" image={images.song} />
            <SongCard title="Tên bài hát 1" image={images.song2} />
            <SongCard title="Tên bài hát 2" image={images.song} />
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SongDetails;
