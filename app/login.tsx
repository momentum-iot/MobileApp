import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function LoginScreen() {
  const router = useRouter(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (email && password) {
      
      router.replace('/(tabs)'); 
    } else {
      Alert.alert('Campos incompletos', 'Por favor, ingresa tu correo y contraseña.');
    }
  };

  const handleRecoverPassword = () => {
    Alert.alert('Recuperar contraseña', 'Esta función aún no está implementada.');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>
      <View style={styles.inner}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Ionicons name="barbell" size={50} color="#fff" />
          </View>
          <Text style={styles.title}>PumpUp</Text>
          <Text style={styles.subtitle}>Bienvenido de vuelta</Text>
        </View>

        {/* Inputs */}
        <View style={styles.form}>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="tu@email.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Ingresar</Text>
          </TouchableOpacity>
        </View>

        {/* Opciones extra */}
        <View style={styles.extraOptions}>
          <TouchableOpacity onPress={handleRecoverPassword}>
            <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.linkMuted}>
              ¿No tienes cuenta? <Text style={styles.link}>Regístrate</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inner: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoBox: {
    backgroundColor: '#007AFF',
    width: 100,
    height: 100,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#000', marginTop: 20 },
  subtitle: { fontSize: 16, color: '#666' },
  form: { marginBottom: 20 },
  label: { color: '#333', marginBottom: 6, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  extraOptions: { alignItems: 'center', marginTop: 10 },
  link: { color: '#007AFF', fontWeight: '500' },
  linkMuted: { color: '#666' },
});
