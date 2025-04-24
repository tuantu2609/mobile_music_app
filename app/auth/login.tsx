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

// import { useGoogleLogin } from "@/app/auth/useGoogleLogin";
// import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
// import {
//   GoogleSignin,
//   isSuccessResponse,
//   isErrorWithCode,
//   statusCodes,
// } from "@react-native-google-signin/google-signin";
// import { showMessage } from "react-native-flash-message";

export default function LoginScreen() {
  // useGoogleLogin();
  const router = useRouter();
  const { login, loading } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  // const [isSubmitting, setIsSubmitting] = useState(false);

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

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView
        className="flex-1 bg-black"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* --- Header --- */}
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

        {/* --- Form --- */}
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

          <View className="w-full items-center">
            {/* Email */}
            <TextInput
              placeholder="Email"
              placeholderTextColor="#bbb"
              keyboardType="email-address"
              autoCapitalize="none"
              textAlignVertical="center" // 👈 thêm để text không bị tụt
              className="bg-white/5 border border-white/10 text-white rounded-xl text-base px-5 py-3.5 mb-4 w-full"
              style={{ height: 50 }} // 👈 thêm height cố định
              value={email}
              onChangeText={setEmail}
            />

            {/* Password */}
            <View className="relative w-full mb-6">
              <TextInput
                placeholder="Mật khẩu"
                placeholderTextColor="#bbb"
                secureTextEntry={!showPassword}
                textAlignVertical="center"
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

            {/* Login Button */}
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
            </TouchableOpacity> */}

            {/* <View style={{ marginTop: 16 }}>
                <GoogleSigninButton
                  size={GoogleSigninButton.Size.Wide}
                  color={GoogleSigninButton.Color.Dark}
                  onPress={handleGoogleSignin}
                  disabled={isSubmitting}
                />
              </View> */}

            {/* Sign Up Link */}
            <View className="mt-10 flex-row justify-center items-center">
              <Text className="text-white text-base">Chưa có tài khoản? </Text>
              <TouchableOpacity onPress={() => router.push("/auth/signup")}>
                <Text className="text-indigo-400 text-base font-semibold">
                  Đăng ký
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
