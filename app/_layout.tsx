import { Stack } from "expo-router";
import "./global.css";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="artist/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="song/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="album/[id]" options={{ headerShown: false }} />
      <Stack.Screen name="playlist/[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
