import { View, Text, Image } from "react-native";

interface SongCardProps {
  title: string;
  image: any;
}

const SongCard = ({ title, image }: SongCardProps) => {
  return (
    <View className="mr-4">
      <Image
        source={image}
        className="w-full aspect-square rounded-2xl"
        resizeMode="cover"
      />
      <Text className="text-white mt-2 font-medium text-xl" numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
};

export default SongCard;
