import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import React from "react";
import { icons } from "@/constants/icons";

const screenWidth = Dimensions.get("window").width;

type Song = {
  id: string;
  title: string;
  artists: { id: string; name: string }[];
  image: any; // URI string hoặc require()
};

interface Props {
  song: Song;
}

const SongListCard = ({ song }: Props) => {
  return (
    <View className="flex-row items-center justify-between px-4 mb-4 mt-4">
      <View className="flex-row items-center flex-1">
        <Image
          source={
            typeof song.image === "string" ? { uri: song.image } : song.image
          }
          className="w-12 h-12 rounded-md mr-3"
          resizeMode="cover"
        />
        <View style={{ flexShrink: 1 }}>
          <Text
            className="text-white font-semibold"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {song.title}
          </Text>
          {song.artists && (
            <Text
              className="text-white/60 text-xs"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {song.artists.map((artist) => artist.name).join(", ")}
            </Text>
          )}
        </View>
      </View>
      <TouchableOpacity className="opacity-50 flex items-center justify-center">
        <Image
          source={icons.more}
          className="w-6 h-6"
          resizeMode="contain"
          tintColor="white"
        />
      </TouchableOpacity>
    </View>
  );
};

export default SongListCard;
