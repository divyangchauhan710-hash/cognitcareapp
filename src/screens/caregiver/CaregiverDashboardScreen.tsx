import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import {
  Users,
  Brain,
  Bell,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronRight,
  Activity,
} from 'lucide-react-native';
import { HeaderBar } from '../../components/HeaderBar';
import { StatCard } from '../../components/StatCard';
import { SectionHeader } from '../../components/SectionHeader';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { INITIAL_PERFORMANCE, DEMO_PATIENT } from '../../constants/demoData';
import { useData } from '../../context/DataContext';

interface CaregiverDashboardScreenProps {
  navigation: any;
}

export const CaregiverDashboardScreen: React.FC<CaregiverDashboardScreenProps> = ({ navigation }) => {
  const { reminders, memories } = useData();

  const completedReminders = reminders.filter((r) => r.status === 'completed').length;
  const missedReminders = reminders.filter((r) => r.status === 'missed').length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Caregiver Header Card */}
        <View style={styles.caregiverHeaderCard}>
          <View style={styles.patientAvatarBadge}>
            <Users size={28} color={COLORS.caregiverPrimary} />
          </View>
          <View style={styles.patientHeaderInfo}>
            <Text style={styles.patientName}>{DEMO_PATIENT.name}</Text>
            <Text style={styles.patientMeta}>
              Age: {DEMO_PATIENT.age} • Status: Active Training
            </Text>
          </View>
          <View style={styles.trendBadge}>
            <TrendingUp size={16} color={COLORS.success} />
            <Text style={styles.trendBadgeText}>Improving</Text>
          </View>
        </View>

        {/* Active Alert Notification */}
        <View style={styles.alertCard}>
          <AlertTriangle size={22} color={COLORS.warning} />
          <View style={styles.alertTextContainer}>
            <Text style={styles.alertTitle}>Activity Summary</Text>
            <Text style={styles.alertBody}>
              Rita completed 2 cognitive sessions today. {completedReminders} of {reminders.length} reminders completed.
            </Text>
          </View>
        </View>

        {/* Today's Activity Summary */}
        <SectionHeader
          title="Today's Activity"
          subtitle="Real-time session monitoring"
        />
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard
              label="Games Done"
              value="2"
              icon={CheckCircle}
              variant="caregiver"
            />
            <StatCard
              label="Duration"
              value="14"
              unit="min"
              icon={Clock}
              variant="neutral"
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              label="Avg Accuracy"
              value="82"
              unit="%"
              icon={Activity}
              variant="teal"
            />
            <StatCard
              label="Reminders"
              value={`${completedReminders}/${reminders.length}`}
              icon={Bell}
              variant="primary"
            />
          </View>
        </View>

        {/* Cognitive Task Performance Profile */}
        <SectionHeader
          title="Cognitive Performance"
          subtitle="Task-level training metrics (non-diagnostic)"
        />
        <View style={styles.performanceCard}>
          <View style={styles.perfRow}>
            <View style={styles.perfLabelContainer}>
              <Brain size={20} color={COLORS.primary} />
              <Text style={styles.perfLabel}>Memory Task Performance</Text>
            </View>
            <Text style={styles.perfValue}>
              {INITIAL_PERFORMANCE.memoryTaskPerformance}%
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${INITIAL_PERFORMANCE.memoryTaskPerformance}%`,
                  backgroundColor: COLORS.primary,
                },
              ]}
            />
          </View>

          <View style={[styles.perfRow, { marginTop: 16 }]}>
            <View style={styles.perfLabelContainer}>
              <Activity size={20} color={COLORS.primaryTeal} />
              <Text style={styles.perfLabel}>Attention Task Performance</Text>
            </View>
            <Text style={styles.perfValue}>
              {INITIAL_PERFORMANCE.attentionTaskPerformance}%
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${INITIAL_PERFORMANCE.attentionTaskPerformance}%`,
                  backgroundColor: COLORS.primaryTeal,
                },
              ]}
            />
          </View>

          <View style={[styles.perfRow, { marginTop: 16 }]}>
            <View style={styles.perfLabelContainer}>
              <Users size={20} color={COLORS.caregiverPrimary} />
              <Text style={styles.perfLabel}>Recognition Performance</Text>
            </View>
            <Text style={styles.perfValue}>
              {INITIAL_PERFORMANCE.recognitionPerformance}%
            </Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${INITIAL_PERFORMANCE.recognitionPerformance}%`,
                  backgroundColor: COLORS.caregiverPrimary,
                },
              ]}
            />
          </View>

          <Text style={styles.disclaimerNote}>
            Note: Cognitive metrics describe task training performance only and do not provide medical diagnosis.
          </Text>
        </View>

        {/* Caregiver Actions Navigation */}
        <SectionHeader title="Management & Tools" />
        
        <Pressable
          onPress={() => navigation.navigate('CaregiverMemoryBank')}
          style={({ pressed }) => [styles.actionLinkCard, pressed && styles.pressed]}
        >
          <View style={styles.actionIconBadge}>
            <Brain size={24} color={COLORS.caregiverPrimary} />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>
              Memory Bank Management ({memories.length} entries)
            </Text>
            <Text style={styles.actionSubtitle}>Add family members, stories & photos</Text>
          </View>
          <ChevronRight size={22} color={COLORS.textMuted} />
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('CaregiverReminders')}
          style={({ pressed }) => [styles.actionLinkCard, pressed && styles.pressed]}
        >
          <View style={styles.actionIconBadge}>
            <Bell size={24} color={COLORS.primaryTeal} />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>
              Reminder Management ({reminders.length} scheduled)
            </Text>
            <Text style={styles.actionSubtitle}>Schedule medicine, meals & appointments</Text>
          </View>
          <ChevronRight size={22} color={COLORS.textMuted} />
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('PatientDetails')}
          style={({ pressed }) => [styles.actionLinkCard, pressed && styles.pressed]}
        >
          <View style={styles.actionIconBadge}>
            <Users size={24} color={COLORS.primary} />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Detailed Patient Profile</Text>
            <Text style={styles.actionSubtitle}>View full session history & activity trends</Text>
          </View>
          <ChevronRight size={22} color={COLORS.textMuted} />
        </Pressable>
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
    padding: 16,
    paddingBottom: 32,
  },
  caregiverHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 18,
    borderWidth: 2,
    borderColor: COLORS.caregiverLight,
    gap: 12,
    marginVertical: 8,
  },
  patientAvatarBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.caregiverLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  patientHeaderInfo: {
    flex: 1,
  },
  patientName: {
    ...TYPOGRAPHY.titleMedium,
    color: COLORS.textPrimary,
  },
  patientMeta: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.successBg,
    borderColor: COLORS.successBorder,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  trendBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.success,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.warningBg,
    borderColor: COLORS.warningBorder,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginVertical: 8,
  },
  alertTextContainer: {
    flex: 1,
  },
  alertTitle: {
    ...TYPOGRAPHY.titleSmall,
    color: COLORS.warning,
  },
  alertBody: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  statsGrid: {
    gap: 8,
  },
  statsRow: {
    flexDirection: 'row',
  },
  performanceCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
  },
  perfRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  perfLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  perfLabel: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
  },
  perfValue: {
    ...TYPOGRAPHY.titleSmall,
    color: COLORS.textPrimary,
  },
  progressBarBg: {
    height: 12,
    backgroundColor: COLORS.background,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  disclaimerNote: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textMuted,
    marginTop: 16,
    fontStyle: 'italic',
  },
  actionLinkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    marginVertical: 6,
    gap: 14,
  },
  actionIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.caregiverLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    ...TYPOGRAPHY.titleSmall,
    color: COLORS.textPrimary,
  },
  actionSubtitle: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  pressed: {
    opacity: 0.88,
    backgroundColor: COLORS.cardHover,
  },
});
