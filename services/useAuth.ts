import axios from "axios";
import Constants from "expo-constants";
// const BASE_URL = "http://192.168.1.4:3001/api/users";
const API_URL = Constants.expoConfig?.extra?.API_URL;
const BASE_URL = `${API_URL}/api/users`;

export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  phone: string;
}) => {
  return await axios.post(`${BASE_URL}/register`, data);
};

export const sendOtpToEmail = async (email: string) => {
  return await axios.post(`${BASE_URL}/send-otp`, { email });
};

export const verifyOtp = async (email: string, otp: string) => {
  return await axios.post(`${BASE_URL}/verify-otp`, { email, otp });
};

export const loginUser = async (data: { email: string; password: string }) => {
  return await axios.post(`${BASE_URL}/login`, data);
};
