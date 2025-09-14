import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator,TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useOphtalmologie } from '@/hooks/useOphtalmologie';
import { usePDFExport } from '@/hooks/usePDFExport';
import { Ionicons } from '@expo/vector-icons';

export default function ConsultationDetailScreen() {
  const { id } = useLocalSearchParams();
  const { getConsultationDetail } = useOphtalmologie();
  const { exporting, exportConsultationPDF } = usePDFExport();
  const [consultation, setConsultation] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConsultation();
  }, [id]);

  const loadConsultation = async () => {
    try {
      const data = await getConsultationDetail(Number(id));
      setConsultation(data.consultation);
    } catch (err: any) {
      setError(err.message || 'Erreur de chargement');
    } finally {
      setLoading(false);
    }
  };

  const handleExportPDF = async () => {
    if (consultation) {
      await exportConsultationPDF(consultation);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error || !consultation) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle" size={50} color="#ff6b6b" />
        <Text style={styles.errorText}>{error || 'Consultation non trouvée'}</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
        <View style={styles.header}>
        <View style={styles.headerContent}>
            <Text style={styles.title}>
            Consultation du {new Date(consultation.date_consultation).toLocaleDateString('fr-FR')}
            </Text>
            <Text style={styles.motif}>{consultation.motif}</Text>
            <View style={styles.doctorInfo}>
            <Ionicons name="person" size={16} color="#666" />
            <Text style={styles.doctorText}>
                Dr. {consultation.medecin_prenom} {consultation.medecin_nom}
                {consultation.specialite && ` - ${consultation.specialite}`}
            </Text>
            </View>
        </View>
        
        <TouchableOpacity 
          style={styles.exportButton}
          onPress={handleExportPDF}
          disabled={exporting}
        >
          {exporting ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="download" size={20} color="#fff" />
              <Text style={styles.exportText}>PDF</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      {/* Examens ophtalmologiques */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Examens Ophtalmologiques</Text>
        
        <View style={styles.grid}>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Acuité OD</Text>
            <Text style={styles.gridValue}>{consultation.acuite_visuelle_od || 'N/A'}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Acuité OG</Text>
            <Text style={styles.gridValue}>{consultation.acuite_visuelle_og || 'N/A'}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Pression OD</Text>
            <Text style={styles.gridValue}>{consultation.tonometrie_od || 'N/A'}</Text>
          </View>
          <View style={styles.gridItem}>
            <Text style={styles.gridLabel}>Pression OG</Text>
            <Text style={styles.gridValue}>{consultation.tonometrie_og || 'N/A'}</Text>
          </View>
        </View>

        {consultation.refraction_od && (
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Correction OD:</Text>
            <Text style={styles.infoText}>{consultation.refraction_od}</Text>
          </View>
        )}

        {consultation.refraction_og && (
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Correction OG:</Text>
            <Text style={styles.infoText}>{consultation.refraction_og}</Text>
          </View>
        )}
      </View>

      {/* Diagnostic */}
      {consultation.diagnostic && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🩺 Diagnostic</Text>
          <Text style={styles.diagnosticText}>{consultation.diagnostic}</Text>
        </View>
      )}

      {/* Prescriptions */}
      {consultation.prescriptions && consultation.prescriptions.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💊 Prescriptions</Text>
          {consultation.prescriptions.map((prescription: any) => (
            <View key={prescription.id} style={styles.prescriptionItem}>
              <View style={styles.prescriptionHeader}>
                <Text style={styles.prescriptionType}>{prescription.type}</Text>
                {prescription.oeil && (
                  <Text style={styles.prescriptionOeil}>{prescription.oeil}</Text>
                )}
              </View>
              <Text style={styles.prescriptionDetails}>{prescription.details}</Text>
              {prescription.posologie && (
                <Text style={styles.prescriptionPosologie}>Posologie: {prescription.posologie}</Text>
              )}
            </View>
          ))}
        </View>
      )}

      {/* Observations */}
      {consultation.observations && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📝 Observations</Text>
          <Text style={styles.observationsText}>{consultation.observations}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 16, color: '#ff6b6b', marginTop: 16 },
  //header: { backgroundColor: 'white', padding: 20, marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#2c3e50', marginBottom: 8 },
  motif: { fontSize: 16, color: '#7f8c8d', marginBottom: 12 },
  doctorInfo: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  doctorText: { fontSize: 14, color: '#666' },
  section: { backgroundColor: 'white', padding: 16, marginBottom: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  gridItem: { backgroundColor: '#f8f9fa', padding: 12, borderRadius: 8, minWidth: '45%' },
  gridLabel: { fontSize: 12, color: '#7f8c8d', marginBottom: 4 },
  gridValue: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50' },
  infoItem: { marginBottom: 12 },
  infoLabel: { fontSize: 14, fontWeight: '600', color: '#34495e', marginBottom: 4 },
  infoText: { fontSize: 14, color: '#2c3e50' },
  diagnosticText: { fontSize: 16, color: '#2c3e50', lineHeight: 24 },
  prescriptionItem: { backgroundColor: '#f8f9fa', padding: 12, borderRadius: 8, marginBottom: 8 },
  prescriptionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  prescriptionType: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50' },
  prescriptionOeil: { fontSize: 14, color: '#007AFF', fontWeight: '600' },
  prescriptionDetails: { fontSize: 14, color: '#2c3e50', marginBottom: 4 },
  prescriptionPosologie: { fontSize: 12, color: '#7f8c8d' },
  observationsText: { fontSize: 14, color: '#2c3e50', lineHeight: 20 },
 
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 16,
  },
  headerContent: {
    flex: 1,
  },
  exportButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 8,
    gap: 6,
    minWidth: 80,
    justifyContent: 'center',
  },
  exportText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});