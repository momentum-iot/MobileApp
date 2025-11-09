import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const user = {
    name: 'Arturo González',
    email: 'arturo@email.com',
    plan: 'Plan Premium',
    planExpiry: '30 de Noviembre, 2025',
    memberSince: 'Enero 2024',
  };

  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sí, salir', onPress: () => console.log('Sesión cerrada ✅') },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={styles.header}>Mi Perfil</Text>
        <Text style={styles.subHeader}>Gestiona tu cuenta y preferencias</Text>

        {/* User Profile */}
        <View style={styles.card}>
          <View style={styles.userRow}>
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/6596/6596121.png' }}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              <Text style={styles.userSince}>Miembro desde {user.memberSince}</Text>
            </View>
          </View>
        </View>

        {/* Plan */}
        <View style={[styles.card, styles.primaryCard]}>
          <View style={styles.rowBetween}>
            <View style={styles.rowCenter}>
              <FontAwesome5 name="crown" size={18} color="#FFD700" />
              <Text style={styles.cardTitle}>  Mi Plan</Text>
            </View>
            <Text style={styles.badge}>Activo</Text>
          </View>

          <Text style={styles.label}>Plan Actual</Text>
          <Text style={styles.planText}>{user.plan}</Text>

          <Text style={styles.label}>Vigente hasta</Text>
          <Text style={styles.planText}>{user.planExpiry}</Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setShowPaymentModal(true)}>
            <Ionicons name="card" size={18} color="#fff" />
            <Text style={styles.primaryButtonText}> Renovar / Pagar Plan</Text>
          </TouchableOpacity>
        </View>

        {/* Pagos */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pagos</Text>
          <TouchableOpacity style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="receipt" size={20} color="#007AFF" />
              </View>
              <Text style={styles.optionText}>Ver historial de pagos</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Cuenta */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cuenta</Text>

          <TouchableOpacity style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="person" size={20} color="#007AFF" />
              </View>
              <Text style={styles.optionText}>Editar Información Personal</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="lock-closed" size={20} color="#007AFF" />
              </View>
              <Text style={styles.optionText}>Cambiar Contraseña</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        {/* Cerrar sesión */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={18} color="#fff" />
          <Text style={styles.logoutText}> Cerrar Sesión</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Modal de pago */}
      <Modal visible={showPaymentModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Renovar Plan</Text>
            <Text style={styles.modalDescription}>
              Esta función aún no está implementada en la app móvil.
            </Text>
            <Pressable
              style={styles.modalButton}
              onPress={() => setShowPaymentModal(false)}>
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  header: { fontSize: 26, fontWeight: 'bold', marginTop: 10 },
  subHeader: { color: '#666', marginBottom: 20 },
  card: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  primaryCard: { backgroundColor: '#EAF3FF', borderColor: '#007AFF', borderWidth: 1 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  badge: {
    backgroundColor: '#007AFF',
    color: '#fff',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 12,
  },
  label: { fontSize: 12, color: '#777', marginTop: 10 },
  planText: { fontSize: 16, fontWeight: '500', color: '#333' },
  primaryButton: {
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  userRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  userName: { fontSize: 20, fontWeight: 'bold' },
  userEmail: { color: '#555' },
  userSince: { fontSize: 12, color: '#777', marginTop: 4 },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  optionLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  optionText: { fontSize: 15, color: '#333' },
  iconContainer: {
    width: 36,
    height: 36,
    backgroundColor: '#EAF3FF',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FF3B30',
    padding: 14,
    borderRadius: 10,
  },
  logoutText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: '80%',
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  modalDescription: { color: '#666', textAlign: 'center', marginBottom: 20 },
  modalButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  modalButtonText: { color: '#fff', fontWeight: '600' },
});
