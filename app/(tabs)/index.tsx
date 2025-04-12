import { Link } from "expo-router";
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import SongCard from "@/components/SongCard";
import MixCard from "@/components/MixCard";

export default function Index() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("For you");

  const tabs = ["For you", "Relax", "Workout", "Travel"];

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="absolute w-full h-full z-0"
        resizeMode="cover"
        tintColor={"#000000"}
      />

      {/* ScrollView chính chứa toàn bộ nội dung */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {/* Phần header */}
        <View className="pt-10 pb-5 px-5">
          <View className="flex-row justify-between items-center">
            <View>
              <View className="flex-row items-center">
                <Image
                  source={icons.hello}
                  className="w-6 h-6 mr-2"
                  resizeMode="contain"
                />
                <Text className="text-white text-2xl font-bold">Hi Tu,</Text>
              </View>

              <Text className="text-white text-3xl">Good Evening</Text>
            </View>

            <View className="flex-row items-center">
              <TouchableOpacity className="mr-5">
                <Image
                  source={icons.bell}
                  className="w-[32px] h-[32px]"
                  resizeMode="contain"
                  tintColor="#FFFFFF"
                  style={{ opacity: 0.25 }}
                />
              </TouchableOpacity>

              <TouchableOpacity>
                <Image
                  source={images.avatar}
                  className="w-[48px] h-[48px] rounded-full"
                  resizeMode="cover"
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Tab section */}
        <View className="px-5">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="h-13 mb-6"
            contentContainerStyle={{ height: 40 }}
          >
            <View className="flex-row space-x-3 h-full">
              {tabs.map((tab) => (
                <TouchableOpacity
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-full min-w-[190px] ${
                    activeTab === tab ? "bg-white/25" : "bg-transparent"
                  } flex items-center justify-center`}
                >
                  <Text
                    className={`text-xl ${
                      activeTab === tab
                        ? "text-white font-semibold"
                        : "text-gray-400"
                    }`}
                  >
                    {tab}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Banner section */}
        <View className="px-5">
          <Text className="text-white text-3xl font-bold mb-5">
            Featuring Today
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {/* Mỗi banner nằm trong View riêng với width cố định */}
            <View
              className="mr-4"
              style={{ width: Dimensions.get("window").width * 0.8 }}
            >
              <Image
                source={images.banner1}
                className="w-full h-64 rounded-3xl"
                resizeMode="cover"
              />
            </View>

            <View
              className="mr-4"
              style={{ width: Dimensions.get("window").width * 0.8 }}
            >
              <Image
                source={images.banner2}
                className="w-full h-64 rounded-3xl"
                resizeMode="cover"
              />
            </View>

            <View
              className="mr-4"
              style={{ width: Dimensions.get("window").width * 0.8 }}
            >
              <Image
                source={images.banner3}
                className="w-full h-64 rounded-3xl"
                resizeMode="cover"
              />
            </View>

            <View
              className="mr-4"
              style={{ width: Dimensions.get("window").width * 0.8 }}
            >
              <Image
                source={images.banner4}
                className="w-full h-64 rounded-3xl"
                resizeMode="cover"
              />
            </View>

            <View
              className="mr-4"
              style={{ width: Dimensions.get("window").width * 0.8 }}
            >
              <Image
                source={images.banner5}
                className="w-full h-64 rounded-3xl"
                resizeMode="cover"
              />
            </View>
          </ScrollView>
        </View>

        {/* Recently played section */}
        <View className="px-5">
          <View className="flex-row justify-between items-center mb-5">
            <Text className="text-white text-3xl font-bold">
              Recently Played
            </Text>
            <Text
              className="text-gray-400 text-base text-xl"
              onPress={() => {
                console.log("See more pressed");
              }}
            >
              See more
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            <SongCard title="Tên bài hát 1" image={images.song} />
            <SongCard title="Tên bài hát 2" image={images.song} />
            <SongCard title="Tên bài hát 1" image={images.song} />
            <SongCard title="Tên bài hát 2" image={images.song} />
            <SongCard title="Tên bài hát 1" image={images.song} />
            <SongCard title="Tên bài hát 2" image={images.song} />
            <SongCard title="Tên bài hát 1" image={images.song} />
            <SongCard title="Tên bài hát 2" image={images.song} />
          </ScrollView>
        </View>

        {/* Mix section */}
        <View className="px-5 mt-5">
          <Text className="text-white text-3xl font-bold mb-5">
            Mix for you
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            <MixCard
              artists={[
                { name: "Artist 1" },
                { name: "Artist 2" },
                { name: "Artist 3" },
                { name: "Artist 4" },
                { name: "Artist 5" },
                { name: "Artist 6" },
              ]}
              image={images.mix}
            />
            <MixCard
              artists={[
                { name: "Artist 1" },
                { name: "Artist 2" },
                { name: "Artist 3" },
                { name: "Artist 4" },
                { name: "Artist 5" },
                { name: "Artist 6" },
              ]}
              image={images.mix}
            />
            <MixCard
              artists={[
                { name: "Artist 1" },
                { name: "Artist 2" },
                { name: "Artist 3" },
                { name: "Artist 4" },
                { name: "Artist 5" },
                { name: "Artist 6" },
              ]}
              image={images.mix}
            />
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}
