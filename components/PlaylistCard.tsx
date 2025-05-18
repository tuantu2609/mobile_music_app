import { View, Text, Image, Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;
import { Playlist } from "../interfaces/interfaces";

interface PlaylistCardProps {
  playlist: Pick<Playlist, "name" | "images" | "creatorName">;
}

const PlaylistCard = ({ playlist }: PlaylistCardProps) => {
  const imageUrl =
    playlist.images?.[0]?.url ?? "https://example.com/default.jpg";
  const width = screenWidth * 0.35;
  return (
    <View className="mr-3" style={{ width: width }}>
      <Image
        source={{ uri: imageUrl }}
        style={{
          width: width,
          height: width,
          borderRadius: 16,
          overflow: "hidden",
        }}
        resizeMode="cover"
      />
      <Text className="text-white mt-2 font-bold text-base" numberOfLines={1}>
        {playlist.name}
      </Text>
      <Text className="text-gray-400 text-base" numberOfLines={1}>
        Created by {playlist.creatorName}
      </Text>
    </View>
  );
};

export default PlaylistCard;
