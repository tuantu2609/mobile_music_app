import { View, Text, Image, TouchableOpacity } from "react-native";
import { icons } from "@/constants/icons";

interface SongCardProps {
  title: string;
  image: any;
}

const SongCard = ({ title, image }: SongCardProps) => {
  return (
    <View className="mr-5">
      <View className="relative">
        <Image
          source={image}
          className="w-[140px] h-[140px] rounded-2xl"
          resizeMode="cover"
        />

        {/* Nút play */}
        <TouchableOpacity className="absolute bottom-3 right-3 rounded-full size-12 bg-white flex items-center justify-center">
          <Image
            source={icons.play}
            className="w-5 h-5 ml-[1px]"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>

      <Text className="text-white mt-2 font-medium text-xl" numberOfLines={1}>
        {title}
      </Text>
    </View>
  );
};

export default SongCard;
