import { View, Text } from "react-native";
import React from "react";
import { useLocalSearchParams } from "expo-router";

const ArtistDetails = () => {
  const { id } = useLocalSearchParams();
  return (
    <View>
      <Text className="text-white text-xl font-bold">Artist: {id}</Text>
    </View>
  );
};

export default ArtistDetails;
