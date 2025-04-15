import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { icons } from "@/constants/icons";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email && password) {
      router.replace("/(tabs)");
    }
  };

  return (
    <KeyboardAvoidingView className="flex-1 bg-black px-6 pt-20 pb-10 justify-between">
      {/* Logo */}
      <View className="items-center mb-12">
        <Image
          source={icons.logo}
          className="w-40 h-12"
          resizeMode="contain"
        />
        <Text className="text-gray-400 text-base mt-3 tracking-wide">
          Just relax
        </Text>
      </View>

      {/* Form */}
      <View>
        <View className="mb-5">
          <TextInput
            placeholder="Email"
            placeholderTextColor="#999"
            className="bg-white/10 p-4 rounded-xl text-white text-base"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        <View className="mb-5">
          <TextInput
            placeholder="Mật khẩu"
            placeholderTextColor="#999"
            className="bg-white/10 p-4 rounded-xl text-white text-base"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          className="bg-gray-300 py-4 rounded-full items-center mb-5"
        >
          <Text className="text-black font-semibold text-base">Log in</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="border border-gray-300 py-4 rounded-full flex-row items-center justify-center"
          onPress={() => console.log("Google login")}
        >
          <Image
            source={icons.google}
            style={{ width: 20, height: 20, marginRight: 8 }}
            resizeMode="contain"
          />
          <Text className="text-white font-medium text-base">Continue with Google</Text>
        </TouchableOpacity>
      </View>

      {/* Sign up */}
      <View className="mt-8 flex-row justify-center items-center">
        <Text className="text-white text-base">Chưa có tài khoản? </Text>
        <TouchableOpacity onPress={() => router.push("/auth/signup")}>
          <Text className="text-indigo-400 text-base font-semibold">Đăng ký</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
