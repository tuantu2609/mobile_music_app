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
import { updateProfile, sendOtpToEmail, verifyOtp, sendResetOtp, verifyResetOtp } from "@/services/useAuth";
import { images } from "@/constants/images";
import { icons } from "@/constants/icons";

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
  const [newEmail, setNewEmail] = useState("");
  const [editingEmail, setEditingEmail] = useState(false);
  const [emailOtp, setEmailOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [awaitingEmailChangeConfirm, setAwaitingEmailChangeConfirm] =
    useState(false);

  const pickAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) setAvatarUri(result.assets[0].uri);
  };

  const handleSendEmailOtp = async () => {
    try {
      await sendResetOtp(newEmail);
      Alert.alert("✅", "Đã gửi mã OTP");
      setOtpSent(true); // 👉 Chỉ khi gửi thành công mới cho hiện nhập OTP
    } catch {
      Alert.alert("❌", "Email đã tồn tại hoặc lỗi gửi OTP");
    }
  };

  const handleVerifyEmailOtp = async () => {
    try {
      await verifyResetOtp(newEmail, emailOtp);
      setEmailVerified(true);
      setEditingEmail(false);
      Alert.alert(
        "✅",
        "Xác minh OTP thành công, vui lòng xác nhận thay đổi email."
      );
    } catch {
      Alert.alert("❌", "OTP không đúng hoặc đã hết hạn");
    }
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

    if (!name && !phone && !avatarUri && !password && !emailVerified) {
      Alert.alert("⚠️", "Không có thông tin nào thay đổi");
      return;
    }

    try {
      setLoading(true);
      await updateProfile(token, {
        name: name || undefined,
        phone: phone || undefined,
        avatarUri,
        email: emailVerified ? newEmail : undefined,
        currentPassword: password ? currentPassword : undefined,
        newPassword: password || undefined,
      });
      await refreshUser();
      if (onSaveSuccess) await onSaveSuccess();
      Alert.alert("✅", "Cập nhật thành công");
      onClose();
    } catch (err) {
      console.log ("Error updating profile:", err.response?.data || err.message);
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
                      : { uri: `http://192.168.1.4:3001${user.avatar}` }
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
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-white">Email</Text>
                {!editingEmail && (
                  <TouchableOpacity
                    onPress={() => setEditingEmail(true)}
                    className="bg-white/15 border border-white/20 px-3 py-1 rounded-full"
                  >
                    <Text className="text-white text-xs font-medium">
                      Thay đổi
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <Text className="text-gray-300">{user?.email}</Text>

              {emailVerified && (
                <View className="bg-white/5 p-4 rounded-md mt-2 border border-white/10">
                  <Text className="text-white text-sm font-medium mb-1">
                    Email mới đã xác thực:
                  </Text>
                  <Text className="text-green-400 text-sm">{newEmail}</Text>
                  <Text className="text-gray-400 text-xs mt-1">
                    Email sẽ được cập nhật khi bạn bấm "Lưu thay đổi"
                  </Text>
                </View>
              )}

              {editingEmail && (
                <View className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
                  {!otpSent ? (
                    <>
                      <Text className="text-white mb-1">Email mới</Text>
                      <TextInput
                        value={newEmail}
                        onChangeText={setNewEmail}
                        placeholder="Nhập email mới"
                        placeholderTextColor="#aaa"
                        keyboardType="email-address"
                        className="bg-white/10 text-white px-4 py-3 rounded-md mb-3"
                      />
                      <View className="flex-row justify-between">
                        <TouchableOpacity
                          onPress={() => setEditingEmail(false)}
                        >
                          <Text className="text-gray-400 text-sm underline">
                            Hủy
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleSendEmailOtp}>
                          <Text className="text-indigo-400 text-sm underline">
                            Gửi OTP
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  ) : (
                    <>
                      <Text className="text-white mb-1">Mã OTP</Text>
                      <TextInput
                        value={emailOtp}
                        onChangeText={setEmailOtp}
                        placeholder="Nhập mã OTP"
                        placeholderTextColor="#aaa"
                        keyboardType="numeric"
                        className="bg-white/10 text-white px-4 py-3 rounded-md mb-3"
                      />
                      <View className="flex-row justify-between">
                        <TouchableOpacity
                          onPress={() => {
                            setEditingEmail(false);
                            setOtpSent(false);
                            setNewEmail("");
                            setEmailOtp("");
                          }}
                        >
                          <Text className="text-gray-400 text-sm underline">
                            Hủy
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleVerifyEmailOtp}>
                          <Text className="text-green-400 text-sm underline">
                            Xác nhận OTP
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </>
                  )}
                </View>
              )}
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
