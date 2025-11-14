import { useAuth } from '@/src/presentation/context/AuthContext';
import { useCheck } from '@/src/presentation/context/CheckContext';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function HomeScreen() {

  const { user } = useAuth();
  const { concurrency, refreshConcurrency } = useCheck();
  const [refreshing, setRefreshing] = React.useState(false);

  const maxCapacity: number = 60;

  const safeOccupancy = () => {
    if (!concurrency || concurrency === 0 || !maxCapacity || maxCapacity === 0) {
      return 0;
    }
    const percentage = (concurrency / maxCapacity) * 100;
    return Math.min(Math.round(percentage), 100);
  };

  const occupancy = safeOccupancy();
  const safeConcurrency = concurrency || 0;

  const planName = 'Plan Premium';
  const planExpiryDate = '30 de Noviembre, 2025';

  const getOccupancyColor = (occupancy: number) => {
    if (occupancy < 50) return '#84c217';
    if (occupancy < 80) return '#FFD700';
    return '#FF3B30';
  };

  const firstName = user?.name || 'Usuario';

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshConcurrency();
    setRefreshing(false);
  };

  useEffect(() => {

    refreshConcurrency();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >

        <Text style={styles.headerText}>Hola, {firstName}</Text>
        <Text style={styles.subHeader}>Bienvenido a PumpUp</Text>


        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="people" size={22} color="#84c217" />
            <Text style={styles.cardTitle}>Aforo Actual</Text>
          </View>

          <Text style={[styles.occupancy, { color: getOccupancyColor(occupancy) }]}>
            {occupancy}%
          </Text>
          <Text style={styles.textMutedOccupancy}>
            {concurrency} de {maxCapacity} personas en el gimnasio
          </Text>

          <ProgressBar
            progress={occupancy / 100}
            color={getOccupancyColor(occupancy)}
            style={styles.progress}
          />
          <Text style={styles.textMutedSmallOccupancy}>
            {occupancy < 50
              ? '¡Momento ideal para entrenar!'
              : occupancy < 80
                ? 'Hay gente pero no está muy lleno'
                : 'El gimnasio está bastante lleno'}
          </Text>
        </View>


        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="calendar" size={22} color="#84c217" />
            <Text style={styles.cardTitle}>Estado de tu Plan</Text>
          </View>
          <Text style={styles.textMuted}>Plan Actual</Text>
          <Text style={styles.textMain}>{user?.membership}</Text>
          <Text style={styles.textMutedSmall}>Vigente hasta</Text>
          <Text style={styles.textMain}>{planExpiryDate}</Text>
        </View>


        <TouchableOpacity style={styles.reserveButton}>
          <Ionicons name="barbell" size={20} color="#fff" />
          <Text style={styles.reserveText}>Ver máquinas disponibles</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000ff',
    padding: 20,
  },
  headerText: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 10,
    color: '#fff'
  },
  subHeader: {
    color: '#666',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1a1f26',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: "#fff"
  },
  occupancy: {
    fontSize: 48,
    textAlign: 'center',
    marginVertical: 8,
  },
  progress: {
    height: 8,
    borderRadius: 4,
    marginTop: 8,
    marginBottom: 4,
  },

  textMutedOccupancy: {
    textAlign: 'center',
    color: '#777',
  },

  textMuted: {
    textAlign: 'left',
    color: '#777',
  },

  textMutedSmallOccupancy: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
  },

  textMutedSmall: {
    textAlign: 'left',
    color: '#999',
    fontSize: 12,
    marginBottom: 8,
  },

  textMain: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
    marginBottom: 4,
  },
  reserveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#84c217',
    padding: 14,
    borderRadius: 10,
    gap: 8,
    marginBottom: 16,
  },
  reserveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: '#EAF3FF',
    padding: 12,
    borderRadius: 10,
    gap: 10,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#555',
  },
});