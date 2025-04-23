import * as Google from "expo-auth-session/providers/google";
import { useEffect } from "react";
import { useRouter } from "expo-router";
import axios from "axios";
import * as AuthSession from "expo-auth-session";

export function useGoogleLogin() {
  const router = useRouter();
  const redirectUri = AuthSession.makeRedirectUri({
    useProxy: true, // Dùng proxy của Expo
  });

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: "40260263071-5vlm3c5bappus6mphg6agm1ba66pulnu.apps.googleusercontent.com", // Web Client ID
    iosClientId: "40260263071-2gn63q0j31qjtoj2g6lv1brpp0innh53.apps.googleusercontent.com", // iOS Client 
    androidClientId:"40260263071-iko29l81q19atl5t5q8f4er5oqk8o1bo.apps.googleusercontent.com",
    redirectUri,
    useProxy: true, // Bắt buộc true khi chạy Expo Go
  });

  // console.log("Redirect URI:", redirectUri);

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.authentication || {};
      if (id_token) {
        handleGoogleLogin(id_token);
      }
    }
  }, [response]);

  const handleGoogleLogin = async (idToken: string) => {
    try {
      const res = await axios.post("http://192.168.2.77:3001/api/users/login-google", {
        idToken,
      });

      const { token, user } = res.data;

      console.log("✅ Google login success:", user);

      router.replace("/(tabs)");
    } catch (err) {
      console.error("Google login failed:", err.response?.data || err.message);
      alert("Đăng nhập bằng Google thất bại!");
    }
  };

  return { promptAsync, request };
}
