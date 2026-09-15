import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Brain, ShieldCheck, Mail, Lock } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { PrimaryButton } from '../../components/PrimaryButton';
import { SecondaryButton } from '../../components/SecondaryButton';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

export const LoginScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter email and password");
      return;
    }
    try {
      setLoading(true);
      await login(email, password);
    } catch (e: any) {
      Alert.alert("Error", e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <Brain size={48} color={COLORS.primary} />
          </View>
          <Text style={styles.appTitle}>CogniCare</Text>
          <Text style={styles.appTagline}>
            AI-Based Cognitive Gaming & Memory Assistance Platform
          </Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.sectionHeader}>Login to your account</Text>
          
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
            <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 12 }} />
          ) : (
            <PrimaryButton
              title="Log In"
              onPress={handleLogin}
              variant="primary"
              style={{ marginTop: 12 }}
            />
          )}

          <SecondaryButton
            title="Create an Account"
            onPress={() => navigation.navigate('Register')}
            style={{ marginTop: 12, borderWidth: 0 }}
          />
        </View>

        <View style={styles.noticeContainer}>
          <ShieldCheck size={20} color={COLORS.textMuted} />
          <Text style={styles.noticeText}>
            CogniCare does not provide medical diagnoses or predict disease conditions.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 20, justifyContent: 'center', minHeight: '100%' },
  brandContainer: { alignItems: 'center', marginVertical: 24 },
  logoBadge: {
    width: 84, height: 84, borderRadius: 24, backgroundColor: COLORS.infoBg,
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
  },
  appTitle: { ...TYPOGRAPHY.titleLarge, fontSize: 32, color: COLORS.primary },
  appTagline: {
    ...TYPOGRAPHY.bodyMedium, color: COLORS.textSecondary,
    textAlign: 'center', marginTop: 6, paddingHorizontal: 20,
  },
  formContainer: { marginVertical: 12 },
  sectionHeader: {
    ...TYPOGRAPHY.titleSmall, color: COLORS.textSecondary, textAlign: 'center', marginBottom: 16,
  },
  inputGroup: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: COLORS.cardBg, borderWidth: 1, borderColor: COLORS.cardBorder,
    borderRadius: 12, paddingHorizontal: 12, marginBottom: 16,
  },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, paddingVertical: 14, ...TYPOGRAPHY.bodyLarge, color: COLORS.textPrimary },
  noticeContainer: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: COLORS.cardHover, padding: 14, borderRadius: 14, marginTop: 12,
  },
  noticeText: { ...TYPOGRAPHY.caption, color: COLORS.textMuted, flex: 1 },
});
