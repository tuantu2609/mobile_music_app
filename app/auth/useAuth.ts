// app/auth/useAuth.ts
import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";
import axios from "axios";
import { loginUser } from "@/services/useAuth";

const BASE_URL = "http://192.168.1.4:3001/api/users";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Lưu token vào SecureStore
  const saveToken = async (token: string) => {
    await SecureStore.setItemAsync("token", token);
    setToken(token);
  };

  // Xoá token
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
    } catch (err) {
      console.error("LỖI PROFILE:", err?.response?.data || err.message);
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
    } catch (err) {
      console.error("Lỗi khi làm mới profile:", err?.response?.data || err.message);
      return null;
    }
  };

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
