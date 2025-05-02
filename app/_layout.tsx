// import { Stack } from "expo-router";
// import "./global.css";

// export default function RootLayout() {
//   return (
//     <Stack screenOptions={{ headerShown: false }}>
//       <Stack.Screen name="index" options={{ headerShown: false }} />
//       <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//       <Stack.Screen name="artist/[id]" options={{ headerShown: false }} />
//       <Stack.Screen name="song/[id]" options={{ headerShown: false }} />
//       <Stack.Screen name="album/[id]" options={{ headerShown: false }} />
//       <Stack.Screen name="playlist/[id]" options={{ headerShown: false }} />
//       <Stack.Screen name="auth/login" />
//       <Stack.Screen name="auth/signup" />
//       <Stack.Screen name="profile" />
//     </Stack>
//   );
// }
// app/_layout.tsx
import { Slot } from "expo-router";
import { View } from "react-native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./global.css";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <View className="flex-1 bg-black">
        <Slot />
      </View>
    </QueryClientProvider>
  );
}
