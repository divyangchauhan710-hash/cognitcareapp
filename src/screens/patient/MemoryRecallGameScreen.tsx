import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import {
  Apple,
  Key,
  Coffee,
  Flower,
  BookOpen,
  Sun,
  Bell,
  Star,
  Heart,
  Clock,
  Camera,
  Shield,
  Eye,
  Check,
  ArrowLeft,
  LucideIcon,
} from 'lucide-react-native';
import { HeaderBar } from '../../components/HeaderBar';
import { PrimaryButton } from '../../components/PrimaryButton';
import { SecondaryButton } from '../../components/SecondaryButton';
import { SectionHeader } from '../../components/SectionHeader';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import {
  AdaptiveCognitivePersonalizationEngine,
  DIFFICULTY_CONFIGS,
} from '../../services/adaptiveEngine';
import { GameSession } from '../../types';

import { VoiceService } from '../../services/voiceService';

interface GameObject {
  id: string;
  name: string;
  icon: LucideIcon;
}

const ALL_GAME_OBJECTS: GameObject[] = [
  { id: 'obj-1', name: 'Apple', icon: Apple },
  { id: 'obj-2', name: 'Key', icon: Key },
  { id: 'obj-3', name: 'Cup', icon: Coffee },
  { id: 'obj-4', name: 'Flower', icon: Flower },
  { id: 'obj-5', name: 'Book', icon: BookOpen },
  { id: 'obj-6', name: 'Sun', icon: Sun },
  { id: 'obj-7', name: 'Bell', icon: Bell },
  { id: 'obj-8', name: 'Star', icon: Star },
  { id: 'obj-9', name: 'Heart', icon: Heart },
  { id: 'obj-10', name: 'Clock', icon: Clock },
  { id: 'obj-11', name: 'Camera', icon: Camera },
  { id: 'obj-12', name: 'Shield', icon: Shield },
];

