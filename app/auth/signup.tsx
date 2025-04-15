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

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");

  const handleSignup = () => {
    if (name && email && password && phone) {
      router.replace("/auth/login");
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
            placeholder="Tên"
            placeholderTextColor="#999"
            className="bg-white/10 p-4 rounded-xl text-white text-base"
            value={name}
            onChangeText={setName}
          />
        </View>

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

        <View className="mb-5">
          <TextInput
            placeholder="Số điện thoại"
            placeholderTextColor="#999"
            className="bg-white/10 p-4 rounded-xl text-white text-base"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <TouchableOpacity
          onPress={handleSignup}
          className="bg-gray-300 py-4 rounded-full items-center mb-2"
        >
          <Text className="text-black font-semibold text-base">
            Tạo tài khoản
          </Text>
        </TouchableOpacity>
      </View>

      {/* Login link */}
      <View className="mt-8 flex-row justify-center items-center">
        <Text className="text-white text-base">Đã có tài khoản? </Text>
        <TouchableOpacity onPress={() => router.push("/auth/login")}>
          <Text className="text-indigo-400 text-base font-semibold">
            Đăng nhập
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
