import React from "react";
import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import SongListCard from "./SongListCard";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

interface Props {
  songs: {
    id: string;
    title: string;
    artists: { id: string; name: string }[];
    album_cover: string;
  }[];
  title: string;
}

const RecommendationCard = ({ songs, title }: Props) => {
  return (
    <View
      style={{ width: screenWidth * 0.8, overflow: "hidden" }}
      className="mr-5 rounded-2xl"
    >
      <Image
        source={images.bg2}
        className="absolute w-full h-full rounded-2xl"
        resizeMode="cover"
      />
      <View className="p-4 flex-row items-start">
        <Image
          source={
            songs[0].album_cover ? { uri: songs[0].album_cover } : images.bg2
          }
          style={{
            width: screenWidth * 0.25,
            height: screenWidth * 0.25,
            borderRadius: 16,
          }}
          resizeMode="cover"
        />
        <View className="ms-5 flex-1 justify-between">
          <Text className="text-white font-bold text-base">{title}</Text>
          <Text className="text-white/50 font-bold text-base">
            {songs.length} songs
          </Text>
          <View
            className="flex-row items-center relative"
            style={{ top: screenHeight * 0.03 }}
          >
            <TouchableOpacity className="p-1 opacity-50">
              <Image
                source={icons.heart}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
                tintColor="white"
              />
            </TouchableOpacity>
            <TouchableOpacity className="p-1 opacity-50">
              <Image
                source={icons.more}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
                tintColor="white"
              />
            </TouchableOpacity>
            <TouchableOpacity
              className="rounded-full bg-white absolute right-0"
              style={{
                top: -screenWidth * 0.0375,
                width: screenWidth * 0.1,
                height: screenWidth * 0.1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Image
                source={icons.play}
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

      <View className="mb-20 px-2">
        {songs.map((item) => (
          <SongListCard
            key={item.id}
            song={{
              id: item.id,
              title: item.title,
              artists: item.artists,
              image: { uri: item.album_cover },
            }}
          />
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
          borderRadius: 999,
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
