import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';
import { useAuth } from '@/src/presentation/context/AuthContext';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: '',
    birthday: new Date(),
    age: '',
    emergencyContact: '',
    height: '',
    weight: '',
  });

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const calculateAge = (birthday: Date): number => {
    const today = new Date();
    let age = today.getFullYear() - birthday.getFullYear();
    const monthDiff = today.getMonth() - birthday.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
      age--;
    }
    return age;
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleChange('birthday', selectedDate);
      const calculatedAge = calculateAge(selectedDate);
      handleChange('age', calculatedAge.toString());
    }
  };

  const validateStep1 = (): string | null => {
    if (!formData.name.trim()) return 'El nombre es requerido';
    if (!formData.lastName.trim()) return 'El apellido es requerido';
    if (!formData.email.trim()) return 'El correo es requerido';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return 'Correo inválido';
    if (!formData.phone.trim()) return 'El teléfono es requerido';
    if (!formData.password) return 'La contraseña es requerida';
    if (formData.password.length < 6) return 'La contraseña debe tener al menos 6 caracteres';
    if (formData.password !== formData.confirmPassword) return 'Las contraseñas no coinciden';
    return null;
  };

  const validateStep2 = (): string | null => {
    if (!formData.gender) return 'Selecciona tu género';
    const age = parseInt(formData.age);
    if (!formData.age || isNaN(age) || age < 13 || age > 120) {
      return 'La edad debe estar entre 13 y 120 años';
    }
    return null;
  };

  const validateStep3 = (): string | null => {
    if (!formData.emergencyContact.trim()) return 'El contacto de emergencia es requerido';
    const height = parseFloat(formData.height);
    if (!formData.height || isNaN(height) || height < 50 || height > 300) {
      return 'La altura debe estar entre 50 y 300 cm';
    }
    const weight = parseFloat(formData.weight);
    if (!formData.weight || isNaN(weight) || weight < 20 || weight > 500) {
      return 'El peso debe estar entre 20 y 500 kg';
    }
    return null;
  };

  const handleNext = () => {
    let error = null;

    if (currentStep === 1) error = validateStep1();
    else if (currentStep === 2) error = validateStep2();

    if (error) {
      Alert.alert('Error de validación', error);
      return;
    }

    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.back();
    }
  };

  const handleRegister = async () => {
    const error = validateStep3();
    if (error) {
      Alert.alert('Error de validación', error);
      return;
    }

    setIsLoading(true);

    try {
      const birthdayISO = formData.birthday.toISOString().split('T')[0];

      await register({
        name: formData.name.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone: formData.phone.trim(),
        gender: formData.gender,
        age: parseInt(formData.age),
        birthday: birthdayISO,
        emergencyContact: formData.emergencyContact.trim(),
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
      });

      Alert.alert('¡Registro exitoso!', 'Tu cuenta ha sido creada correctamente.', [
        { text: 'Continuar', onPress: () => router.replace('/(tabs)') },
      ]);
    } catch (error: any) {
      Alert.alert('Error en el registro', error.message || 'Ocurrió un error. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderProgressBar = () => (
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${(currentStep / 3) * 100}%` }]} />
      </View>
      <Text style={styles.progressText}>
        Paso {currentStep} de 3
      </Text>
    </View>
  );

  const renderStep1 = () => (
    <View>
      <Text style={styles.stepTitle}>Información de Cuenta</Text>

      <Text style={styles.label}>Nombre *</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Juan"
          value={formData.name}
          onChangeText={(v) => handleChange('name', v)}
          autoCapitalize="words"
        />
      </View>

      <Text style={styles.label}>Apellido *</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#999" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Pérez"
          value={formData.lastName}
          onChangeText={(v) => handleChange('lastName', v)}
          autoCapitalize="words"
        />
      </View>

      <Text style={styles.label}>Correo electrónico *</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#999" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="tu@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          value={formData.email}
          onChangeText={(v) => handleChange('email', v)}
        />
      </View>

      <Text style={styles.label}>Teléfono *</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="call-outline" size={20} color="#999" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="+51 999 999 999"
          keyboardType="phone-pad"
          value={formData.phone}
          onChangeText={(v) => handleChange('phone', v)}
        />
      </View>

      <Text style={styles.label}>Contraseña *</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Mínimo 6 caracteres"
          secureTextEntry={!showPassword}
          value={formData.password}
          onChangeText={(v) => handleChange('password', v)}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Ionicons name={showPassword ? 'eye-outline' : 'eye-off-outline'} size={20} color="#999" />
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Confirmar contraseña *</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed-outline" size={20} color="#999" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Repite tu contraseña"
          secureTextEntry={!showConfirmPassword}
          value={formData.confirmPassword}
          onChangeText={(v) => handleChange('confirmPassword', v)}
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          style={styles.eyeIcon}
        >
          <Ionicons
            name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
            size={20}
            color="#999"
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text style={styles.stepTitle}>Información Personal</Text>

      <Text style={styles.label}>Género *</Text>
      <View style={styles.genderContainer}>
        {['Masculino', 'Femenino', 'Otro'].map((gender) => (
          <TouchableOpacity
            key={gender}
            style={[styles.genderButton, formData.gender === gender && styles.genderButtonActive]}
            onPress={() => handleChange('gender', gender)}
          >
            <Text
              style={[styles.genderText, formData.gender === gender && styles.genderTextActive]}
            >
              {gender}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Fecha de nacimiento *</Text>
      <TouchableOpacity style={styles.inputContainer} onPress={() => setShowDatePicker(true)}>
        <Ionicons name="calendar-outline" size={20} color="#999" style={styles.inputIcon} />
        <Text style={styles.dateText}>{formData.birthday.toLocaleDateString('es-ES')}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={formData.birthday}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}

      <Text style={styles.label}>Edad *</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="time-outline" size={20} color="#999" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Años"
          keyboardType="numeric"
          value={formData.age}
          onChangeText={(v) => handleChange('age', v)}
        />
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text style={styles.stepTitle}>Información de Salud</Text>

      <Text style={styles.label}>Contacto de emergencia *</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="call-outline" size={20} color="#999" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="+51 999 888 777"
          keyboardType="phone-pad"
          value={formData.emergencyContact}
          onChangeText={(v) => handleChange('emergencyContact', v)}
        />
      </View>

      <Text style={styles.label}>Altura (cm) *</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="resize-outline" size={20} color="#999" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="170"
          keyboardType="decimal-pad"
          value={formData.height}
          onChangeText={(v) => handleChange('height', v)}
        />
        <Text style={styles.unitText}>cm</Text>
      </View>

      <Text style={styles.label}>Peso (kg) *</Text>
      <View style={styles.inputContainer}>
        <Ionicons name="fitness-outline" size={20} color="#999" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="70"
          keyboardType="decimal-pad"
          value={formData.weight}
          onChangeText={(v) => handleChange('weight', v)}
        />
        <Text style={styles.unitText}>kg</Text>
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >

        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack} disabled={isLoading}>
            <Ionicons name="arrow-back" size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>


        <View style={styles.logoContainer}>
          <View style={styles.logoBox}>
            <Ionicons name="barbell" size={40} color="#fff" />
          </View>
          <Text style={styles.title}>Crear Cuenta</Text>
          <Text style={styles.subtitle}>Únete a PumpUp</Text>
        </View>


        {renderProgressBar()}


        <View style={styles.form}>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </View>


        <View style={styles.buttonContainer}>
          {currentStep < 3 ? (
            <TouchableOpacity style={styles.button} onPress={handleNext}>
              <Text style={styles.buttonText}>Siguiente</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="#fff" />
                  <Text style={styles.buttonText}> Crear Cuenta</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </View>


        {currentStep === 1 && (
          <View style={styles.footer}>
            <TouchableOpacity onPress={() => router.back()} disabled={isLoading}>
              <Text style={styles.linkMuted}>
                ¿Ya tienes cuenta? <Text style={styles.link}>Inicia sesión</Text>
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { flexGrow: 1, padding: 24 },
  header: { marginBottom: 10 },
  backButton: { width: 40, height: 40, justifyContent: 'center' },
  logoContainer: { alignItems: 'center', marginBottom: 24 },
  logoBox: {
    backgroundColor: '#007AFF',
    width: 70,
    height: 70,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: { fontSize: 24, fontWeight: 'bold', color: '#000', marginTop: 12 },
  subtitle: { fontSize: 14, color: '#666' },
  progressContainer: { marginBottom: 24 },
  progressBar: {
    height: 6,
    backgroundColor: '#E5E5E5',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#007AFF' },
  progressText: { textAlign: 'center', color: '#666', fontSize: 12, marginTop: 8 },
  stepTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#000' },
  form: { marginBottom: 20 },
  label: { color: '#333', marginBottom: 8, fontWeight: '500', fontSize: 14 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, padding: 12, color: '#000', fontSize: 15 },
  eyeIcon: { padding: 8 },
  unitText: { color: '#999', fontSize: 14, marginLeft: 8 },
  dateText: { flex: 1, padding: 12, color: '#000', fontSize: 15 },
  genderContainer: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  genderButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    alignItems: 'center',
  },
  genderButtonActive: { backgroundColor: '#007AFF', borderColor: '#007AFF' },
  genderText: { color: '#666', fontWeight: '500' },
  genderTextActive: { color: '#fff' },
  buttonContainer: { marginBottom: 16 },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
  footer: { alignItems: 'center', marginTop: 12 },
  link: { color: '#007AFF', fontWeight: '500' },
  linkMuted: { color: '#666', fontSize: 14 },
});