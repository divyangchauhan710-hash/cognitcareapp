import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { TrendingUp, ArrowLeft, Brain, Activity, CheckCircle, Clock } from 'lucide-react-native';
import { HeaderBar } from '../../components/HeaderBar';
import { StatCard } from '../../components/StatCard';
import { SectionHeader } from '../../components/SectionHeader';
import { SecondaryButton } from '../../components/SecondaryButton';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { INITIAL_PERFORMANCE } from '../../constants/demoData';

export const ProgressScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar />
      <ScrollView contentContainerStyle={styles.container}>
        <SecondaryButton
          title="Back to Home"
          icon={ArrowLeft}
          onPress={() => navigation.goBack()}
          style={{ marginBottom: 16 }}
        />

        <SectionHeader
          title="Training Progress"
          subtitle="Your task-level performance over time"
        />

        <View style={styles.statsRow}>
          <StatCard
            label="Total Sessions"
            value={INITIAL_PERFORMANCE.totalSessionsCompleted}
            icon={CheckCircle}
            variant="primary"
          />
          <StatCard
            label="Total Duration"
            value={INITIAL_PERFORMANCE.totalDurationMinutes}
            unit="min"
            icon={Clock}
            variant="teal"
          />
        </View>

        <SectionHeader title="Task Performance Breakdown" />

        <View style={styles.card}>
          <View style={styles.metricRow}>
            <Brain size={24} color={COLORS.primary} />
            <Text style={styles.metricLabel}>Memory Task Performance</Text>
            <Text style={styles.metricVal}>{INITIAL_PERFORMANCE.memoryTaskPerformance}%</Text>
          </View>

          <View style={[styles.metricRow, { marginTop: 16 }]}>
            <Activity size={24} color={COLORS.primaryTeal} />
            <Text style={styles.metricLabel}>Attention Task Performance</Text>
            <Text style={styles.metricVal}>{INITIAL_PERFORMANCE.attentionTaskPerformance}%</Text>
          </View>

          <View style={[styles.metricRow, { marginTop: 16 }]}>
            <TrendingUp size={24} color={COLORS.success} />
            <Text style={styles.metricLabel}>Recall Task Performance</Text>
            <Text style={styles.metricVal}>{INITIAL_PERFORMANCE.recallPerformance}%</Text>
          </View>
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
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 20,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
  },
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  metricLabel: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
    flex: 1,
  },
  metricVal: {
    ...TYPOGRAPHY.titleSmall,
    color: COLORS.textPrimary,
  },
});
