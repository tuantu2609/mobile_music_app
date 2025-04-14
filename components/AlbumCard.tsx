import { View, Text, Image, Dimensions } from "react-native";
const screenWidth = Dimensions.get("window").width;

interface AlbumCardProps {
  album: Pick<Album, "name" | "images">;
  artist: Pick<Artist, "name">;
}

const AlbumCard = ({ album, artist }: AlbumCardProps) => {
  const imageUrl = album.images?.[0]?.url ?? "https://example.com/default.jpg";
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
        {album.name}
      </Text>
      <Text className="text-gray-400 text-base" numberOfLines={1}>
        {artist.name}
      </Text>
    </View>
  );
};

export default AlbumCard;
