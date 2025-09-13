import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, Provider, Text } from "react-native-paper";
import { DatePickerInput, fr, registerTranslation } from "react-native-paper-dates";

registerTranslation("fr", fr);

export default function RendezVous() {
  const [date, setDate] = useState<Date | undefined>(undefined);

  return (
    <Provider>
      <View style={styles.container}>
        <Text style={styles.title}>Prendre un rendez-vous</Text>

        {/* Champ de date amélioré */}
        <DatePickerInput
          locale="fr"
          label="Sélectionnez une date"
          value={date}
          onChange={(d) => setDate(d)}
          inputMode="start"
          mode="outlined"
          style={styles.dateInput}
        />

        <Button
          mode="contained"
          onPress={() => console.log("Date choisie:", date)}
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
  dateInput: {
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
    borderRadius: 8,
    paddingVertical: 6,
  },
});
