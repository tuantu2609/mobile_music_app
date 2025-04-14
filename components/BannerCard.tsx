import React from "react";
import { View, Image, Dimensions, ImageSourcePropType } from "react-native";

const screenWidth = Dimensions.get("window").width;

const BannerCard = ({ source }: { source: ImageSourcePropType }) => {
  const width = screenWidth * 0.8;
  const height = width / 2; // giả sử ảnh tỉ lệ 16:9

  return (
    <View
      style={{
        width,
        height,
        marginRight: 16,
        borderRadius: 32,
        overflow: "hidden",
      }}
    >
      <Image
        source={source}
        style={{
          width: "100%",
          height: "100%",
        }}
        resizeMode="cover"
      />
    </View>
  );
};

export default BannerCard;
