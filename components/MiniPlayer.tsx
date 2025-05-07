import { View, Text, Image, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import { usePlayerStore } from "@/store/usePlayerStore";
import { icons } from "@/constants/icons";
import { useRouter } from "expo-router";

const MiniPlayer = () => {
  const router = useRouter();
  const { currentSong, isPlaying, position, duration, playPause } =
    usePlayerStore();
  if (!currentSong) return null;
  return (
    <View style={{ position: "relative" }}>
      <TouchableOpacity
        onPress={() => {
          router.push(`/song/${currentSong?.id}`);
        }}
        className="absolute left-0 right-0 bottom-20"
      >
        <BlurView
          intensity={50}
          tint="dark"
          className="flex-row items-center justify-between px-4 py-3 rounded-xl"
          style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
        >
          <View className="flex-row items-center flex-1 mr-4">
            <Image
              key={currentSong?.id}
              source={{ uri: currentSong?.image }}
              className="w-12 h-12 rounded-md mr-3"
              resizeMode="cover"
            />
            <View className="flex-1">
              <Text
                className="text-white font-semibold"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {currentSong?.title}
              </Text>
            </View>
          </View>

          <TouchableOpacity onPress={playPause}>
            <Image
              source={isPlaying ? icons.pause : icons.play}
              className="w-6 h-6 mr-2"
              tintColor="white"
              resizeMode="contain"
            />
          </TouchableOpacity>
        </BlurView>

        {/* Progress bar */}
        <View className="px-4">
          {duration > 0 && (
            <View
              className="h-1 bg-white"
              style={{ width: `${(position / duration) * 100}%` }}
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default MiniPlayer;
