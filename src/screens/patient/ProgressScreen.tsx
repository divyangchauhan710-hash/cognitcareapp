import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { TrendingUp, ArrowLeft, Brain, Activity, CheckCircle, Clock, Layers, Calculator } from 'lucide-react-native';
import { HeaderBar } from '../../components/HeaderBar';
import { StatCard } from '../../components/StatCard';
import { SectionHeader } from '../../components/SectionHeader';
import { SecondaryButton } from '../../components/SecondaryButton';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { useData } from '../../context/DataContext';

export const ProgressScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { gameSessions, analytics } = useData();
  
  const totalSessionsCompleted = gameSessions.length;
  const totalDurationMinutes = Math.round(
    gameSessions.reduce((acc, curr) => acc + (curr.responseTimeMs || 0), 0) / 60000
  );

  const calculateAverageForGame = (gameType: string) => {
    const sessions = gameSessions.filter(s => s.gameType === gameType);
    if (sessions.length === 0) return 0;
    const totalScore = sessions.reduce((acc, curr) => acc + (curr.score || 0), 0);
    return Math.round(totalScore / sessions.length);
  };

  const memoryTaskPerformance = calculateAverageForGame('memory_recall');
  const patternTaskPerformance = calculateAverageForGame('pattern_sequence');
  const categoryTaskPerformance = calculateAverageForGame('category_sorting');
  const mathTaskPerformance = calculateAverageForGame('math_puzzles');

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
            value={totalSessionsCompleted.toString()}
            icon={CheckCircle}
            variant="primary"
          />
          <StatCard
            label="Total Duration"
            value={totalDurationMinutes.toString()}
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
            <Text style={styles.metricVal}>{memoryTaskPerformance}%</Text>
          </View>

          <View style={[styles.metricRow, { marginTop: 16 }]}>
            <Activity size={24} color={COLORS.primaryTeal} />
            <Text style={styles.metricLabel}>Pattern Sequence Performance</Text>
            <Text style={styles.metricVal}>{patternTaskPerformance}%</Text>
          </View>

          <View style={[styles.metricRow, { marginTop: 16 }]}>
            <Layers size={24} color={COLORS.info} />
            <Text style={styles.metricLabel}>Category Sorting Performance</Text>
            <Text style={styles.metricVal}>{categoryTaskPerformance}%</Text>
          </View>

          <View style={[styles.metricRow, { marginTop: 16 }]}>
            <Calculator size={24} color={COLORS.success} />
            <Text style={styles.metricLabel}>Math Puzzles Performance</Text>
            <Text style={styles.metricVal}>{mathTaskPerformance}%</Text>
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
