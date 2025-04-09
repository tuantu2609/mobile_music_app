import { View, Text, Image } from "react-native";
import React from "react";
import { images } from "@/constants/images";
const library = () => {
  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
    </View>
  );
};

export default library;
