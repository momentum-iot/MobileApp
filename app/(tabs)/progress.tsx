import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { BarChart, LineChart } from 'react-native-chart-kit';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProgressScreen() {
    const [activeTab, setActiveTab] = useState<'metrics' | 'history'>('metrics');

    const heartRateData = [145, 152, 138, 148, 155, 142, 150];
    const caloriesData = [420, 485, 395, 450, 510, 430, 465];
    const labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

    const visitHistory = [
        { date: '04 Nov 2025', checkIn: '07:30', checkOut: '08:45', duration: '1h 15min' },
        { date: '03 Nov 2025', checkIn: '06:45', checkOut: '08:00', duration: '1h 15min' },
        { date: '02 Nov 2025', checkIn: '07:15', checkOut: '08:30', duration: '1h 15min' },
        { date: '01 Nov 2025', checkIn: '07:00', checkOut: '08:20', duration: '1h 20min' },
    ];

    const chartConfig = {
        backgroundGradientFrom: '#fff',
        backgroundGradientTo: '#fff',
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        labelColor: () => '#555',
        strokeWidth: 2,
        propsForDots: { r: '4', strokeWidth: '2', stroke: '#007AFF' },
    };

    const screenWidth = Dimensions.get('window').width - 40;

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <Text style={styles.header}>Mi Progreso</Text>
            <Text style={styles.subHeader}>Sigue tu rendimiento y mejora</Text>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'metrics' && styles.tabActive]}
                    onPress={() => setActiveTab('metrics')}>
                    <Text style={[styles.tabText, activeTab === 'metrics' && styles.tabTextActive]}>
                        Métricas
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.tabButton, activeTab === 'history' && styles.tabActive]}
                    onPress={() => setActiveTab('history')}>
                    <Text style={[styles.tabText, activeTab === 'history' && styles.tabTextActive]}>
                        Historial
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Metrics */}
            {activeTab === 'metrics' && (
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* Stats summary */}
                    <View style={styles.statRow}>
                        <View style={styles.statCard}>
                            <Ionicons name="heart" size={22} color="#FF3B30" />
                            <Text style={styles.statLabel}>Promedio</Text>
                            <Text style={styles.statValue}>148 BPM</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Ionicons name="flame" size={22} color="#FF9500" />
                            <Text style={styles.statLabel}>Calorías</Text>
                            <Text style={styles.statValue}>450 kcal</Text>
                        </View>
                        <View style={styles.statCard}>
                            <Ionicons name="time" size={22} color="#007AFF" />
                            <Text style={styles.statLabel}>Sesiones</Text>
                            <Text style={styles.statValue}>24</Text>
                        </View>
                    </View>

                    {/* Heart Rate Chart */}
                    <Text style={styles.chartTitle}>Ritmo Cardíaco Promedio</Text>
                    <LineChart
                        data={{
                            labels,
                            datasets: [{ data: heartRateData }],
                        }}
                        width={screenWidth}
                        height={220}
                        chartConfig={chartConfig}
                        bezier
                        style={styles.chart}
                    />

                    {/* Calories Chart */}
                    <Text style={styles.chartTitle}>Calorías Quemadas</Text>
                    <BarChart
                        data={{
                            labels,
                            datasets: [{ data: caloriesData }],
                        }}
                        width={screenWidth}
                        height={220}
                        yAxisLabel=""
                        yAxisSuffix=" kcal"
                        chartConfig={{
                            ...chartConfig,
                            color: () => '#84C216',
                        }}
                        style={styles.chart}
                        fromZero
                        showValuesOnTopOfBars
                    />

                </ScrollView>
            )}

            {/* History */}
            {activeTab === 'history' && (
                <ScrollView showsVerticalScrollIndicator={false}>
                    {visitHistory.map((v, i) => (
                        <View key={i} style={styles.historyItem}>
                            <View>
                                <Text style={styles.historyDate}>{v.date}</Text>
                                <Text style={styles.historySub}>
                                    {v.checkIn} - {v.checkOut}
                                </Text>
                            </View>
                            <View>
                                <Text style={styles.historySub}>Duración</Text>
                                <Text style={styles.historyDuration}>{v.duration}</Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20 },
    header: { fontSize: 26, fontWeight: 'bold', color: '#000' },
    subHeader: { color: '#666', marginBottom: 20 },
    tabContainer: { flexDirection: 'row', backgroundColor: '#eee', borderRadius: 10, marginBottom: 20 },
    tabButton: { flex: 1, padding: 10, alignItems: 'center' },
    tabActive: { backgroundColor: '#007AFF' },
    tabText: { color: '#555', fontWeight: '500' },
    tabTextActive: { color: '#fff' },
    statRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    statCard: { alignItems: 'center', flex: 1 },
    statLabel: { fontSize: 12, color: '#888' },
    statValue: { fontSize: 18, fontWeight: 'bold' },
    chartTitle: { fontSize: 16, fontWeight: '600', marginTop: 20 },
    chart: { borderRadius: 8, marginVertical: 10 },
    historyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#F9F9F9',
        borderRadius: 10,
        padding: 14,
        marginBottom: 10,
    },
    historyDate: { fontSize: 16, fontWeight: '500' },
    historySub: { color: '#777', fontSize: 12 },
    historyDuration: { fontWeight: 'bold', color: '#007AFF' },
});
