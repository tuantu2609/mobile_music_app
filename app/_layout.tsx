import { Stack } from "expo-router";
import "./global.css";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="artist/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="song/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="album/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="playlist/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="auth/login" />
      <Stack.Screen name="auth/signup" />
      <Stack.Screen name="profile" />
    </Stack>
  );
}
