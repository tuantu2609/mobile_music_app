// const { getDefaultConfig } = require("expo/metro-config");
// const { withNativeWind } = require("nativewind/metro");

// const config = getDefaultConfig(__dirname);

// module.exports = withNativeWind(config, { input: "./app/global.css" });
// metro.config.js
const { getDefaultConfig } = require("@expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// Lấy cấu hình gốc từ Expo
const defaultConfig = getDefaultConfig(__dirname);

// Apply NativeWind sau khi đã có cấu hình chuẩn từ Expo
const config = withNativeWind(defaultConfig, {
  input: "./app/global.css",
});

module.exports = config;
