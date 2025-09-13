import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen 
        name="index" 
        options={{ title: "Accueil" }} 
      />
      <Tabs.Screen 
        name="rendez-vous" 
        options={{ title: "Rendez vous" }} 
      />
      <Tabs.Screen 
        name="profil" 
        options={{ title: "Profil" }} 
      />
    </Tabs>
  );
}
