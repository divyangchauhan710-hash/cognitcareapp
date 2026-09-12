import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Brain, User, Users, ShieldCheck, ArrowRight } from 'lucide-react-native';
import { useAuth } from '../../context/AuthContext';
import { PrimaryButton } from '../../components/PrimaryButton';
import { SecondaryButton } from '../../components/SecondaryButton';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { DEMO_PATIENT, DEMO_CAREGIVER } from '../../constants/demoData';

export const LoginScreen: React.FC = () => {
  const { loginAsPatient, loginAsCaregiver } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Brand Header */}
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <Brain size={48} color={COLORS.primary} />
          </View>
          <Text style={styles.appTitle}>CogniCare</Text>
          <Text style={styles.appTagline}>
            AI-Based Cognitive Gaming & Memory Assistance Platform
          </Text>
        </View>

        {/* Demo Account Cards */}
        <View style={styles.cardContainer}>
          <Text style={styles.sectionHeader}>Select Demo Role to Continue</Text>

          {/* Patient Card */}
          <View style={styles.demoCard}>
            <View style={styles.cardHeader}>
              <View style={styles.patientBadge}>
                <User size={28} color={COLORS.primary} />
              </View>
              <View style={styles.cardHeaderInfo}>
                <Text style={styles.cardRoleLabel}>Patient Mode</Text>
                <Text style={styles.cardUserName}>{DEMO_PATIENT.name}</Text>
                <Text style={styles.cardUserMeta}>Age: {DEMO_PATIENT.age} • High Contrast UI</Text>
              </View>
            </View>
            <Text style={styles.cardDescription}>
              Simple, high-contrast interface designed for cognitive training, daily reminders, and personal memory recall.
            </Text>
            <PrimaryButton
              title="Enter as Patient (Rita Devi)"
              icon={ArrowRight}
              variant="primary"
              onPress={loginAsPatient}
              style={{ marginTop: 12 }}
            />
          </View>

          {/* Caregiver Card */}
          <View style={[styles.demoCard, styles.caregiverDemoCard]}>
            <View style={styles.cardHeader}>
              <View style={styles.caregiverBadge}>
                <Users size={28} color={COLORS.caregiverPrimary} />
              </View>
              <View style={styles.cardHeaderInfo}>
                <Text style={styles.cardRoleLabel}>Caregiver Mode</Text>
                <Text style={styles.cardUserName}>{DEMO_CAREGIVER.name}</Text>
                <Text style={styles.cardUserMeta}>Monitoring & Memory Management</Text>
              </View>
            </View>
            <Text style={styles.cardDescription}>
              Caregiver dashboard for monitoring task performance trends, creating memory bank items, and scheduling reminders.
            </Text>
            <PrimaryButton
              title="Enter as Caregiver"
              icon={ArrowRight}
              variant="caregiver"
              onPress={loginAsCaregiver}
              style={{ marginTop: 12 }}
            />
          </View>
        </View>

        {/* Ethics & Non-Medical Notice */}
        <View style={styles.noticeContainer}>
          <ShieldCheck size={20} color={COLORS.textMuted} />
          <Text style={styles.noticeText}>
            CogniCare is a cognitive assistance and memory training platform. It does not provide medical diagnoses or predict disease conditions.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    padding: 20,
    justifyContent: 'center',
    minHeight: '100%',
  },
  brandContainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  logoBadge: {
    width: 84,
    height: 84,
    borderRadius: 24,
    backgroundColor: COLORS.infoBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  appTitle: {
    ...TYPOGRAPHY.titleLarge,
    fontSize: 32,
    color: COLORS.primary,
  },
  appTagline: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20,
  },
  cardContainer: {
    marginVertical: 12,
  },
  sectionHeader: {
    ...TYPOGRAPHY.titleSmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  demoCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  caregiverDemoCard: {
    borderColor: COLORS.caregiverLight,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
  },
  patientBadge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.infoBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  caregiverBadge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: COLORS.caregiverLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHeaderInfo: {
    flex: 1,
  },
  cardRoleLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    textTransform: 'uppercase',
  },
  cardUserName: {
    ...TYPOGRAPHY.titleMedium,
    color: COLORS.textPrimary,
  },
  cardUserMeta: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
  },
  cardDescription: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  noticeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.cardHover,
    padding: 14,
    borderRadius: 14,
    marginTop: 12,
  },
  noticeText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    flex: 1,
  },
});
