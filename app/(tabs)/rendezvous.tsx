import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Calendar } from 'react-native-calendars';
import { fetchMedecins, fetchCreneauxParMedecin, addRdv} from "../api";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RendezVous() {
  const [medecins, setMedecins] = useState<any[]>([]);
  const [selectedMedecin, setSelectedMedecin] = useState<number | null>(null);
  const [creneaux, setCreneaux] = useState<any[]>([]);
  const [markedDates, setMarkedDates] = useState<any>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [creneauxDisponibles, setCreneauxDisponibles] = useState<any[]>([]);

  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        //console.log("Utilisateur connecté :", parsedUser);
        setUserId(parsedUser.id);
      }
    };
    loadUser();
  }, []);

  useEffect(() => {
    fetchMedecins().then(data => setMedecins(data));
  }, []);

  useEffect(() => {
    if (selectedMedecin) {
      fetchCreneauxParMedecin(selectedMedecin).then((data) => {
        //console.log("Créneaux disponibles :", data);
        setCreneaux(data);

        const marked: any = {};
        data.forEach((creneau: any) => {
          const [day, month, yearTime] = creneau.debut.split('/');
          const year = yearTime.split(' ')[0];
          const date = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
          
          marked[date] = { 
            marked: true, 
            dotColor: "blue", 
            selected: selectedDate === date,
            selectedColor: "#00adf5"
          };
        });
        setMarkedDates(marked);
      });
    }
  }, [selectedMedecin, selectedDate]);

  const choisirDate = (date: string) => {
    setSelectedDate(date);
    const [year, month, day] = date.split('-');
    const dateFormatted = `${day}/${month}/${year}`;
    
    const creneauxDuJour = creneaux.filter((c: any) => 
      c.debut.startsWith(dateFormatted)
    );
    
    setCreneauxDisponibles(creneauxDuJour);
  };

  const choisirCreneau = (creneau: any) => {
    const timePart = creneau.debut.split(' ')[1];
    const fullDateHeure = `${selectedDate} ${timePart}`; 
  
    Alert.alert(
      "Confirmer le rendez-vous",
      `Êtes-vous sûr de vouloir prendre rendez-vous le ${selectedDate} de ${creneau.debut.split(' ')[1]} à ${creneau.fin.split(' ')[1]} ?`,
      [
        { text: "Annuler", style: "cancel" },
        { 
          text: "Confirmer", 
          onPress: async () => {
            if (!userId || !selectedMedecin || !fullDateHeure) {
              Alert.alert("Erreur", "Données manquantes pour le rendez-vous.");
              return;
            }
            try {
              const newRdv = await addRdv(
                userId, 
                selectedMedecin, 
                fullDateHeure
              );

              console.log("Rendez-vous créé :", newRdv);
              Alert.alert("Succès", "Votre rendez-vous a été confirmé !");
              // Optionnel : naviguer vers une autre page ou rafraîchir la liste des rendez-vous
            } catch (error) {
              console.error("Échec de la création du rendez-vous ....:", error);
              Alert.alert("Erreur", "Une erreur est survenue lors de la confirmation du rendez-vous.");
            }
          }
        }
      ]
    );
  };

  const formaterHeure = (datetime: string) => {
    return datetime.split(' ')[1].substring(0, 5);
  };

  return (
    <ScrollView 
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 20 }}
      showsVerticalScrollIndicator={true}
    >
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>
        Prendre un rendez-vous
      </Text>

      {/* Liste déroulante des médecins */}
      <Text style={{ marginBottom: 10, fontSize: 16 }}>Choisissez un médecin :</Text>
      <Picker
        selectedValue={selectedMedecin}
        onValueChange={(itemValue) => {
          setSelectedMedecin(itemValue);
          setSelectedDate(null);
          setCreneauxDisponibles([]);
        }}
        style={{ marginBottom: 20 }}
      >
        <Picker.Item label="-- Sélectionner un médecin --" value={null} />
        {medecins.map((m) => (
          <Picker.Item
            key={m.id}
            label={`${m.nom} ${m.prenom}`}
            value={m.id}
          />
        ))}
      </Picker>

      {/* Calendrier avec créneaux disponibles */}
      {selectedMedecin && (
        <View>
          <Text style={{ marginBottom: 10, fontSize: 16 }}>
            Choisissez une date disponible :
          </Text>
          <Calendar
            markedDates={markedDates}
            onDayPress={(day) => choisirDate(day.dateString)}
            theme={{
              selectedDayBackgroundColor: '#00adf5',
              todayTextColor: '#00adf5',
              arrowColor: '#00adf5',
            }}
          />
        </View>
      )}

      {/* Affichage des créneaux horaires */}
      {selectedDate && creneauxDisponibles.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>
            Créneaux disponibles pour le {selectedDate} :
          </Text>
          {creneauxDisponibles.map((creneau, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => choisirCreneau(creneau)}
              style={{
                padding: 15,
                marginVertical: 5,
                backgroundColor: '#e3f2fd',
                borderRadius: 8,
                borderWidth: 1,
                borderColor: '#bbdefb'
              }}
            >
              <Text style={{ fontSize: 16, textAlign: 'center' }}>
                {formaterHeure(creneau.debut)} - {formaterHeure(creneau.fin)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {selectedDate && creneauxDisponibles.length === 0 && (
        <Text style={{ marginTop: 20, color: 'gray', textAlign: 'center' }}>
          Aucun créneau disponible pour cette date
        </Text>
      )}
    </ScrollView>
  );
}