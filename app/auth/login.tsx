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
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { icons } from "@/constants/icons";
import { useAuth } from "@/app/auth/useAuth";
import { useGoogleLogin } from "@/app/auth/useGoogleLogin";

export default function LoginScreen() {
  const router = useRouter();
  const { login, loading } = useAuth(); // 👈 lấy login và loading từ useAuth
  const { promptAsync, request } = useGoogleLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Vui lòng nhập email và mật khẩu");
      return;
    }

    const result = await login(email, password); // 👈 dùng login của useAuth

    if (result.success) {
      router.replace("/(tabs)"); // ✅ login thành công -> chuyển qua tabs
    } else {
      Alert.alert("Đăng nhập thất bại", result.message || "Sai thông tin đăng nhập");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        className="flex-1 bg-black"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* --- Fixed Header --- */}
        <View className="items-center mt-16 mb-6">
          <Image source={icons.logo} className="w-40 h-12" resizeMode="contain" />
          <Text className="text-gray-300 text-lg mt-2 tracking-wide">Just relax</Text>
        </View>

        {/* --- Scrollable Form --- */}
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 24,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Title */}
          <Text className="text-white text-2xl font-semibold text-center mb-8">
            Đăng nhập
          </Text>

          {/* Form */}
          <View className="w-full items-center">
            {/* Email */}
            <TextInput
              placeholder="Email"
              placeholderTextColor="#bbb"
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-white/5 border border-white/10 text-white rounded-xl text-base px-5 py-3.5 mb-4 w-full"
              value={email}
              onChangeText={setEmail}
            />

            {/* Password */}
            <View className="relative w-full mb-6">
              <TextInput
                placeholder="Mật khẩu"
                placeholderTextColor="#bbb"
                secureTextEntry={!showPassword}
                className="bg-white/5 border border-white/10 text-white rounded-xl text-base px-5 py-3.5 pr-12"
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                className="absolute right-4 top-3.5"
                onPress={() => setShowPassword(!showPassword)}
              >
                <Image
                  source={showPassword ? icons.view : icons.hide}
                  style={{ width: 22, height: 22, tintColor: "#bbb" }}
                />
              </TouchableOpacity>
            </View>

            {/* Đăng nhập Button */}
            <TouchableOpacity
              onPress={handleLogin}
              className="bg-indigo-500 py-4 rounded-full items-center w-full mb-4"
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-white font-semibold text-lg">Đăng nhập</Text>
              )}
            </TouchableOpacity>

            {/* Google Login */}
            <TouchableOpacity
              disabled={!request}
              onPress={() => promptAsync()}
              className="bg-white/5 border border-white/30 py-4 rounded-full flex-row items-center justify-center w-full"
            >
              <Image
                source={icons.google}
                style={{ width: 20, height: 20, marginRight: 8 }}
                resizeMode="contain"
              />
              <Text className="text-white font-medium text-base">
                Đăng nhập với Google
              </Text>
            </TouchableOpacity>

            {/* Đăng ký Link */}
            <View className="mt-10 flex-row justify-center items-center">
              <Text className="text-white text-base">Chưa có tài khoản? </Text>
              <TouchableOpacity onPress={() => router.push("/auth/signup")}>
                <Text className="text-indigo-400 text-base font-semibold">Đăng ký</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
