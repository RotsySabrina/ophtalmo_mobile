import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View, ActivityIndicator } from "react-native";
import { useAuth } from "../hooks/useAuth";
import { login } from "../lib/api";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const router = useRouter();
  const { user, setUser, loading } = useAuth();

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        const userData = await AsyncStorage.getItem("user");
        
        if (token && userData) {
          setUser(JSON.parse(userData));
          // Navigation dans un useEffect, pas pendant le rendu
          router.replace("/(tabs)");
        }
      } catch (error) {
        console.error("Erreur vérification auth:", error);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

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
      
      // Navigation après l'action utilisateur, pas pendant le rendu
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

  // Afficher un indicateur de chargement pendant la vérification de l'authentification
  if (isCheckingAuth || loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Vérification de la session...</Text>
      </View>
    );
  }

  // Si l'utilisateur est connecté mais pas encore redirigé
  if (user) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.loadingText}>Redirection...</Text>
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
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Connexion en cours...</Text>
        </View>
      ) : (
        <Button title="Se connecter" onPress={handleLogin} disabled={!email || !motDePasse} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 20, 
    justifyContent: "center" 
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { 
    fontSize: 22, 
    marginBottom: 20, 
    textAlign: "center" 
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  loadingText: { 
    textAlign: "center", 
    marginTop: 10, 
    fontStyle: "italic" 
  },
});