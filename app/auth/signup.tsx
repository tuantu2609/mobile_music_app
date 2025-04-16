import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { icons } from "@/constants/icons";
import { registerUser, sendOtpToEmail, verifyOtp } from "@/services/useAuth";

export default function SignupScreen() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"form" | "otp">("form");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = (phone: string) => /^0\d{9}$/.test(phone);
  const validatePassword = (password: string) =>
    /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{8,}$/.test(password) &&
    !password.includes(" ");

  const handleSubmitForm = async () => {
    if (!name.trim()) return Alert.alert("Vui lòng nhập tên đầy đủ");
    if (!validateEmail(email)) return Alert.alert("Email không hợp lệ");
    if (!validatePhone(phone))
      return Alert.alert("SĐT phải 10 số và bắt đầu bằng 0");
    if (!validatePassword(password))
      return Alert.alert(
        "Mật khẩu phải ≥8 ký tự, gồm chữ + số, không khoảng trắng"
      );
    if (password !== confirmPassword) return Alert.alert("Mật khẩu không khớp");

    try {
      await sendOtpToEmail(email);
      setStep("otp");
      Alert.alert("OTP đã được gửi đến email của bạn");
    } catch (err) {
      const msg = err?.response?.data?.error || "Gửi OTP thất bại";
      Alert.alert("Lỗi", msg);
    }
  };

  const handleSubmitOtp = async () => {
    if (!otp) return Alert.alert("Vui lòng nhập OTP");

    try {
      const verified = await verifyOtp(email, otp);
      if (!verified.data.success) return Alert.alert("OTP sai hoặc đã hết hạn");

      await registerUser({ name, email, password, phone });
      Alert.alert("Đăng ký thành công!");
      router.replace("/auth/login");
    } catch (err) {
      Alert.alert(
        "Đăng ký thất bại",
        err?.response?.data?.error || "Lỗi không xác định"
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView className="flex-1 bg-black px-6 pt-20 pb-10 justify-between">
        {/* Logo + Header */}
        <View className="items-center mb-4">
          <Image
            source={icons.logo}
            className="w-40 h-12"
            resizeMode="contain"
          />
          <Text className="text-gray-300 text-xl mt-3 font-medium tracking-wide">
            Just relax
          </Text>
        </View>

        {/* Sub-title */}
        <Text className="text-white text-2xl font-semibold mb-6 text-center">
          Tạo tài khoản mới
        </Text>

        {/* Form hoặc OTP */}
        {step === "form" ? (
          <View className="w-full items-center">
            <TextInput
              placeholder="Tên đầy đủ"
              placeholderTextColor="#bbb"
              className="bg-white/5 border border-white/10 text-white rounded-xl text-base px-5 py-3.5 mb-4 w-full"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#bbb"
              keyboardType="email-address"
              className="bg-white/5 border border-white/10 text-white rounded-xl text-base px-5 py-3.5 mb-4 w-full"
              value={email}
              onChangeText={setEmail}
            />

            {/* Password */}
            <View className="relative w-full mb-4">
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

            {/* Confirm Password */}
            <View className="relative w-full mb-4">
              <TextInput
                placeholder="Nhập lại mật khẩu"
                placeholderTextColor="#bbb"
                secureTextEntry={!showConfirmPassword}
                className="bg-white/5 border border-white/10 text-white rounded-xl text-base px-5 py-3.5 pr-12"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
              <TouchableOpacity
                className="absolute right-4 top-3.5"
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Image
                  source={showConfirmPassword ? icons.view : icons.hide}
                  style={{ width: 22, height: 22, tintColor: "#bbb" }}
                />
              </TouchableOpacity>
            </View>

            <TextInput
              placeholder="Số điện thoại"
              placeholderTextColor="#bbb"
              keyboardType="phone-pad"
              className="bg-white/5 border border-white/10 text-white rounded-xl text-base px-5 py-3.5 w-full mb-4"
              value={phone}
              onChangeText={setPhone}
            />

            <TouchableOpacity
              onPress={handleSubmitForm}
              className="bg-indigo-500 py-4 rounded-full items-center w-full mt-4"
            >
              <Text className="text-white font-semibold text-lg">
                Gửi mã xác thực
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="w-full items-center">
            <Text className="text-white text-base mb-4 text-center">
              Nhập mã OTP đã gửi đến email{" "}
              <Text className="font-semibold text-indigo-400">{email}</Text>
            </Text>

            <TextInput
              placeholder="Mã OTP"
              placeholderTextColor="#bbb"
              keyboardType="number-pad"
              className="bg-white/5 border border-white/10 text-white rounded-xl text-base px-5 py-3.5 w-full mb-4"
              value={otp}
              onChangeText={setOtp}
            />

            <TouchableOpacity
              onPress={handleSubmitOtp}
              className="bg-green-500 py-4 rounded-full items-center w-full mt-2"
            >
              <Text className="text-white font-semibold text-lg">
                Xác nhận & Tạo tài khoản
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Đăng nhập */}
        <View className="mt-12 flex-row justify-center">
          <Text className="text-white text-base">Đã có tài khoản? </Text>
          <TouchableOpacity onPress={() => router.push("/auth/login")}>
            <Text className="text-indigo-400 text-base font-semibold">
              Đăng nhập
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
