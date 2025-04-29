import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "@/app/auth/useAuth";
import { updateProfile } from "@/services/useAuth";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";

import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.API_URL;

export default function EditProfileForm({
  onClose,
  onSaveSuccess,
}: {
  onClose: () => void;
  onSaveSuccess?: () => void;
}) {
  const { user, token, refreshUser } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatarUri, setAvatarUri] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) setAvatarUri(result.assets[0].uri);
  };

  const handleSave = async () => {
    if (password && password !== confirmPassword) {
      Alert.alert("❌", "Mật khẩu xác nhận không khớp");
      return;
    }

    if (password && !currentPassword) {
      Alert.alert("❌", "Vui lòng nhập mật khẩu hiện tại để đổi mật khẩu");
      return;
    }

    if (!name && !phone && !avatarUri && !password) {
      Alert.alert("⚠️", "Không có thông tin nào thay đổi");
      return;
    }

    try {
      setLoading(true);
      await updateProfile(token, {
        name: name || undefined,
        phone: phone || undefined,
        avatarUri,
        currentPassword: password ? currentPassword : undefined,
        newPassword: password || undefined,
      });
      await refreshUser();
      if (onSaveSuccess) await onSaveSuccess();
      Alert.alert("✅", "Cập nhật thành công");
      onClose();
    } catch (err) {
      console.log("Error updating profile:", err.response?.data || err.message);
      Alert.alert("❌", "Cập nhật thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#000" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
        style={{ flex: 1 }}
      >
        <View
          className="flex-1"
          style={{ backgroundColor: "rgba(0,0,0,0.98)" }}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}
            className="px-6 pt-12"
          >
            {/* Close */}
            <View className="items-end mb-6">
              <TouchableOpacity
                onPress={onClose}
                className="flex-row items-center space-x-2 bg-white/15 border border-white/20 px-3 py-2 rounded-full"
              >
                <Image
                  source={icons.close}
                  className="w-4 h-4"
                  tintColor="#fff"
                />
              </TouchableOpacity>
            </View>

            {/* Avatar */}
            <View className="items-center mb-6">
              <Image
                source={
                  avatarUri
                    ? { uri: avatarUri }
                    : user?.avatar && typeof user.avatar === "string"
                    ? user.avatar.startsWith("http")
                      ? { uri: user.avatar }
                      : { uri: `${API_URL}${user.avatar}` }
                    : images.avatar
                }
                className="w-24 h-24 rounded-full"
              />
              <TouchableOpacity onPress={pickAvatar}>
                <Text className="text-white text-sm mt-2 underline">
                  Đổi ảnh đại diện
                </Text>
              </TouchableOpacity>
            </View>

            {/* Fields */}
            <TextField
              label="Tên hiển thị"
              value={name}
              onChange={setName}
              placeholder={user?.name || "Nhập tên"}
            />
            <TextField
              label="Số điện thoại"
              value={phone}
              onChange={setPhone}
              keyboardType="phone-pad"
              placeholder={user?.phone || "Nhập số điện thoại"}
            />

            <View className="mb-4">
              <Text className="text-white mb-1">Email</Text>
              <Text className="text-gray-300">{user?.email}</Text>
            </View>

            <TextField
              label="Mật khẩu mới"
              value={password}
              onChange={setPassword}
              secure
              placeholder="Mật khẩu mới"
            />
            <TextField
              label="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={setConfirmPassword}
              secure
              placeholder="Xác nhận mật khẩu"
            />
            {password ? (
              <TextField
                key={password ? "show" : "hide"} // Force re-render
                label="Mật khẩu hiện tại"
                value={currentPassword}
                onChange={setCurrentPassword}
                secure
                placeholder="Nhập mật khẩu hiện tại"
              />
            ) : null}

            <TouchableOpacity
              onPress={handleSave}
              disabled={loading}
              className="bg-green-600 py-4 rounded-full items-center mt-6"
            >
              <Text className="text-white text-base font-semibold">
                {loading ? "Đang lưu..." : "Lưu thay đổi"}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const TextField = ({
  label,
  value,
  onChange,
  keyboardType = "default",
  secure = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
  keyboardType?: "default" | "email-address" | "phone-pad";
  secure?: boolean;
  placeholder?: string;
}) => (
  <>
    <Text className="text-white mb-2">{label}</Text>
    <TextInput
      className="bg-white/10 text-white px-4 py-3 rounded-md mb-4"
      value={value}
      onChangeText={onChange}
      keyboardType={keyboardType}
      placeholder={placeholder}
      placeholderTextColor="#aaa"
      secureTextEntry={secure}
      secureTextEntry
      textContentType="newPassword" // hoặc "oneTimeCode", "none", tùy ngữ cảnh
      autoComplete="off"
    />
  </>
);