// components/MiniPlayer.tsx
import { View, Text, Image, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import { usePlayerStore } from "@/store/usePlayerStore";
import { icons } from "@/constants/icons";
import { useRouter } from "expo-router";

const MiniPlayer = () => {
  const currentSong = usePlayerStore((state) => state.currentSong);
  const router = useRouter();

  if (!currentSong) return null;

  return (
    <TouchableOpacity
      onPress={() => router.push("/song/1")}
      className="absolute left-0 right-0 bottom-20"
    >
      <BlurView
        intensity={50}
        tint="dark"
        className="flex-row items-center justify-between px-4 py-3 rounded-xl"
        style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
      >
        <View className="flex-row items-center">
          <Image
            source={{ uri: currentSong.image }}
            className="w-12 h-12 rounded-md mr-3"
            resizeMode="cover"
          />
          <View>
            <Text className="text-white font-semibold" numberOfLines={1}>
              {currentSong.title}
            </Text>
            <Text className="text-white/60 text-xs" numberOfLines={1}>
              {currentSong.subtitle}
            </Text>
          </View>
        </View>

        <TouchableOpacity>
          <Image
            source={icons.play}
            className="w-6 h-6"
            tintColor="white"
            resizeMode="contain"
          />
        </TouchableOpacity>
      </BlurView>
    </TouchableOpacity>
  );
};

export default MiniPlayer;
