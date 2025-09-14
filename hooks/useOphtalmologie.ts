import { useState, useEffect } from 'react';
import { 
  fetchDossierOphtalmologique, 
  fetchConsultationDetail,
  createConsultationOphtalmologique,
  createPrescriptionOphtalmologique 
} from '@/lib/api';
import { useAuth } from './useAuth';

export const useOphtalmologie = () => {
  const [dossier, setDossier] = useState<any>(null);
  const [consultations, setConsultations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const loadDossierOphtalmologique = async () => {
    if (!user?.id) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await fetchDossierOphtalmologique(user.id);
      if (data.success) {
        setDossier(data.dossier);
        setConsultations(data.consultations);
      } else {
        setError(data.message || 'Erreur lors du chargement du dossier');
      }
    } catch (err: any) {
      console.error('Erreur chargement dossier ophtalmologique:', err);
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const getConsultationDetail = async (idConsultation: number) => {
    try {
      const data = await fetchConsultationDetail(idConsultation);
      return data;
    } catch (error) {
      console.error('Erreur détail consultation:', error);
      throw error;
    }
  };

  const ajouterConsultation = async (consultationData: any) => {
    try {
      const result = await createConsultationOphtalmologique(consultationData);
      // Recharger le dossier après ajout
      await loadDossierOphtalmologique();
      return result;
    } catch (error) {
      console.error('Erreur ajout consultation:', error);
      throw error;
    }
  };

  const ajouterPrescription = async (prescriptionData: any) => {
    try {
      const result = await createPrescriptionOphtalmologique(prescriptionData);
      return result;
    } catch (error) {
      console.error('Erreur ajout prescription:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (user?.id) {
      loadDossierOphtalmologique();
    }
  }, [user?.id]);

  return {
    dossier,
    consultations,
    loading,
    error,
    refreshDossier: loadDossierOphtalmologique,
    getConsultationDetail,
    ajouterConsultation,
    ajouterPrescription
  };
};

