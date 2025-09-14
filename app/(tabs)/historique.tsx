import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { useOphtalmologie } from '@/hooks/useOphtalmologie';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HistoriqueScreen() {
  const { dossier, consultations, loading, error, refreshDossier } = useOphtalmologie();
  const router = useRouter();

  const renderConsultation = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.consultationCard}
      onPress={() => router.push(`../consultation/${item.id}`)}
    >
      <View style={styles.consultationHeader}>
        <View>
          <Text style={styles.date}>
            {new Date(item.date_consultation).toLocaleDateString('fr-FR')}
          </Text>
          <Text style={styles.motif} numberOfLines={1}>
            {item.motif}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </View>

      {/* Acuité visuelle */}
      {(item.acuite_visuelle_od || item.acuite_visuelle_og) && (
        <View style={styles.acuiteContainer}>
          <Text style={styles.sectionLabel}>Acuité visuelle:</Text>
          <View style={styles.acuiteRow}>
            <Text style={styles.oeilLabel}>OD:</Text>
            <Text style={styles.acuiteValue}>{item.acuite_visuelle_od || 'N/A'}</Text>
            <Text style={styles.oeilLabel}>OG:</Text>
            <Text style={styles.acuiteValue}>{item.acuite_visuelle_og || 'N/A'}</Text>
          </View>
        </View>
      )}

      {/* Prescriptions */}
      {item.prescriptions && item.prescriptions.length > 0 && (
        <View style={styles.prescriptionsContainer}>
          <Ionicons name="medical" size={14} color="#28a745" />
          <Text style={styles.prescriptionsText}>
            {item.prescriptions.length} prescription(s)
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );

  if (loading && consultations.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement de votre historique...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle" size={50} color="#ff6b6b" />
        <Text style={styles.errorText}>Erreur de chargement</Text>
        <Text style={styles.errorSubtext}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshDossier}>
          <Text style={styles.retryText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={loading}
          onRefresh={refreshDossier}
          colors={['#007AFF']}
        />
      }
    >
      {/* En-tête */}
      <View style={styles.header}>
        <Text style={styles.title}>📋 Mon Historique Ophtalmologique</Text>
        
        {dossier && (
          <Text style={styles.dossierText}>
            Dossier créé le: {new Date(dossier.date_creation).toLocaleDateString('fr-FR')}
          </Text>
        )}
      </View>

      {/* Statistiques */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{consultations.length}</Text>
          <Text style={styles.statLabel}>Consultations</Text>
        </View>
        
        {consultations.length > 0 && (
          <View style={styles.statItem}>
            <Ionicons name="time" size={20} color="#007AFF" />
            <Text style={styles.statLabel}>
              Dernière: {new Date(consultations[0].date_consultation).toLocaleDateString('fr-FR')}
            </Text>
          </View>
        )}
      </View>

      {/* Liste des consultations */}
      <View style={styles.consultationsSection}>
        <Text style={styles.sectionTitle}>
          Mes Consultations ({consultations.length})
        </Text>

        <FlatList
          data={consultations}
          renderItem={renderConsultation}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="eye-off" size={50} color="#ccc" />
              <Text style={styles.emptyText}>Aucune consultation</Text>
              <Text style={styles.emptySubtext}>
                Votre historique apparaîtra ici après votre première consultation
              </Text>
            </View>
          }
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f9fa' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { marginTop: 16, color: '#666', fontSize: 16 },
  errorText: { fontSize: 18, color: '#ff6b6b', marginTop: 16, fontWeight: '600' },
  errorSubtext: { fontSize: 14, color: '#666', marginTop: 8, textAlign: 'center' },
  retryButton: { backgroundColor: '#007AFF', padding: 12, borderRadius: 8, marginTop: 16 },
  retryText: { color: 'white', fontWeight: '600' },
  header: { padding: 20, backgroundColor: 'white' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2c3e50', marginBottom: 8 },
  dossierText: { fontSize: 14, color: '#7f8c8d' },
  statsContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    padding: 16, 
    backgroundColor: 'white', 
    margin: 16, 
    borderRadius: 12 
  },
  statItem: { alignItems: 'center' },
  statNumber: { fontSize: 24, fontWeight: 'bold', color: '#2c3e50' },
  statLabel: { fontSize: 12, color: '#7f8c8d', textAlign: 'center', marginTop: 4 },
  consultationsSection: { padding: 16 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#2c3e50', marginBottom: 16 },
  consultationCard: {
    backgroundColor: 'white',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  consultationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  date: { fontSize: 16, fontWeight: 'bold', color: '#2c3e50' },
  motif: { fontSize: 14, color: '#7f8c8d', marginTop: 4 },
  acuiteContainer: { marginBottom: 12 },
  sectionLabel: { fontSize: 14, fontWeight: '600', color: '#34495e', marginBottom: 6 },
  acuiteRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  oeilLabel: { fontSize: 14, fontWeight: '600', color: '#7f8c8d', minWidth: 30 },
  acuiteValue: { fontSize: 14, color: '#2c3e50', fontWeight: '500' },
  prescriptionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e8f5e8',
    padding: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  prescriptionsText: { fontSize: 12, color: '#28a745', marginLeft: 6, fontWeight: '500' },
  empty: { alignItems: 'center', padding: 40, backgroundColor: 'white', borderRadius: 12, margin: 16 },
  emptyText: { fontSize: 16, color: '#7f8c8d', marginTop: 16, fontWeight: '500' },
  emptySubtext: { fontSize: 14, color: '#bdc3c7', textAlign: 'center', marginTop: 8 },
});