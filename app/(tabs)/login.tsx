import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { useAuth } from "../../hooks/useAuth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const router = useRouter();
  const { user, setUser, logout, loading } = useAuth();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:5000/auth/login", {
        email,
        mot_de_passe: motDePasse,
      });
      const { token, user } = response.data;
      console.log(response.data)
      // Stocke le token ET l'utilisateur
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      Alert.alert("✅ Connexion réussie", `Bienvenue ${user.prenom} ${user.nom}`);

      // Redirige vers les tabs
      router.replace("/(tabs)/rendezvous");
    } catch (error: any) {
      Alert.alert(
        "❌ Échec de connexion",
        error.response?.data?.message || "Erreur serveur"
      );
    }
  };
  if (loading) return <Text style={styles.loading}>Chargement...</Text>;
  if (user) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>👤 Profil</Text>
        <Text style={styles.profileText}>Bonjour {user.prenom} {user.nom}</Text>
        <Button
          title="Se déconnecter"
          onPress={async () => {
            await logout();
            router.replace("/login"); // revient à login après déconnexion
          }}
        />
      </View>
    );
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
      />
      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        value={motDePasse}
        onChangeText={setMotDePasse}
        secureTextEntry
      />

      <Button title="Se connecter" onPress={handleLogin} />
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
});
