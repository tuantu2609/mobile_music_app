import { View, Text, Image } from "react-native";

interface PlaylistCardProps {
  playlist: Pick<Playlist, "name" | "images" | "creatorName">;
}

const PlaylistCard = ({ playlist }: PlaylistCardProps) => {
  const imageUrl =
    playlist.images?.[0]?.url ?? "https://example.com/default.jpg";

  return (
    <View className="mr-5 w-[200px]">
      <Image
        source={{ uri: imageUrl }}
        className="w-[200px] h-[200px] rounded-2xl"
        resizeMode="cover"
      />
      <Text className="text-white mt-2 font-bold text-xl" numberOfLines={1}>
        {playlist.name}
      </Text>
      <Text className="text-gray-400 text-base" numberOfLines={1}>
        Created by {playlist.creatorName}
      </Text>
    </View>
  );
};

export default PlaylistCard;
