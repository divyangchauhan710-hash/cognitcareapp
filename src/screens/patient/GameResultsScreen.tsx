import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import {
  Award,
  Clock,
  CheckCircle,
  TrendingUp,
  Play,
  RotateCcw,
  Home,
  Brain,
  Activity,
} from 'lucide-react-native';
import { PrimaryButton } from '../../components/PrimaryButton';
import { SecondaryButton } from '../../components/SecondaryButton';
import { HeaderBar } from '../../components/HeaderBar';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

interface GameResultsScreenProps {
  navigation?: any;
  route?: {
    params?: {
      gameType: 'memory_recall' | 'attention';
      score: number;
      accuracy: number;
      responseTimeMs: number;
      correctAnswers: number;
      totalQuestions: number;
      previousDifficulty: number;
      nextDifficulty: number;
      feedbackMessage: string;
      recommendedGame: 'memory_recall' | 'attention';
    };
  };
}

export const GameResultsScreen: React.FC<GameResultsScreenProps> = ({
  navigation,
  route,
}) => {
  const {
    gameType = 'memory_recall',
    score = 85,
    accuracy = 85,
    responseTimeMs = 3200,
    correctAnswers = 5,
    totalQuestions = 6,
    previousDifficulty = 2,
    nextDifficulty = 3,
    feedbackMessage = 'Next activity adjusted to your recent performance.',
    recommendedGame = 'attention',
  } = route?.params || {};

  const responseTimeSec = (responseTimeMs / 1000).toFixed(1);

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Results Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.awardBadge}>
            <Award size={48} color={COLORS.primary} />
          </View>
          <Text style={styles.heroTitle}>Session Completed!</Text>
          <Text style={styles.heroSub}>
            {gameType === 'memory_recall' ? 'Memory Recall Training' : 'Attention Training'}
          </Text>

          <View style={styles.scoreContainer}>
            <Text style={styles.scoreValue}>{score}%</Text>
            <Text style={styles.scoreLabel}>Task Performance Score</Text>
          </View>
        </View>

        {/* Adaptive Personalization Feedback Card */}
        <View style={styles.adaptiveFeedbackCard}>
          <View style={styles.adaptiveBadge}>
            <TrendingUp size={22} color={COLORS.primaryTeal} />
            <Text style={styles.adaptiveTitle}>Adaptive Personalization</Text>
          </View>
          <Text style={styles.adaptiveMessage}>{feedbackMessage}</Text>
          <View style={styles.diffRow}>
            <Text style={styles.diffText}>
              Previous Level: {previousDifficulty}  •  Next Level: {nextDifficulty}
            </Text>
          </View>
        </View>

        {/* Performance Details Grid */}
        <View style={styles.detailsGrid}>
          <View style={styles.detailCard}>
            <CheckCircle size={24} color={COLORS.success} />
            <Text style={styles.detailValue}>
              {correctAnswers} / {totalQuestions}
            </Text>
            <Text style={styles.detailLabel}>Correct Answers</Text>
          </View>

          <View style={styles.detailCard}>
            <Clock size={24} color={COLORS.primaryTeal} />
            <Text style={styles.detailValue}>{responseTimeSec}s</Text>
            <Text style={styles.detailLabel}>Response Time</Text>
          </View>
        </View>

        {/* CTAs */}
        <View style={styles.ctaContainer}>
          <PrimaryButton
            title={`Play Next: ${
              recommendedGame === 'memory_recall' ? 'Memory Recall' : 'Attention Game'
            }`}
            icon={Play}
            variant="hero"
            onPress={() =>
              navigation.navigate(
                recommendedGame === 'memory_recall' ? 'MemoryRecallGame' : 'AttentionGame'
              )
            }
          />

          <SecondaryButton
            title="Play This Game Again"
            icon={RotateCcw}
            onPress={() =>
              navigation.navigate(
                gameType === 'memory_recall' ? 'MemoryRecallGame' : 'AttentionGame'
              )
            }
            style={{ marginTop: 10 }}
          />

          <SecondaryButton
            title="Return to Patient Home"
            icon={Home}
            onPress={() => navigation.navigate('PatientHome')}
            style={{ marginTop: 10 }}
          />
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
    paddingBottom: 32,
  },
  heroCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  awardBadge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.infoBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  heroTitle: {
    ...TYPOGRAPHY.titleLarge,
    color: COLORS.textPrimary,
  },
  heroSub: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  scoreContainer: {
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: COLORS.infoBg,
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.infoBorder,
  },
  scoreValue: {
    ...TYPOGRAPHY.statValue,
    fontSize: 44,
    lineHeight: 52,
    color: COLORS.primary,
  },
  scoreLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  adaptiveFeedbackCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 18,
    borderWidth: 2,
    borderColor: COLORS.primaryTeal,
    marginVertical: 10,
  },
  adaptiveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  adaptiveTitle: {
    ...TYPOGRAPHY.titleSmall,
    color: COLORS.primaryTeal,
  },
  adaptiveMessage: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textPrimary,
  },
  diffRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.cardBorder,
  },
  diffText: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 8,
  },
  detailCard: {
    flex: 1,
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
  },
  detailValue: {
    ...TYPOGRAPHY.titleMedium,
    color: COLORS.textPrimary,
    marginTop: 8,
  },
  detailLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  ctaContainer: {
    marginTop: 12,
  },
});
