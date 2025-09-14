import { useState } from 'react';
import { Alert } from 'react-native';
import { PDFExportService } from '@/services/pdfExportService';

export const usePDFExport = () => {
  const [exporting, setExporting] = useState(false);

  const exportConsultationPDF = async (consultation: any) => {
    setExporting(true);
    try {
      await PDFExportService.generateConsultationPDF(consultation);
      Alert.alert('Succès', 'PDF généré avec succès');
    } catch (error) {
      console.error('Erreur export PDF:', error);
    } finally {
      setExporting(false);
    }
  };

  const exportDossierPDF = async (dossier: any, consultations: any[]) => {
    setExporting(true);
    try {
      await PDFExportService.generateDossierPDF(dossier, consultations);
      Alert.alert('Succès', 'Dossier PDF généré avec succès');
    } catch (error) {
      console.error('Erreur export dossier PDF:', error);
    } finally {
      setExporting(false);
    }
  };

  return {
    exporting,
    exportConsultationPDF,
    exportDossierPDF
  };
};