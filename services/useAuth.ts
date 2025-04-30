import axios from "axios";
import Constants from "expo-constants";

const API_URL = Constants.expoConfig?.extra?.API_URL;
const BASE_URL = `${API_URL}/api/users`;

// Đăng ký
export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  phone: string;
}) => {
  return await axios.post(`${BASE_URL}/register`, data);
};

// Gửi OTP cho đăng ký
export const sendOtpToEmail = async (email: string) => {
  return await axios.post(`${BASE_URL}/send-otp`, { email });
};

// Gửi OTP cho reset password
export const sendResetOtp = async (email: string) => {
  return await axios.post(`${BASE_URL}/send-reset-otp`, { email });
};

// Xác thực OTP đăng ký
export const verifyOtp = async (email: string, otp: string) => {
  return await axios.post(`${BASE_URL}/verify-otp`, { email, otp });
};

// Đăng nhập
export const loginUser = async (data: { email: string; password: string }) => {
  return await axios.post(`${BASE_URL}/login`, data);
};

// Xác thực OTP reset password
export const verifyResetOtp = async (email: string, otp: string) => {
  return await axios.post(`${BASE_URL}/verify-reset-otp`, { email, otp });
};

// Đặt lại mật khẩu
export const resetPassword = async (email: string, newPassword: string, otp: string) => {
  return await axios.post(`${BASE_URL}/reset-password`, {
    email,
    newPassword,
    otp,
  });
};

// Cập nhật hồ sơ
export const updateProfile = async (
  token: string,
  data: {
    name?: string;
    phone?: string;
    avatarUri?: string;
    currentPassword?: string;
    newPassword?: string;
  }
) => {
  const formData = new FormData();

  if (data.name) formData.append("name", data.name);
  if (data.phone) formData.append("phone", data.phone);
  if (data.currentPassword) formData.append("oldPassword", data.currentPassword);
  if (data.newPassword) formData.append("newPassword", data.newPassword);

  if (data.avatarUri) {
    const fileName = data.avatarUri.split("/").pop();
    const fileType = fileName?.split(".").pop();
    formData.append("avatar", {
      uri: data.avatarUri,
      name: fileName,
      type: `image/${fileType}`,
    } as any);
  }

  const res = await axios.put(`${BASE_URL}/update-profile`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

// Like a song
export const likeSong = async (songId: string, token: string) => {
  return await axios.post(
    `${BASE_URL}/like-song`,
    { songId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

// Unlike a song
export const unlikeSong = async (songId: string, token: string) => {
  return await axios.delete(`${BASE_URL}/unlike-song`, {
    data: { songId },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// Get total likes for a song
export const getTotalLikesOfSong = async (songId: string, token: string) => {
  try {
    const response = await axios.get(`${API_URL}/songs/${songId}/total-likes`, {
      headers: {
        Authorization: `Bearer ${token}`, // Thêm token vào headers
      },
    });
    return response.data; // { songId, likeCount }
  } catch (error) {
    console.error("Error fetching total likes:", error);
    throw error;
  }
};

// Lấy danh sách bài hát đã liked của người dùng
export const getUserLikedSongs = async (userId: string, token: string, limit = 10, offset = 0) => {
  try {
    const response = await axios.get(`${BASE_URL}/${userId}/liked-songs`, {
      headers: {
        Authorization: `Bearer ${token}`, // Đảm bảo bạn đã có token
      },
      params: {
        limit: limit,
        offset: offset,
      },
    });

    return response.data; // Trả về dữ liệu danh sách bài hát
  } catch (error) {
    console.error("Error fetching liked songs:", error);
    throw error; // Ném lỗi để xử lý ở nơi gọi
  }
};