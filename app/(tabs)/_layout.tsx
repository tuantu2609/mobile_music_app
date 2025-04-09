import { View, Text, ImageBackground, Image } from "react-native";
import { Tabs } from "expo-router";
import React from "react";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";

// const TabIcon = ({ focused, icon, title }: any) => {
//   if (focused) {
//     return (
//       <ImageBackground
//         source={images.highlight}
//         className="flex flex-col w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden"
//       >
//         <Image source={icon} tintColor="#151312" className="size-5" />
//         <Text className="text-secondary text-base font-semibold ml-2">
//           {title}
//         </Text>
//       </ImageBackground>
//     );
//   }
//   return (
//     <View className="size-full justify-center items-center mt-4 rounded-full">
//       <Image source={icon} tintColor="#A8B5DB" className="size-5" />
//     </View>
//   );
// };

const TabIcon = ({ focused, icon, title }: any) => {
  const opacityClass = focused ? "opacity-75" : "opacity-50";

  return (
    <View className="flex flex-col items-center justify-center w-full flex-1 min-w-[112px] min-h-16 mt-10 space-y-1">
      <Image
        source={icon}
        tintColor="#FFFFFF"
        className={`w-6 h-6 ${opacityClass}`}
      />
      <Text
        className={`text-base font-semibold text-white text-center ${opacityClass}`}
      >
        {title}
      </Text>
    </View>
  );
};

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          // width: "100%",
          // height: "100%",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: "rgba(0, 0, 0, 0.3)",
          height: 72,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "rgba(255,255,255,0.1)",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.home} title="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: "search",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} icon={icons.search} title="Search" />
          ),
        }}
      />

      <Tabs.Screen
        name="library"
        options={{
          title: "library",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              icon={icons.library}
              title="My Library"
            />
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
