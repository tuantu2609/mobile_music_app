import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email && password) {
      // Sau khi login → chuyển vào tab chính
      router.replace("/(tabs)");

    }
  };

  return (
    <KeyboardAvoidingView className="flex-1 justify-center bg-black px-6">
      <Text className="text-white text-3xl font-bold mb-6">Đăng nhập</Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor="#ccc"
        className="bg-white/10 p-4 rounded-xl text-white mb-4"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Mật khẩu"
        placeholderTextColor="#ccc"
        secureTextEntry
        className="bg-white/10 p-4 rounded-xl text-white mb-4"
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        onPress={handleLogin}
        className="bg-indigo-600 p-4 rounded-xl"
      >
        <Text className="text-white text-center font-semibold">Đăng nhập</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.push("auth/signup")}
        className="mt-4"
      >
        <Text className="text-indigo-400 text-center">
          Chưa có tài khoản? Đăng ký
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
