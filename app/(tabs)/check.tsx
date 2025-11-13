import { useAuth } from '@/src/presentation/context/AuthContext';
import { useCheck } from '@/src/presentation/context/CheckContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function CheckScreen() {
  const { user } = useAuth();
  const { isInside, concurrency, isLoading, checkIn, checkOut } = useCheck();

  const handleCheckIn = async () => {
    try {
      const message = await checkIn();
      //Alert.alert('¡Check-in exitoso!', message, [{ text: 'OK' }]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo hacer check-in');
    }
  };

  const handleCheckOut = async () => {
    try {
      const message = await checkOut();
      //Alert.alert('¡Check-out exitoso!', message, [{ text: 'OK' }]);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'No se pudo hacer check-in');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      
      <Text style={styles.header}>Check-in / Check-out</Text>
      <Text style={styles.subHeader}>Registra tu entrada y salida del gym</Text>

      
      <View style={[styles.statusCard, isInside ? styles.statusInside : styles.statusOutside]}>
        <View style={styles.statusIcon}>
          <Ionicons
            name={isInside ? 'checkmark-circle' : 'close-circle'}
            size={60}
            color={isInside ? '#34C759' : '#999'}
          />
        </View>
        <Text style={styles.statusTitle}>
          {isInside ? '¡Estás dentro del gym!' : 'No estás en el gym'}
        </Text>
        <Text style={styles.statusSubtitle}>
          {isInside
            ? 'Recuerda hacer check-out al salir'
            : 'Haz check-in al entrar al gimnasio'}
        </Text>
      </View>

      
      <View style={styles.card}>
        <View style={styles.infoRow}>
          <Ionicons name="person" size={20} color="#007AFF" />
          <Text style={styles.infoLabel}>Usuario:</Text>
          <Text style={styles.infoValue}>
            {user?.name} {user?.lastName}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="people" size={20} color="#007AFF" />
          <Text style={styles.infoLabel}>Personas dentro:</Text>
          <Text style={styles.infoValue}>{concurrency}</Text>
        </View>
      </View>

      
      <View style={styles.buttonContainer}>
        {!isInside ? (
          <TouchableOpacity
            style={[styles.button, styles.buttonCheckIn, isLoading && styles.buttonDisabled]}
            onPress={handleCheckIn}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="log-in" size={24} color="#fff" />
                <Text style={styles.buttonText}>Check-in</Text>
              </>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.buttonCheckOut, isLoading && styles.buttonDisabled]}
            onPress={handleCheckOut}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Ionicons name="log-out" size={24} color="#fff" />
                <Text style={styles.buttonText}>Check-out</Text>
              </>
            )}
          </TouchableOpacity>
        )}
      </View>

      
      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={20} color="#007AFF" />
        <Text style={styles.infoBoxText}>
          {isInside
            ? 'Asegúrate de hacer check-out al salir para que otros sepan el aforo real.'
            : 'Al hacer check-in, otros usuarios podrán ver que estás en el gimnasio.'}
        </Text>
      </View>

      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Tu última visita</Text>
        <Text style={styles.cardSubtitle}>Esta función estará disponible pronto</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 10,
  },
  subHeader: {
    color: '#666',
    marginBottom: 20,
  },
  statusCard: {
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
  },
  statusInside: {
    backgroundColor: '#E8F5E9',
    borderColor: '#34C759',
  },
  statusOutside: {
    backgroundColor: '#F5F5F5',
    borderColor: '#E0E0E0',
  },
  statusIcon: {
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  infoLabel: {
    fontSize: 15,
    color: '#666',
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#000',
    flex: 1,
    textAlign: 'right',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18,
    borderRadius: 12,
    gap: 12,
  },
  buttonCheckIn: {
    backgroundColor: '#34C759',
  },
  buttonCheckOut: {
    backgroundColor: '#FF3B30',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EAF3FF',
    padding: 12,
    borderRadius: 10,
    gap: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  infoBoxText: {
    flex: 1,
    fontSize: 13,
    color: '#555',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#999',
  },
});