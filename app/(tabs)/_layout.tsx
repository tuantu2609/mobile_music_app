import { View, Text, Image, Platform } from "react-native";
import { Tabs } from "expo-router";
import React from "react";
import { icons } from "@/constants/icons";
import { BlurView } from "expo-blur";
import MiniPlayer from "@/components/MiniPlayer";

const TabIcon = ({
  focused,
  icon,
  activeIcon,
  title,
}: {
  focused: boolean;
  icon: any;
  activeIcon?: any;
  title: string;
}) => {
  const opacityClass = focused ? "opacity-100" : "opacity-50";

  return (
    <View className="flex flex-col items-center justify-center w-full flex-1 min-w-[112px] min-h-16 mt-10 space-y-1">
      <Image
        source={focused && activeIcon ? activeIcon : icon}
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
    <View className="flex-1">
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarItemStyle: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          },
          tabBarStyle: {
            backgroundColor: "transparent",
            height: 72,
            position: "absolute",
            overflow: "hidden",
            borderTopWidth: 0.5,
            borderColor: "rgba(255,255,255,0.1)",
          },
          tabBarBackground: () =>
            Platform.OS === "ios" ? (
              <BlurView intensity={30} tint="dark" style={{ flex: 1 }} />
            ) : (
              <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.6)" }} />
            ),
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
            title: "Search",
            headerShown: false,
            tabBarIcon: ({ focused }) => (
              <TabIcon
                focused={focused}
                icon={icons.search}
                activeIcon={icons.searched}
                title="Search"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: "Library",
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
      <MiniPlayer />
    </View>
  );
};

export default _layout;
