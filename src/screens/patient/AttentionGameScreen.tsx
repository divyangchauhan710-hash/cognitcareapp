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
  Star,
  Heart,
  Sun,
  Flower,
  Coffee,
  Bell,
  Check,
  ArrowLeft,
  LucideIcon,
  Target,
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

interface ShapeItem {
  instanceId: string;
  type: string;
  name: string;
  icon: LucideIcon;
  isTarget: boolean;
}

const SHAPE_TYPES = [
  { type: 'star', name: 'Star', icon: Star },
  { type: 'heart', name: 'Heart', icon: Heart },
  { type: 'sun', name: 'Sun', icon: Sun },
  { type: 'flower', name: 'Flower', icon: Flower },
  { type: 'coffee', name: 'Cup', icon: Coffee },
  { type: 'bell', name: 'Bell', icon: Bell },
];

export const AttentionGameScreen: React.FC<{ navigation: any }> = ({
  navigation,
}) => {
  const [currentDifficulty, setCurrentDifficulty] = useState<number>(2);
  const [targetType, setTargetType] = useState(SHAPE_TYPES[0]);
  const [gridItems, setGridItems] = useState<ShapeItem[]>([]);
  const [selectedInstanceIds, setSelectedInstanceIds] = useState<string[]>([]);
  const [timerMs, setTimerMs] = useState<number>(0);
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    startNewGame(2);
  }, []);

  const startNewGame = (diffLevel: number) => {
    setCurrentDifficulty(diffLevel);
    setSelectedInstanceIds([]);
    startTimeRef.current = Date.now();

    // Pick target shape
    const targetShape = SHAPE_TYPES[Math.floor(Math.random() * SHAPE_TYPES.length)];
    setTargetType(targetShape);

    // Number of items based on difficulty (8 items for level 1, 12 items for level 2, 16 for 3, 20 for 4)
    const totalCount = diffLevel * 4 + 4;
    const targetCount = Math.max(3, Math.floor(totalCount * 0.4));

    const items: ShapeItem[] = [];

    // Add target items
    for (let i = 0; i < targetCount; i++) {
      items.push({
        instanceId: `target-${i}-${Date.now()}`,
        type: targetShape.type,
        name: targetShape.name,
        icon: targetShape.icon,
        isTarget: true,
      });
    }

    // Add distractor items
    const distractorShapes = SHAPE_TYPES.filter((s) => s.type !== targetShape.type);
    for (let i = 0; i < totalCount - targetCount; i++) {
      const distractor = distractorShapes[Math.floor(Math.random() * distractorShapes.length)];
      items.push({
        instanceId: `distractor-${i}-${Date.now()}`,
        type: distractor.type,
        name: distractor.name,
        icon: distractor.icon,
        isTarget: false,
      });
    }

    // Shuffle items
    setGridItems(items.sort(() => Math.random() - 0.5));
  };

  const handleTapItem = (instanceId: string) => {
    if (selectedInstanceIds.includes(instanceId)) {
      setSelectedInstanceIds(selectedInstanceIds.filter((id) => id !== instanceId));
    } else {
      setSelectedInstanceIds([...selectedInstanceIds, instanceId]);
    }
  };

  const handleSubmitAttention = () => {
    const responseTimeMs = Math.max(1000, Date.now() - startTimeRef.current);
    const targetInstanceIds = gridItems.filter((i) => i.isTarget).map((i) => i.instanceId);

    let correctTaps = 0;
    let mistakeTaps = 0;

    selectedInstanceIds.forEach((id) => {
      if (targetInstanceIds.includes(id)) {
        correctTaps++;
      } else {
        mistakeTaps++;
      }
    });

    const totalTargets = targetInstanceIds.length;
    const accuracy = Math.round((correctTaps / totalTargets) * 100);
    const score = Math.max(0, accuracy - mistakeTaps * 15);

    // Run Adaptive Engine
    const adaptiveResult = AdaptiveCognitivePersonalizationEngine.calculateNextState({
      accuracy,
      responseTimeMs,
      mistakes: mistakeTaps,
      currentDifficulty,
      gameType: 'attention',
    });

    // Save session
    const newSession: GameSession = {
      id: `gs-att-${Date.now()}`,
      patientId: 'patient-rita-72',
      gameType: 'attention',
      score,
      accuracy,
      responseTimeMs,
      correctAnswers: correctTaps,
      totalQuestions: totalTargets,
      difficultyLevel: currentDifficulty,
      timestamp: new Date().toISOString(),
      syncStatus: 'pending',
    };

    console.log('Saved Attention Game Session:', newSession);

    // Navigate to Game Results Screen
    navigation.navigate('GameResults', {
      gameType: 'attention',
      score,
      accuracy,
      responseTimeMs,
      correctAnswers: correctTaps,
      totalQuestions: totalTargets,
      previousDifficulty: currentDifficulty,
      nextDifficulty: adaptiveResult.nextDifficulty,
      feedbackMessage: adaptiveResult.feedbackMessage,
      recommendedGame: adaptiveResult.recommendedGame,
    });
  };

  const TargetIcon = targetType.icon;

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
          title="Attention & Focus Game"
          subtitle={`Difficulty Level ${currentDifficulty} • Target Identification`}
        />

        {/* Instructions Banner */}
        <View style={styles.instructionBanner}>
          <View style={styles.targetIconCircle}>
            <TargetIcon size={36} color={COLORS.primaryTeal} />
          </View>
          <View style={styles.instructionTextContainer}>
            <Text style={styles.instructionTitle}>
              Tap all the {targetType.name} shapes!
            </Text>
            <Text style={styles.instructionSub}>
              Ignore all other shapes and tap every {targetType.name} in the grid.
            </Text>
          </View>
        </View>

        {/* Shapes Grid */}
        <View style={styles.gridCard}>
          <View style={styles.shapesGrid}>
            {gridItems.map((item) => {
              const IconComp = item.icon;
              const isSelected = selectedInstanceIds.includes(item.instanceId);
              return (
                <Pressable
                  key={item.instanceId}
                  onPress={() => handleTapItem(item.instanceId)}
                  style={({ pressed }) => [
                    styles.shapeCard,
                    isSelected && styles.selectedShapeCard,
                    pressed && styles.pressed,
                  ]}
                  accessibilityRole="button"
                  accessibilityLabel={`${item.name} shape. ${
                    isSelected ? 'Selected' : 'Not selected'
                  }`}
                >
                  <IconComp
                    size={38}
                    color={isSelected ? COLORS.primaryTeal : COLORS.textPrimary}
                  />
                  {isSelected && (
                    <View style={styles.checkBadge}>
                      <Check size={14} color={COLORS.textLight} />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        <PrimaryButton
          title={`Confirm Selections (${selectedInstanceIds.length} tapped)`}
          icon={Check}
          variant="teal"
          disabled={selectedInstanceIds.length === 0}
          onPress={handleSubmitAttention}
          style={{ marginTop: 20 }}
        />
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
  instructionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDFA',
    borderColor: COLORS.primaryTeal,
    borderWidth: 2,
    borderRadius: 20,
    padding: 16,
    gap: 14,
    marginBottom: 16,
  },
  targetIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.cardBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.primaryTeal,
  },
  instructionTextContainer: {
    flex: 1,
  },
  instructionTitle: {
    ...TYPOGRAPHY.titleMedium,
    color: COLORS.primaryTeal,
  },
  instructionSub: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  gridCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 22,
    padding: 18,
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
  },
  shapesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  shapeCard: {
    width: '22%',
    height: 80,
    backgroundColor: COLORS.background,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
    position: 'relative',
  },
  selectedShapeCard: {
    borderColor: COLORS.primaryTeal,
    backgroundColor: '#F0FDFA',
  },
  checkBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.primaryTeal,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: {
    opacity: 0.85,
  },
});
