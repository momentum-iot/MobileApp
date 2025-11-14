import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  ActivityIndicator,
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { useHeartRate } from '@/src/presentation/context/HeartRateContext';
import { useAuth } from '@/src/presentation/context/AuthContext';
import { HeartRate } from '@/src/domain/entities/HeartRate';


export default function HeartRateScreen() {
  const { user } = useAuth();
  const { history, isLoading, saveHeartRate } = useHeartRate();

  const [bpm, setBpm] = useState("");

  const handleAddHeartRate = async () => {
    if (!bpm || Number(bpm) <= 0) {
      return Alert.alert('Error', 'Ingresa un BPM válido');
    }

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Rigid);

      await saveHeartRate(Number(bpm));

      setBpm("");
      Keyboard.dismiss(); // Cierra el teclado después de guardar
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo registrar el BPM');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        
        <Text style={styles.header}>Heart Rate</Text>
        <Text style={styles.subHeader}>Registra y visualiza tu ritmo cardiaco</Text>

        {/* --------- STATUS CARD --------- */}
        <View style={styles.statusCard}>
          <Ionicons name="heart" size={60} color="#ff3b30" style={{ marginBottom: 10 }} />
          <Text style={styles.statusTitle}>Simulación de medición</Text>
          <Text style={styles.statusSubtitle}>
            Ingresa un BPM manualmente mientras conectas el futuro sensor.
          </Text>
        </View>

        {/* --------- INPUT CARD --------- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Añadir nuevo Heart Rate</Text>

          <View style={styles.inputRow}>
            <TextInput
              placeholder="Ej: 82"
              placeholderTextColor="#666"
              keyboardType="numeric"
              value={bpm}
              onChangeText={setBpm}
              style={styles.input}
            />

            <TouchableOpacity
              style={[styles.addButton, isLoading && styles.buttonDisabled]}
              onPress={handleAddHeartRate}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Ionicons name="add" size={24} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* --------- HISTORY --------- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Historial de BPM</Text>

          {!history || history.length === 0 ? (
            <Text style={styles.emptyText}>Aún no tienes registros</Text>
          ) : (
            <FlatList
              data={history}
              keyExtractor={(item: HeartRate) => item.id.toString()}
              style={{ marginTop: 10 }}
              renderItem={({ item }) => (
                <View style={styles.historyItem}>
                  <Ionicons name="pulse" size={22} color="#84c217" />

                  <View style={{ flex: 1 }}>
                    <Text style={styles.historyBpm}>{item.bpm} bpm</Text>
                    <Text style={styles.historyDate}>
                      {item.date} — {item.time}
                    </Text>
                  </View>
                </View>
              )}
            />
          )}
        </View>

      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000ff',
    padding: 20,
  },

  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 10,
    color: "#fff",
  },

  subHeader: {
    color: '#666',
    marginBottom: 20,
  },

  statusCard: {
    backgroundColor: '#1a1f26',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ff3b30',
  },

  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
    color: "#fff",
  },

  statusSubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },

  card: {
    backgroundColor: '#1a1f26',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: "#fff",
    marginBottom: 12,
  },

  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  input: {
    flex: 1,
    backgroundColor: '#111418',
    padding: 12,
    borderRadius: 10,
    color: "#fff",
    borderColor: '#333',
    borderWidth: 1,
    fontSize: 16,
  },

  addButton: {
    backgroundColor: '#34C759',
    padding: 14,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  emptyText: {
    textAlign: 'center',
    color: "#777",
    marginVertical: 12,
  },

  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111418',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    gap: 12,
  },

  historyBpm: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  historyDate: {
    color: "#777",
    fontSize: 13,
  },
});
