import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { login } from "./api";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const { user, setUser, logout, loading } = useAuth();

  const handleLogin = async () => {
    if (!email || !motDePasse) {
      Alert.alert("⚠️ Champs manquants", "Veuillez entrer votre email et mot de passe.");
      return;
    }

    setIsLoading(true);
    try {
      const { token, user } = await login(email, motDePasse);

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      setUser(user);

      Alert.alert("✅ Connexion réussie", `Bienvenue ${user.prenom} ${user.nom}`);

      router.replace("/(tabs)");
    } catch (error: any) {
      console.log("Erreur détaillée login:", error.response?.data || error.message || error);
      Alert.alert(
        "❌ Échec de connexion",
        error.response?.data?.message || error.message || "Erreur inconnue"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Déjà connecté → redirige automatiquement
  if (user) {
    router.replace("/(tabs)");
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Connexion</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={motDePasse}
        onChangeText={setMotDePasse}
        secureTextEntry
      />

      {isLoading ? (
        <Text style={styles.loading}>Connexion en cours...</Text>
      ) : (
        <Button title="Se connecter" onPress={handleLogin} disabled={!email || !motDePasse} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: "center" },
  title: { fontSize: 22, marginBottom: 20, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  loading: { textAlign: "center", marginTop: 10, fontStyle: "italic" },
});
