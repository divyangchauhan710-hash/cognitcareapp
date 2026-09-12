import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { ArrowLeft, Users, Brain, Bell, Clock, Activity, CheckCircle } from 'lucide-react-native';
import { HeaderBar } from '../../components/HeaderBar';
import { SectionHeader } from '../../components/SectionHeader';
import { SecondaryButton } from '../../components/SecondaryButton';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { DEMO_PATIENT, INITIAL_PERFORMANCE, INITIAL_GAME_SESSIONS } from '../../constants/demoData';

export const PatientDetailScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
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
          title={`Patient Details — ${DEMO_PATIENT.name}`}
          subtitle="Comprehensive activity history and task performance"
        />

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Recent Game Sessions</Text>
          {INITIAL_GAME_SESSIONS.map((session) => (
            <View key={session.id} style={styles.sessionItem}>
              <View style={styles.sessionIconBadge}>
                <Brain size={20} color={COLORS.primary} />
              </View>
              <View style={styles.sessionMeta}>
                <Text style={styles.sessionType}>
                  {session.gameType === 'memory_recall' ? 'Memory Recall' : 'Attention Task'}
                </Text>
                <Text style={styles.sessionSub}>
                  Difficulty Level {session.difficultyLevel} • Response Time: {session.responseTimeMs / 1000}s
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
