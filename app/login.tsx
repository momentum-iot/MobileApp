import { useAuth } from '@/src/presentation/context/AuthContext';
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
  ActivityIndicator,
} from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Campos incompletos', 'Por favor, ingresa tu correo y contraseña.');
      return;
    }

    setIsLoading(true);

    try {
      await login(email, password);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert(
        'Error de inicio de sesión',
        error.message || 'Verifica tus credenciales e intenta de nuevo.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecoverPassword = () => {
    Alert.alert('Recuperar contraseña', 'Esta función aún no está implementada.');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.inner}>
        
        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Ionicons name="barbell" size={50} color="#000000ff" />
          </View>
          <Text style={styles.title}>PumpUp</Text>
          <Text style={styles.subtitle}>Bienvenido de vuelta</Text>
        </View>

        
        <View style={styles.form}>
          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            placeholder="tu@email.com"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            editable={!isLoading}
          />

          <Text style={styles.label}>Contraseña</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#999"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            editable={!isLoading}
          />

          <TouchableOpacity
            style={[styles.button, isLoading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Ingresar</Text>
            )}
          </TouchableOpacity>
        </View>

        
        <View style={styles.extraOptions}>
          <TouchableOpacity onPress={handleRecoverPassword} disabled={isLoading}>
            <Text style={styles.link}>¿Olvidaste tu contraseña?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000ff',
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
    backgroundColor: '#84c217',
    width: 100,
    height: 100,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontSize: 28, fontWeight: 'normal', color: '#ffffffff', marginTop: 20 },
  subtitle: { fontSize: 16, color: '#666' },
  form: { marginBottom: 20 },
  label: { color: '#fff', marginBottom: 6, fontWeight: '500' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    color: '#ffffffff',
  },
  button: {
    backgroundColor: '#84c217',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: { color: '#000000ff', fontWeight: '600', fontSize: 16 },
  extraOptions: { alignItems: 'center', marginTop: 10 },
  link: { color: '#84c217', fontWeight: '500' },
  linkMuted: { color: '#666' },
});