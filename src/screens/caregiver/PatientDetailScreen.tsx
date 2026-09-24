import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ArrowLeft, Users, Brain, Bell, Clock, Activity, CheckCircle } from 'lucide-react-native';
import { HeaderBar } from '../../components/HeaderBar';
import { SectionHeader } from '../../components/SectionHeader';
import { SecondaryButton } from '../../components/SecondaryButton';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { useData } from '../../context/DataContext';

export const PatientDetailScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { gameSessions } = useData();
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar />
      <ScrollView contentContainerStyle={styles.container}>
        <SecondaryButton
          title="Back to Caregiver Dashboard"
          icon={ArrowLeft}
          onPress={() => navigation.goBack()}
          style={{ marginBottom: 16 }}
        />

        <SectionHeader
          title={`Patient Details`}
          subtitle="Comprehensive activity history and task performance"
        />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Performance Overview</Text>
          <View style={styles.graphContainer}>
            {['memory_recall', 'pattern_sequence', 'category_sorting', 'math_puzzles'].map((type) => {
              const sessions = gameSessions.filter(s => s.gameType === type);
              const avg = sessions.length > 0 
                ? Math.round(sessions.reduce((a, b) => a + b.score, 0) / sessions.length) 
                : 0;
              
              let label = 'Mem';
              let color = COLORS.primary;
              if (type === 'pattern_sequence') { label = 'Pat'; color = COLORS.primaryTeal; }
              if (type === 'category_sorting') { label = 'Cat'; color = COLORS.info; }
              if (type === 'math_puzzles') { label = 'Math'; color = COLORS.success; }

              return (
                <View key={type} style={styles.barWrapper}>
                  <Text style={styles.barLabel}>{avg}%</Text>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { height: `${avg}%`, backgroundColor: color }]} />
                  </View>
                  <Text style={styles.barLabel}>{label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        <View style={[styles.card, { marginTop: 16 }]}>
          <Text style={styles.cardTitle}>Recent Game Sessions</Text>
          {gameSessions.map((session) => (
            <View key={session.id} style={styles.sessionItem}>
              <View style={styles.sessionIconBadge}>
                <Brain size={20} color={COLORS.primary} />
              </View>
              <View style={styles.sessionMeta}>
                <Text style={styles.sessionType}>
                  {session.gameType === 'memory_recall' ? 'Memory Recall' :
                   session.gameType === 'pattern_sequence' ? 'Pattern Sequence' :
                   session.gameType === 'category_sorting' ? 'Category Sorting' :
                   'Math Puzzles'}
                </Text>
                <Text style={styles.sessionSub}>
                  Difficulty Level {session.difficultyLevel} • Response Time: {(session.responseTimeMs / 1000).toFixed(1)}s
                </Text>
              </View>
              <View style={styles.scoreBadge}>
                <Text style={styles.scoreText}>{session.score}%</Text>
              </View>
            </View>
          ))}
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
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
  },
  cardTitle: {
    ...TYPOGRAPHY.titleSmall,
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  graphContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 160,
    marginTop: 8,
    paddingHorizontal: 8,
  },
  barWrapper: {
    alignItems: 'center',
    width: 40,
  },
  barTrack: {
    width: 24,
    height: 100,
    backgroundColor: COLORS.cardBorder,
    borderRadius: 12,
    justifyContent: 'flex-end',
    overflow: 'hidden',
    marginVertical: 8,
  },
  barFill: {
    width: '100%',
    borderRadius: 12,
  },
  barLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    fontSize: 11,
  },
  sessionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
    gap: 12,
  },
  sessionIconBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.infoBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sessionMeta: {
    flex: 1,
  },
  sessionType: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
  },
  sessionSub: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  scoreBadge: {
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.successBorder,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.success,
  },
});
