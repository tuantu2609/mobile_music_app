// app/auth/useAuth.ts
import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { loginUser } from "@/services/useAuth";
import Constants from "expo-constants"; // 🔥 import Constants để lấy API_URL động

const API_URL = Constants.expoConfig?.extra?.API_URL;
const BASE_URL = `${API_URL}/api/users`;

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Lưu token vào SecureStore
  const saveToken = async (token: string) => {
    await SecureStore.setItemAsync("token", token);
    setToken(token);
  };

  // Xóa token
  const clearToken = async () => {
    await SecureStore.deleteItemAsync("token");
    setToken(null);
  };

  // Lấy token
  const loadToken = async () => {
    const storedToken = await SecureStore.getItemAsync("token");
    if (storedToken) {
      setToken(storedToken);
    }
    return storedToken;
  };

  // Login Email/Password
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await loginUser({ email, password });
      const { token, user } = res.data;

      await saveToken(token);
      setUser(user);

      return { success: true };
    } catch (err: any) {
      console.error("Login error:", err?.response?.data || err.message);
      return { success: false, message: err?.response?.data?.error || "Login failed" };
    } finally {
      setLoading(false);
    }
  };

  // Fetch Profile
  const fetchProfile = async () => {
    const currentToken = token || await loadToken();
    console.log("TOKEN HIỆN TẠI:", currentToken);

    if (!currentToken) {
      console.log("Không có token, không fetch profile");
      return null;
    }

    try {
      const res = await axios.get(`${BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      console.log("PROFILE:", res.data);
      setUser(res.data);
      return res.data;
    } catch (err: any) {
      console.error("LỖI PROFILE:", err?.response?.data || err.message);
      return null;
    }
  };

  // Refresh User
  const refreshUser = async () => {
    const currentToken = token || (await loadToken());

    if (!currentToken) {
      console.log("Không có token, không thể làm mới profile");
      return null;
    }

    try {
      const res = await axios.get(`${BASE_URL}/profile`, {
        headers: { Authorization: `Bearer ${currentToken}` },
      });
      setUser(res.data);
      return res.data;
    } catch (err: any) {
      console.error("Lỗi khi làm mới profile:", err?.response?.data || err.message);
      return null;
    }
  };

  // Logout
  const logout = async () => {
    await clearToken();
    setUser(null);
  };

  // Load profile khi app mở lại
  useEffect(() => {
    const init = async () => {
      const storedToken = await loadToken();
      if (storedToken) {
        await fetchProfile();
      }
    };
    init();
  }, []);

  return {
    user,
    token,
    loading,
    login,
    fetchProfile,
    logout,
    saveToken,
    loadToken,
    refreshUser,
  };
}