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
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { icons } from "@/constants/icons";
import { useAuth } from "@/app/auth/useAuth";

// import { useGoogleLogin } from "@/app/auth/useGoogleLogin";
// import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
// import {
//   GoogleSignin,
//   isSuccessResponse,
//   isErrorWithCode,
//   statusCodes,
// } from "@react-native-google-signin/google-signin";
// import { showMessage } from "react-native-flash-message";

import {
  sendResetOtp,
  verifyResetOtp,
  resetPassword,
} from "@/services/useAuth";

export default function LoginScreen() {
  // useGoogleLogin();
  const router = useRouter();
  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // const [isSubmitting, setIsSubmitting] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Vui lòng nhập email và mật khẩu");
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      router.replace("/(tabs)");
    } else {
      Alert.alert(
        "Đăng nhập thất bại",
        result.message || "Sai thông tin đăng nhập"
      );
    }
  };

  // const handleGoogleSignin = async () => {
  //   try {
  //     setIsSubmitting(true);
  //     await GoogleSignin.hasPlayServices();
  //     await GoogleSignin.signOut();
  //     const response = await GoogleSignin.signIn();
  //     if (isSuccessResponse(response)) {
  //       showMessage({
  //         message: "Đăng nhập Google thành công!",
  //         type: "success",
  //       });
  //       router.replace("/(tabs)");
  //     }
  //     setIsSubmitting(false);
  //   } catch (error) {
  //     if (isErrorWithCode(error)) {
  //       switch (error.code) {
  //         case statusCodes.IN_PROGRESS:
  //           showMessage({ message: "Đang đăng nhập...", type: "info" });
  //           break;
  //         case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
  //           showMessage({
  //             message: "Google Play Services không khả dụng",
  //             type: "danger",
  //           });
  //           break;
  //         default:
  //           showMessage({ message: error.code, type: "warning" });
  //       }
  //     }
  //     showMessage({ message: "Đăng nhập Google đã bị huỷ", type: "default" });
  //   }
  // };

  //   }
  // };

  const handleSendOtp = async () => {
    if (!forgotEmail) return Alert.alert("Vui lòng nhập email");
    try {
      setSubmitting(true);
      await sendResetOtp(forgotEmail);
      setStep(2);
      Alert.alert("OTP đã gửi đến email");
    } catch (err) {
      Alert.alert("Lỗi", err?.response?.data?.error || "Không gửi được OTP");
    } finally {
      setSubmitting(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return Alert.alert("Nhập OTP");
    try {
      setSubmitting(true);
      const res = await verifyResetOtp(forgotEmail, otp);
      if (res.data.success) {
        setStep(3);
      } else {
        Alert.alert("OTP không chính xác hoặc hết hạn");
      }
    } catch (err) {
      Alert.alert("Sai OTP", err?.response?.data?.message || "Có lỗi xảy ra");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!newPass || newPass !== confirmPass) {
      return Alert.alert("Mật khẩu không khớp");
    }
    try {
      setSubmitting(true);
      await resetPassword(forgotEmail, newPass, otp);
      Alert.alert("Đặt lại mật khẩu thành công");
      setForgotMode(false);
      setStep(1);
    } catch (err) {
      Alert.alert(
        "Lỗi",
        err?.response?.data?.error || "Không thể đổi mật khẩu"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderForgotForm = () => {
    const screenHeight = Dimensions.get("window").height;

    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          className="absolute inset-0 bg-black/90 px-6 z-50"
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
              justifyContent: "center", // ✅ Giữa dọc
              paddingBottom: 40,
              paddingTop: screenHeight < 700 ? 40 : 80, // ✅ Responsive cho chiều cao thấp
            }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View className="bg-[#111] p-6 pt-4 rounded-2xl border border-white/10 shadow-lg">
              {/* Back Button */}
              <TouchableOpacity
                onPress={() => {
                  setForgotMode(false);
                  setStep(1);
                }}
                className="mb-4 self-start"
              >
                <Image
                  source={icons.backBtn}
                  style={{ width: 26, height: 26, tintColor: "#fff" }}
                />
              </TouchableOpacity>

              {/* Step UI giữ nguyên */}
              {step === 1 && (
                <>
                  <Text className="text-white text-xl font-bold mb-4 text-center">
                    Quên mật khẩu
                  </Text>
                  <TextInput
                    value={forgotEmail}
                    onChangeText={setForgotEmail}
                    placeholder="Nhập email"
                    placeholderTextColor="#aaa"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="bg-black/30 text-white px-5 py-4 rounded-lg mb-4 text-base"
                  />
                  <TouchableOpacity
                    onPress={handleSendOtp}
                    className="bg-indigo-500 py-4 rounded-xl items-center"
                    disabled={submitting}
                  >
                    <Text className="text-white font-semibold text-lg">
                      Gửi OTP
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {step === 2 && (
                <>
                  <Text className="text-white text-xl font-bold mb-4 text-center">
                    Xác nhận OTP
                  </Text>
                  <TextInput
                    value={otp}
                    onChangeText={setOtp}
                    placeholder="Mã OTP"
                    placeholderTextColor="#aaa"
                    keyboardType="numeric"
                    className="bg-black/30 text-white px-5 py-4 rounded-lg mb-4 text-base"
                  />
                  <TouchableOpacity
                    onPress={handleVerifyOtp}
                    className="bg-indigo-500 py-4 rounded-xl items-center"
                    disabled={submitting}
                  >
                    <Text className="text-white font-semibold text-lg">
                      Xác nhận
                    </Text>
                  </TouchableOpacity>
                </>
              )}

              {step === 3 && (
                <>
                  <Text className="text-white text-xl font-bold mb-4 text-center">
                    Đặt lại mật khẩu
                  </Text>

                  {/* Mật khẩu mới */}
                  <View className="relative mb-4">
                    <TextInput
                      secureTextEntry={!showPassword}
                      value={newPass}
                      onChangeText={setNewPass}
                      placeholder="Mật khẩu mới"
                      placeholderTextColor="#aaa"
                      className="bg-black/30 text-white px-5 py-4 pr-12 rounded-lg text-base"
                    />
                    <TouchableOpacity
                      className="absolute right-4 top-4"
                      onPress={() => setShowPassword(!showPassword)}
                    >
                      <Image
                        source={showPassword ? icons.view : icons.hide}
                        style={{ width: 22, height: 22, tintColor: "#bbb" }}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Xác nhận mật khẩu */}
                  <View className="relative mb-4">
                    <TextInput
                      secureTextEntry={!showConfirmPassword}
                      value={confirmPass}
                      onChangeText={setConfirmPass}
                      placeholder="Xác nhận mật khẩu"
                      placeholderTextColor="#aaa"
                      className="bg-black/30 text-white px-5 py-4 pr-12 rounded-lg text-base"
                    />
                    <TouchableOpacity
                      className="absolute right-4 top-4"
                      onPress={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      <Image
                        source={showConfirmPassword ? icons.view : icons.hide}
                        style={{ width: 22, height: 22, tintColor: "#bbb" }}
                      />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    onPress={handleResetPassword}
                    className="bg-indigo-500 py-4 rounded-xl items-center"
                    disabled={submitting}
                  >
                    <Text className="text-white font-semibold text-lg">
                      Đổi mật khẩu
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        className="flex-1 bg-black"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View className="items-center mt-16 mb-6">
          <Image
            source={icons.logo}
            className="w-40 h-12"
            resizeMode="contain"
          />
          <Text className="text-gray-300 text-lg mt-2 tracking-wide">
            Just relax
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 24,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <Text className="text-white text-2xl font-semibold text-center mb-8">
            Đăng nhập
          </Text>

          <View className="w-full items-center">
            <TextInput
              placeholder="Email"
              placeholderTextColor="#bbb"
              keyboardType="email-address"
              autoCapitalize="none"
              className="bg-white/5 border border-white/10 text-white rounded-xl text-base px-5 py-3.5 mb-4 w-full"
              style={{ height: 50 }}
              value={email}
              onChangeText={setEmail}
            />

            <View className="relative w-full mb-6">
              <TextInput
                placeholder="Mật khẩu"
                placeholderTextColor="#bbb"
                secureTextEntry={!showPassword}
                className="bg-white/5 border border-white/10 text-white rounded-xl text-base px-5 py-3.5 pr-12"
                style={{ height: 50 }}
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

            <TouchableOpacity
              onPress={handleLogin}
              className="bg-indigo-500 py-4 rounded-full items-center w-full mb-4"
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-white font-semibold text-lg">
                  Đăng nhập
                </Text>
              )}
            </TouchableOpacity>

            {/* Google Login */}
            {/* <TouchableOpacity

            <TouchableOpacity

              disabled={!request}
              onPress={() => promptAsync()}
              className="bg-white/5 border border-white/30 py-4 rounded-full flex-row items-center justify-center w-full"
            >
              <Image
                source={icons.google}
                style={{ width: 20, height: 20, marginRight: 8 }}
              />
              <Text className="text-white font-medium text-base">
                Đăng nhập với Google
              </Text>
            </TouchableOpacity> */}

            {/* <View style={{ marginTop: 16 }}>
                <GoogleSigninButton
                  size={GoogleSigninButton.Size.Wide}
                  color={GoogleSigninButton.Color.Dark}
                  onPress={handleGoogleSignin}
                  disabled={isSubmitting}
                />
              </View> */}

            <View className="mt-10 flex-row justify-center items-center">
              <Text className="text-white text-base">Chưa có tài khoản? </Text>
              <TouchableOpacity onPress={() => router.push("/auth/signup")}>
                <Text className="text-indigo-400 text-base font-semibold">
                  Đăng ký
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity onPress={() => setForgotMode(true)}>
              <Text className="text-indigo-400 text-base font-semibold mt-4 text-center">
                Quên mật khẩu?
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {forgotMode && renderForgotForm()}
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}