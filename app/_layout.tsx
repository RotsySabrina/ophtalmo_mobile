import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Ici pas de Tab bar, juste navigation classique */}
      <Stack.Screen name="index" />   {/* Page d’accueil */}
      <Stack.Screen name="login" />   {/* Page login */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} /> 
    </Stack>
  );
}
