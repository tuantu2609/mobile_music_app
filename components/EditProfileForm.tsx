import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    Alert,
  } from "react-native";
  import React, { useState } from "react";
  import * as ImagePicker from "expo-image-picker";
  import { useAuth } from "@/app/auth/useAuth";
  import { updateProfile } from "@/services/useAuth";
  import { images } from "@/constants/images";
  
  interface Props {
    onClose: () => void;
  }
  
  export default function EditProfileForm({ onClose }: Props) {
    const { user, token, refreshUser } = useAuth();
  
    const [name, setName] = useState(user?.name || "");
    const [phone, setPhone] = useState(user?.phone || "");
    const [avatarUri, setAvatarUri] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
  
    const pickAvatar = async () => {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });
  
      if (!result.canceled) {
        setAvatarUri(result.assets[0].uri);
      }
    };
  
    const handleSave = async () => {
      try {
        setLoading(true);
        await updateProfile(token, { name, phone, avatarUri });
        await refreshUser();
        Alert.alert("✅", "Cập nhật thành công");
        onClose();
      } catch (error) {
        console.error("❌ Cập nhật lỗi:", error);
        Alert.alert("❌ Lỗi", "Không thể cập nhật");
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <View className="flex-1 bg-black px-6 py-10">
        <TouchableOpacity onPress={onClose} className="mb-6 self-end">
          <Text className="text-white text-sm underline">Đóng</Text>
        </TouchableOpacity>
  
        <TouchableOpacity onPress={pickAvatar} className="items-center mb-6">
          <Image
            source={
              avatarUri
                ? { uri: avatarUri }
                : user?.avatar
                ? { uri: `http://192.168.1.4:3001${user.avatar}` }
                : images.avatar
            }
            className="w-24 h-24 rounded-full"
          />
          <Text className="text-white text-sm mt-2 underline">Đổi ảnh đại diện</Text>
        </TouchableOpacity>
  
        <Text className="text-white mb-2">Tên hiển thị</Text>
        <TextInput
          className="bg-white/10 text-white px-4 py-3 rounded-md mb-4"
          value={name}
          onChangeText={setName}
          placeholder="Nhập tên"
          placeholderTextColor="#999"
        />
  
        <Text className="text-white mb-2">Số điện thoại</Text>
        <TextInput
          className="bg-white/10 text-white px-4 py-3 rounded-md mb-4"
          value={phone}
          onChangeText={setPhone}
          placeholder="Nhập số điện thoại"
          keyboardType="phone-pad"
          placeholderTextColor="#999"
        />
  
        <TouchableOpacity
          onPress={handleSave}
          disabled={loading}
          className="bg-green-600 py-4 rounded-full items-center mt-6"
        >
          <Text className="text-white text-base font-semibold">
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
  