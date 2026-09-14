import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, ActivityIndicator, Pressable } from 'react-native';
import { User, Mail, Lock, UserPlus, Users } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { PrimaryButton } from '../../components/PrimaryButton';
import { SecondaryButton } from '../../components/SecondaryButton';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

export const RegisterScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'patient' | 'caregiver'>('patient');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    try {
      setLoading(true);
      await register(name, email, password, role);
    } catch (e: any) {
      Alert.alert("Error", e.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join CogniCare today.</Text>
        </View>

        <View style={styles.roleSelector}>
          <Text style={styles.sectionHeader}>I am a...</Text>
          <View style={styles.roleButtons}>
            <Pressable 
              style={[styles.roleButton, role === 'patient' && styles.roleButtonActive]}
              onPress={() => setRole('patient')}
            >
              <User size={24} color={role === 'patient' ? COLORS.primary : COLORS.textSecondary} />
              <Text style={[styles.roleText, role === 'patient' && styles.roleTextActive]}>Patient</Text>
            </Pressable>
            
            <Pressable 
              style={[styles.roleButton, role === 'caregiver' && styles.roleButtonCaregiverActive]}
              onPress={() => setRole('caregiver')}
            >
              <Users size={24} color={role === 'caregiver' ? COLORS.caregiverPrimary : COLORS.textSecondary} />
              <Text style={[styles.roleText, role === 'caregiver' && { color: COLORS.caregiverPrimary }]}>Caregiver</Text>
            </Pressable>
          </View>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <UserPlus size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Mail size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email address"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputGroup}>
            <Lock size={20} color={COLORS.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {loading ? (
            <ActivityIndicator size="large" color={role === 'caregiver' ? COLORS.caregiverPrimary : COLORS.primary} style={{ marginVertical: 12 }} />
          ) : (
            <PrimaryButton
              title="Sign Up"
              onPress={handleRegister}
              variant={role === 'caregiver' ? 'caregiver' : 'primary'}
              style={{ marginTop: 12 }}
            />
          )}

          <SecondaryButton
            title="Already have an account? Log In"
            onPress={() => navigation.goBack()}
            style={{ marginTop: 12, borderWidth: 0 }}
          />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 20, justifyContent: 'center', minHeight: '100%' },
  headerContainer: { marginBottom: 24, alignItems: 'center' },
  title: { ...TYPOGRAPHY.titleLarge, fontSize: 28, color: COLORS.textPrimary },
  subtitle: { ...TYPOGRAPHY.bodyMedium, color: COLORS.textSecondary, marginTop: 4 },
  roleSelector: { marginBottom: 24 },
  sectionHeader: { ...TYPOGRAPHY.titleSmall, color: COLORS.textSecondary, marginBottom: 12, textAlign: 'center' },
  roleButtons: { flexDirection: 'row', gap: 12 },
  roleButton: { 
    flex: 1, padding: 16, borderRadius: 16, borderWidth: 2, borderColor: COLORS.cardBorder, 
    alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.cardBg 
  },
  roleButtonActive: { borderColor: COLORS.primary, backgroundColor: COLORS.infoBg },
  roleButtonCaregiverActive: { borderColor: COLORS.caregiverPrimary, backgroundColor: COLORS.caregiverLight },
  roleText: { ...TYPOGRAPHY.bodyLarge, color: COLORS.textSecondary, marginTop: 8 },
  roleTextActive: { color: COLORS.primary, fontWeight: '700' },
  formContainer: { marginVertical: 12 },
  inputGroup: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.cardBg, borderWidth: 1, borderColor: COLORS.cardBorder,
    borderRadius: 12, paddingHorizontal: 12, marginBottom: 16,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, paddingVertical: 14, ...TYPOGRAPHY.bodyLarge, color: COLORS.textPrimary },
});
