import { View, Text, Image, Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

interface MixCardProps {
  image: any;
  artists: Pick<Artist, "name">[];
}

const MixCard = ({ image, artists }: MixCardProps) => {
  const artistNames = artists.map((a) => a.name).join(", ");
  const width = screenWidth * 0.35;
  return (
    <View className="mr-3" style={{ width: width }}>
      <Image
        source={image}
        style={{
          width: width,
          height: width,
          borderRadius: 16,
          overflow: "hidden",
        }}
        resizeMode="cover"
      />
      <Text className="text-white mt-2 font-medium text-base" numberOfLines={2}>
        {artistNames}
      </Text>
    </View>
  );
};

export default MixCard;
