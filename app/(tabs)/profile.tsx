import { useAuth } from '@/src/presentation/context/AuthContext';
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, useRef } from 'react';
import { Animated, Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Cargando...</Text>
      </SafeAreaView>
    );
  }

  const memberSince = user.joinDate
    ? new Date(user.joinDate).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
    : 'Enero 2024';


  const membershipNames: Record<string, string> = {
    BASICO: 'Plan Básico',
    PREMIUM: 'Plan Premium',
  };

  const planName = user.membership ? membershipNames[user.membership] : 'Sin plan';


  const planExpiry = user.joinDate
    ? new Date(new Date(user.joinDate).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
    : '30 de Noviembre, 2025';


  const handleLogout = () => {
    Alert.alert('Cerrar Sesión', '¿Seguro que quieres salir?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sí, salir',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/login');
        },
      },
    ]);
  };

  const titleScale = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0.75],
    extrapolate: 'clamp',
  });

  const titleTranslateY = scrollY.interpolate({
    inputRange: [0, 120],
    outputRange: [0, -40],
    extrapolate: 'clamp',
  });

  const titleTranslateX = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 70],
    extrapolate: 'clamp',
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [1, 20],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerOpacity,
          },
        ]}
      >
        <Text style={styles.headerTitle}>Mi Perfil</Text>
      </Animated.View>

        <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: 20 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* 🧭 TÍTULO ANIMADO */}
        <Animated.View
          style={[
            styles.animatedTitleContainer,
            {
              transform: [
                { translateY: titleTranslateY },
                { translateX: titleTranslateX },
                { scale: titleScale },
              ],
            },
          ]}
        >
          <Text style={styles.mainTitle}>Mi Perfil</Text>
        </Animated.View>

        <Text style={styles.subHeader}>Gestiona tu cuenta y preferencias</Text>


        <View style={styles.card}>
          <View style={styles.userRow}>
            <Image
              source={{
                uri: user.avatar || 'https://cdn-icons-png.flaticon.com/512/6596/6596121.png'
              }}
              style={styles.avatar}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.userName}>{user.name} {user.lastName}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              {user.phone && <Text style={styles.userPhone}>📞 {user.phone}</Text>}
              <Text style={styles.userSince}>Miembro desde {memberSince}</Text>
            </View>
          </View>
        </View>


        <View style={[styles.card, styles.primaryCard]}>
          <View style={styles.rowBetween}>
            <View style={styles.rowCenter}>
              <FontAwesome5 name="crown" size={18} color="#FFD700" />
              <Text style={styles.cardTitle}>  Mi Plan</Text>
            </View>
            <Text style={styles.badge}>Activo</Text>
          </View>

          <Text style={styles.label}>Plan Actual</Text>
          <Text style={styles.planText}>{planName}</Text>

          <Text style={styles.label}>Vigente hasta</Text>
          <Text style={styles.planText}>{planExpiry}</Text>

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => setShowPaymentModal(true)}>
            <Ionicons name="card" size={18} color="#fff" />
            <Text style={styles.primaryButtonText}> Renovar / Pagar Plan</Text>
          </TouchableOpacity>
        </View>


        <View style={styles.card}>
          <Text style={styles.cardTitle}>Pagos</Text>
          <TouchableOpacity style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="receipt" size={20} color="#84c217" />
              </View>
              <Text style={styles.optionText}>Ver historial de pagos</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>


        <View style={styles.card}>
          <Text style={styles.cardTitle}>Cuenta</Text>

          <TouchableOpacity style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="person" size={20} color="#84c217" />
              </View>
              <Text style={styles.optionText}>Editar Información Personal</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionRow}>
            <View style={styles.optionLeft}>
              <View style={styles.iconContainer}>
                <Ionicons name="lock-closed" size={20} color="#84c217" />
              </View>
              <Text style={styles.optionText}>Cambiar Contraseña</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>


        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out" size={18} color="#fff" />
          <Text style={styles.logoutText}> Cerrar Sesión</Text>
        </TouchableOpacity>
      </Animated.ScrollView>


      <Modal visible={showPaymentModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Renovar Plan</Text>
            <Text style={styles.modalDescription}>
              Esta función aún no está implementada. Conecta tu endpoint de pagos para habilitarla.
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
  container: { flex: 1, backgroundColor: '#000000ff' },

  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: '#111',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 12,
    zIndex: 10,
    borderBottomColor: '#1a1a1a',
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },

  animatedTitleContainer: {
    alignItems: 'flex-start',
    marginLeft: 20,
    marginBottom: 5,
  },
  mainTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#fff',
  },

  subHeader: {
    color: '#666',
    marginBottom: 20,
    marginLeft: 20,
  },

  card: {
    backgroundColor: '#1a1f26',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  primaryCard: { backgroundColor: '#1d281d', borderColor: '#557a1e', borderWidth: 1 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  badge: {
    backgroundColor: '#84c217',
    color: '#fff',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 12,
  },
  label: { fontSize: 12, color: '#777', marginTop: 10 },
  planText: { fontSize: 16, fontWeight: '500', color: '#fff' },
  primaryButton: {
    backgroundColor: '#84c217',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 80, height: 80, borderRadius: 40 },
  userName: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  userEmail: { color: '#777', fontSize: 14 },
  userPhone: { color: '#777', fontSize: 13 },
  userSince: { fontSize: 12, color: '#777', marginTop: 4 },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8, color: '#fff' },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  optionLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  optionText: { fontSize: 15, color: '#fff' },
  iconContainer: {
    width: 36,
    height: 36,
    backgroundColor: '#414b51',
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
    marginHorizontal: 20,
    marginBottom: 40,
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