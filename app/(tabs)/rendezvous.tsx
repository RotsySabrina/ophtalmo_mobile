import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, View } from "react-native";
import { Button, Provider, Text, TextInput } from "react-native-paper";
import { DatePickerInput, fr, registerTranslation } from "react-native-paper-dates";

registerTranslation("fr", fr);

export default function RendezVous() {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [userId, setUserId] = useState<string | null>(null);
  const router = useRouter();

  // Charger l’utilisateur stocké
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        console.log("Utilisateur connecté :", parsedUser);
        setUserId(parsedUser.id.toString());
      }
    };
    loadUser();
  }, []);


  // Fonction de confirmation RDV
  const handleConfirm = async () => {
    if (!userId) {
      // Pas connecté → redirige vers login
      Alert.alert("🔑 Connexion requise", "Veuillez vous connecter pour continuer.");
      router.push("/login"); // Assure-toi que ton login est bien dans app/login.tsx
      return;
    }

    if (!date) {
      Alert.alert("⚠️ Erreur", "Veuillez choisir une date.");
      return;
    }

    // Sinon, confirmation du RDV
    console.log("📌 RDV confirmé :", { date, userId });
    Alert.alert("✅ Succès", `RDV confirmé pour l'utilisateur ${userId}`);
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Text style={styles.title}>Prendre un rendez-vous</Text>

        {/* Champ utilisateur */}
        <TextInput
          label="ID Utilisateur"
          value={userId ?? ""}
          editable={false} // ou disabled
          style={styles.input}
        />

        {/* Champ date */}
        <DatePickerInput
          locale="fr"
          label="Sélectionnez une date"
          value={date}
          onChange={(d) => setDate(d)}
          inputMode="start"
          mode="outlined"
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleConfirm}
          style={styles.button}
        >
          Confirmer
        </Button>
      </View>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  input: {
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
    paddingVertical: 6,
  },
});
