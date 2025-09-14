import axios from "axios";
import AsyncStorage from '@react-native-async-storage/async-storage';

const API = axios.create({
  baseURL: "http://192.168.1.104:5000/",
});

// Intercepteur pour ajouter le token automatiquement
API.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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

// NOTIFICATIONS
export const fetchNotifications = async (idPatient: number, nonLuSeulement?: boolean, type?: string) => {
  let url = `/notifications/patient/${idPatient}`;
  const params = new URLSearchParams();
  
  if (nonLuSeulement) params.append('nonLuSeulement', 'true');
  if (type) params.append('type', type);
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  const response = await API.get(url);
  return response.data;
};

export const fetchUnreadNotificationsCount = async (idPatient: number) => {
  const response = await API.get(`/notifications/patient/${idPatient}/non-lues/count`);
  return response.data;
};

export const markNotificationAsRead = async (idNotification: number) => {
  const response = await API.put(`/notifications/${idNotification}/lu`);
  return response.data;
};

export const markAllNotificationsAsRead = async (idPatient: number) => {
  const response = await API.put(`/notifications/patient/${idPatient}/marquer-lues`);
  return response.data;
};

export const deleteNotification = async (idNotification: number) => {
  const response = await API.delete(`/notifications/${idNotification}`);
  return response.data;
};

export const createNotification = async (idPatient: number, message: string, type?: string) => {
  const response = await API.post('/notifications', {
    id_patient: idPatient,
    message,
    type
  });
  return response.data;
};
