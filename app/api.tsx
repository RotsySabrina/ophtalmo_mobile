import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.1.104:5000/",
});

export const login = async (email: string, mot_de_passe: string) => {
  const res = await API.post("/auth/login", {
     email, mot_de_passe
  });
  return res.data;
};

export const fetchMedecins = async () => {
  const response = await API.get("/users/medecins");
  return response.data;
};

export const fetchCreneauxParMedecin = async (id_medecin: string) => {
  const res = await API.get("/rendez_vous/creneaux", {
    params: { id_medecin },
  });
  return res.data;
};

export const addRdv = async (id_patient: string,id_medecin: string, date_heure: string) => {
  const res = await API.post("/rendez_vous", {
     id_patient, id_medecin, date_heure
  });
  return res.data;
};

