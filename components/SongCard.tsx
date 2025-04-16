import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { icons } from "@/constants/icons";

const screenWidth = Dimensions.get("window").width;

interface SongCardProps {
  title: string;
  image: any;
  onPress?: () => void;
}

const SongCard = ({ title, image, onPress }: SongCardProps) => {
  const width = screenWidth * 0.25;
  return (
    <TouchableOpacity
      className="mr-3"
      style={{ width: width }}
      onPress={onPress}
    >
      <View className="relative">
        <Image
          source={image}
          resizeMode="cover"
          style={{
            width: width,
            height: width,
            borderRadius: 16,
            overflow: "hidden",
          }}
        />

        {/* Nút play */}
        <TouchableOpacity
          className="absolute bottom-2 right-2 rounded-full bg-white flex items-center justify-center"
          style={{
            width: width / 3,
            height: width / 3,
            borderRadius: width / 3 / 2,
          }}
        >
          <Image
            source={icons.play}
            style={{
              width: width / 4 / 2,
              height: width / 4 / 2,
              marginLeft: 1,
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <Text className="text-white mt-2 font-medium text-base" numberOfLines={1}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default SongCard;
