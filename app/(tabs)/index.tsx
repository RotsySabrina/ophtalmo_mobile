import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur l’appli Ophtalmo</Text>

      <Image
        source={require("@/assets/images/4432.jpg")}
        style={styles.image}
        resizeMode="contain" // ou "cover" selon rendu souhaité
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  image: {
    width: 400,   // largeur réduite
    height: 400,  // hauteur réduite
    marginBottom: 20,
    borderRadius: 10, // coins arrondis (optionnel)
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#333",
  },
});
