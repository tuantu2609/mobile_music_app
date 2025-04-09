import { View, Text, Image, FlatList, ActivityIndicator } from "react-native";
import React, { useEffect } from "react";
import { images } from "@/constants/images";

const search = () => {
  return (
    <View className="flex-1 bg-primary">
      <Image source={images.bg} className="absolute w-full z-0" />
    </View>
  );
};

export default search;