export const MemoryRecallGameScreen: React.FC<{ navigation: any }> = ({
  navigation,
}) => {
  // Game Phase: 'memorize' | 'recall' | 'completed'
  const [phase, setPhase] = useState<'memorize' | 'recall' | 'completed'>('memorize');
  const [currentDifficulty, setCurrentDifficulty] = useState<number>(2);

  const diffConfig = DIFFICULTY_CONFIGS[currentDifficulty] || DIFFICULTY_CONFIGS[2];
  const [timerSeconds, setTimerSeconds] = useState<number>(diffConfig.timeLimitSeconds);
  const [targetObjects, setTargetObjects] = useState<GameObject[]>([]);
  const [selectionPool, setSelectionPool] = useState<GameObject[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const startTimeRef = useRef<number>(Date.now());

  // Setup game round on mount or difficulty change
  useEffect(() => {
    startNewRound(2);
  }, []);

  const startNewRound = (diffLevel: number) => {
    const config = DIFFICULTY_CONFIGS[diffLevel] || DIFFICULTY_CONFIGS[2];
    setCurrentDifficulty(diffLevel);
    setTimerSeconds(config.timeLimitSeconds);
    setPhase('memorize');
    setSelectedIds([]);

    // Voice narration
    VoiceService.speak("Remember these objects carefully before they hide.");

    // Shuffle and pick target objects
    const shuffled = [...ALL_GAME_OBJECTS].sort(() => Math.random() - 0.5);
    const targets = shuffled.slice(0, config.itemCount);
    setTargetObjects(targets);

    // Create selection pool with distractors
    const poolSize = Math.min(12, config.itemCount + 4);
    const pool = [...shuffled.slice(0, poolSize)].sort(() => Math.random() - 0.5);
    setSelectionPool(pool);
  };

  // Memorization countdown timer
  useEffect(() => {
    if (phase !== 'memorize') return;

    if (timerSeconds <= 0) {
      setPhase('recall');
      startTimeRef.current = Date.now();
      return;
    }

    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, timerSeconds]);

  const handleToggleSelect = (id: string) => {
    if (phase !== 'recall') return;
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleSubmitRecall = () => {
    const responseTimeMs = Math.max(1200, Date.now() - startTimeRef.current);
    const targetIds = targetObjects.map((t) => t.id);

    let correctCount = 0;
    let incorrectCount = 0;

    selectedIds.forEach((id) => {
      if (targetIds.includes(id)) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });

    const totalQuestions = targetObjects.length;
    const accuracy = Math.round((correctCount / totalQuestions) * 100);
    const score = Math.max(0, accuracy - incorrectCount * 10);

    // Calculate next adaptive state
    const adaptiveResult = AdaptiveCognitivePersonalizationEngine.calculateNextState({
      accuracy,
      responseTimeMs,
      mistakes: incorrectCount,
      currentDifficulty,
      gameType: 'memory_recall',
    });

    // Create session record
    const newSession: GameSession = {
      id: `gs-${Date.now()}`,
      patientId: 'patient-rita-72',
      gameType: 'memory_recall',
      score,
      accuracy,
      responseTimeMs,
      correctAnswers: correctCount,
      totalQuestions,
      difficultyLevel: currentDifficulty,
      timestamp: new Date().toISOString(),
      syncStatus: 'pending',
    };

    console.log('Saved Memory Recall Session:', newSession);

    // Navigate to Game Results Screen
    navigation.navigate('GameResults', {
      gameType: 'memory_recall',
      score,
      accuracy,
      responseTimeMs,
      correctAnswers: correctCount,
      totalQuestions,
      previousDifficulty: currentDifficulty,
      nextDifficulty: adaptiveResult.nextDifficulty,
      feedbackMessage: adaptiveResult.feedbackMessage,
      recommendedGame: adaptiveResult.recommendedGame,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar />
      <ScrollView contentContainerStyle={styles.container}>
        <SecondaryButton
          title="Exit Game"
          icon={ArrowLeft}
          onPress={() => navigation.navigate('PatientHome')}
          style={{ marginBottom: 16 }}
        />

        <SectionHeader
          title="Memory Recall Game"
          subtitle={`Difficulty Level ${currentDifficulty} • ${targetObjects.length} Objects`}
        />

        {/* Phase 1: Memorization */}
        {phase === 'memorize' && (
          <View style={styles.phaseCard}>
            <View style={styles.timerBadge}>
              <Eye size={24} color={COLORS.primary} />
              <Text style={styles.timerText}>Memorize Objects: {timerSeconds}s</Text>
            </View>

            <Text style={styles.instructionText}>
              Remember these {targetObjects.length} objects carefully before they hide.
            </Text>

            <View style={styles.objectsGrid}>
              {targetObjects.map((obj) => {
                const IconComponent = obj.icon;
                return (
                  <View key={obj.id} style={styles.objectCard}>
                    <View style={styles.iconCircle}>
                      <IconComponent size={36} color={COLORS.primary} />
                    </View>
                    <Text style={styles.objectName}>{obj.name}</Text>
                  </View>
                );
              })}
            </View>

            <PrimaryButton
              title="I'm Ready Now"
              icon={Check}
              variant="teal"
              onPress={() => {
                setPhase('recall');
                startTimeRef.current = Date.now();
              }}
              style={{ marginTop: 20 }}
            />
          </View>
        )}

        {/* Phase 2: Recall Selection */}
        {phase === 'recall' && (
          <View style={styles.phaseCard}>
            <Text style={styles.instructionTextBold}>
              Select the {targetObjects.length} objects you memorized:
            </Text>

            <View style={styles.objectsGrid}>
              {selectionPool.map((obj) => {
                const IconComponent = obj.icon;
                const isSelected = selectedIds.includes(obj.id);
                return (
                  <Pressable
                    key={obj.id}
                    onPress={() => handleToggleSelect(obj.id)}
                    style={({ pressed }) => [
                      styles.selectableCard,
                      isSelected && styles.selectedCard,
                      pressed && styles.pressed,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={`${obj.name}. ${isSelected ? 'Selected' : 'Not selected'}`}
                  >
                    <View
                      style={[
                        styles.iconCircle,
                        isSelected && { backgroundColor: COLORS.infoBg },
                      ]}
                    >
                      <IconComponent
                        size={34}
                        color={isSelected ? COLORS.primary : COLORS.textPrimary}
                      />
                    </View>
                    <Text
                      style={[
                        styles.objectName,
                        isSelected && { color: COLORS.primary, fontWeight: '700' },
                      ]}
                    >
                      {obj.name}
                    </Text>
                    {isSelected && (
                      <View style={styles.checkBadge}>
                        <Check size={16} color={COLORS.textLight} />
                      </View>
                    )}
                  </Pressable>
                );
              })}
            </View>

            <PrimaryButton
              title={`Submit Selection (${selectedIds.length} chosen)`}
              icon={Check}
              variant="primary"
              disabled={selectedIds.length === 0}
              onPress={handleSubmitRecall}
              style={{ marginTop: 20 }}
            />
          </View>
        )}
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
  phaseCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 22,
    padding: 20,
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
  },
  timerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.infoBg,
    borderColor: COLORS.infoBorder,
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 16,
    marginBottom: 16,
  },
  timerText: {
    ...TYPOGRAPHY.titleMedium,
    color: COLORS.primary,
  },
  instructionText: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 16,
  },
  instructionTextBold: {
    ...TYPOGRAPHY.titleSmall,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 16,
  },
  objectsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  objectCard: {
    width: '29%',
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
  },
  selectableCard: {
    width: '29%',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
    position: 'relative',
  },
  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.infoBg,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  objectName: {
    ...TYPOGRAPHY.bodyBold,
    fontSize: 16,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  checkBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
});
