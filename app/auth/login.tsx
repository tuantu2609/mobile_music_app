import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { icons } from "@/constants/icons";
import { loginUser } from "@/services/useAuth";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Vui lòng nhập email và mật khẩu");
      return;
    }

    try {
      const res = await loginUser({ email, password });
      const { token, user } = res.data;

      // TODO: lưu token nếu cần (AsyncStorage hoặc Context)

      router.replace("/(tabs)");
    } catch (err) {
      console.error("Login failed:", err);
      Alert.alert("Đăng nhập thất bại", err?.response?.data?.message || "Sai thông tin đăng nhập");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView className="flex-1 bg-black px-6 pt-16 pb-6 justify-between">
        {/* Logo + Header */}
        <View className="items-center mb-4">
          <Image source={icons.logo} className="w-40 h-12" resizeMode="contain" />
          <Text className="text-gray-300 text-lg mt-2 tracking-wide">Just relax</Text>
        </View>

        {/* Sub-title */}
        <Text className="text-white text-2xl font-semibold text-center mb-6">Đăng nhập</Text>

        {/* Form */}
        <View className="w-full">
          <View className="mb-4">
            <TextInput
              placeholder="Email"
              placeholderTextColor="#bbb"
              keyboardType="email-address"
              className="bg-white/5 border border-white/10 text-white rounded-xl text-base px-5 py-3.5"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View className="mb-4">
            <TextInput
              placeholder="Mật khẩu"
              placeholderTextColor="#bbb"
              secureTextEntry
              className="bg-white/5 border border-white/10 text-white rounded-xl text-base px-5 py-3.5"
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            className="bg-indigo-500 py-4 rounded-full items-center mb-4"
          >
            <Text className="text-white font-semibold text-lg">Đăng nhập</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white/5 border border-white/30 py-4 rounded-full flex-row items-center justify-center"
            onPress={() => console.log("Google login")}
          >
            <Image
              source={icons.google}
              style={{ width: 20, height: 20, marginRight: 8 }}
              resizeMode="contain"
            />
            <Text className="text-white font-medium text-base">Đăng nhập với Google</Text>
          </TouchableOpacity>
        </View>

        {/* Sign up */}
        <View className="mt-10 flex-row justify-center items-center">
          <Text className="text-white text-base">Chưa có tài khoản? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/signup")}>
            <Text className="text-indigo-400 text-base font-semibold">Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
