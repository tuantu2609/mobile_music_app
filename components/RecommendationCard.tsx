import { View, Text, Image, TouchableOpacity, Dimensions } from "react-native";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const RecommendationCard = () => {
  return (
    <View
      style={{ width: screenWidth * 0.8, height: screenHeight * 0.6 }}
      className="mr-5 rounded-2xl overflow-hidden"
    >
      <Image
        source={images.bg2}
        className="absolute w-full h-full"
        resizeMode="cover"
      />
      <View className="relative flex-1 justify-end p-4">
        <Text className="text-white text-xl font-bold">Mood Booster</Text>
        <Text className="text-white text-base">Based on your likes</Text>
      </View>
    </View>
  );
};

export default RecommendationCard;
