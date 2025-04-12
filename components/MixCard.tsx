import { View, Text, Image } from "react-native";

interface MixCardProps {
  image: any;
  artists: Pick<Artist, "name">[];
}

const MixCard = ({ image, artists }: MixCardProps) => {
  const artistNames = artists.map((a) => a.name).join(", ");

  return (
    <View className="mr-4 w-[250px]">
      <Image
        source={image}
        className="w-full aspect-square rounded-2xl"
        resizeMode="cover"
      />
      <Text className="text-white mt-2 font-medium text-xl" numberOfLines={2}>
        {artistNames}
      </Text>
    </View>
  );
};

export default MixCard;
