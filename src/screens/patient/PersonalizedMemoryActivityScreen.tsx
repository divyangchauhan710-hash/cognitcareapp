import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Brain, User, CheckCircle, ArrowLeft, HelpCircle, Heart } from 'lucide-react-native';
import { HeaderBar } from '../../components/HeaderBar';
import { PrimaryButton } from '../../components/PrimaryButton';
import { SecondaryButton } from '../../components/SecondaryButton';
import { SectionHeader } from '../../components/SectionHeader';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { useData } from '../../context/DataContext';

const DISTRACTOR_RELATIONSHIPS = [
  'Doctor',
  'Friend',
  'Neighbor',
  'Teacher',
  'Colleague',
  'Cousin',
  'Driver',
];

export const PersonalizedMemoryActivityScreen: React.FC<{ navigation: any }> = ({
  navigation,
}) => {
  const { memories } = useData();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const currentMemory = memories[currentIndex] || memories[0];

  // Generate 4 multiple-choice options with the correct relationship included
  const generateOptions = (correctRelation: string) => {
    const distractors = DISTRACTOR_RELATIONSHIPS.filter((r) => r !== correctRelation)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3);
    const options = [correctRelation, ...distractors].sort(() => Math.random() - 0.5);
    return options;
  };

  const [options, setOptions] = useState(() =>
    generateOptions(currentMemory ? currentMemory.relationship : 'Grandson')
  );

  const handleSelectOption = (option: string) => {
    if (isAnswered) return;
    setSelectedOption(option);
    setIsAnswered(true);
    if (option === currentMemory.relationship) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < memories.length) {
      const nextMem = memories[currentIndex + 1];
      setCurrentIndex(currentIndex + 1);
      setOptions(generateOptions(nextMem.relationship));
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Completed all trivia questions
      navigation.navigate('GameResults', {
        gameType: 'memory_recall',
        score: Math.round(((score + (selectedOption === currentMemory.relationship ? 1 : 0)) / memories.length) * 100),
        accuracy: Math.round(((score + (selectedOption === currentMemory.relationship ? 1 : 0)) / memories.length) * 100),
        responseTimeMs: 4500,
        correctAnswers: score + (selectedOption === currentMemory.relationship ? 1 : 0),
        totalQuestions: memories.length,
        previousDifficulty: 2,
        nextDifficulty: 2,
        feedbackMessage: 'Great job recalling your personal family & friend memories!',
        recommendedGame: 'attention',
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar />
      <ScrollView contentContainerStyle={styles.container}>
        <SecondaryButton
          title="Back to Memory Bank"
          icon={ArrowLeft}
          onPress={() => navigation.goBack()}
          style={{ marginBottom: 16 }}
        />

        <SectionHeader
          title="Personal Memory Recall"
          subtitle={`Question ${currentIndex + 1} of ${memories.length}`}
        />

        {currentMemory && (
          <View style={styles.card}>
            <View style={styles.avatarCircle}>
              <User size={40} color={COLORS.primary} />
            </View>

            <Text style={styles.questionText}>
              Who is <Text style={styles.highlightName}>{currentMemory.name}</Text>?
            </Text>

            <Text style={styles.hintText}>"{currentMemory.description}"</Text>

            <View style={styles.optionsContainer}>
              {options.map((opt) => {
                const isSelected = selectedOption === opt;
                const isCorrect = opt === currentMemory.relationship;
                let textColor = COLORS.textPrimary;

                if (isAnswered) {
                  if (isCorrect) {
                    textColor = COLORS.success;
                  } else if (isSelected) {
                    textColor = COLORS.danger;
                  }
                } else if (isSelected) {
                  textColor = COLORS.primary;
                }

                return (
                  <Pressable
                    key={opt}
                    onPress={() => handleSelectOption(opt)}
                    disabled={isAnswered}
                    style={({ pressed }) => [
                      styles.optionButton,
                      isSelected && !isAnswered && styles.selectedOption,
                      isAnswered && isCorrect && styles.correctOption,
                      isAnswered && isSelected && !isCorrect && styles.wrongOption,
                      pressed && !isAnswered && styles.pressed,
                    ]}
                    accessibilityRole="button"
                    accessibilityLabel={opt}
                  >
                    <Text style={[styles.optionText, { color: textColor }]}>
                      {opt}
                    </Text>
                    {isAnswered && isCorrect && (
                      <CheckCircle size={22} color={COLORS.success} />
                    )}
                  </Pressable>
                );
              })}
            </View>

            {isAnswered && (
              <PrimaryButton
                title={
                  currentIndex + 1 < memories.length ? 'Next Memory Question' : 'Finish Activity'
                }
                icon={CheckCircle}
                variant="primary"
                onPress={handleNextQuestion}
                style={{ marginTop: 20 }}
              />
            )}
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
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 22,
    padding: 22,
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: COLORS.infoBg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  questionText: {
    ...TYPOGRAPHY.titleMedium,
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  highlightName: {
    color: COLORS.primary,
  },
  hintText: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    marginTop: 8,
    marginBottom: 20,
  },
  optionsContainer: {
    width: '100%',
    gap: 12,
  },
  optionButton: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: COLORS.infoBg,
    borderColor: COLORS.primary,
    borderWidth: 2,
  },
  correctOption: {
    backgroundColor: COLORS.successBg,
    borderColor: COLORS.successBorder,
    borderWidth: 2,
  },
  wrongOption: {
    backgroundColor: COLORS.dangerBg,
    borderColor: COLORS.dangerBorder,
    borderWidth: 2,
  },
  optionText: {
    ...TYPOGRAPHY.buttonText,
    fontSize: 19,
  },
  pressed: {
    opacity: 0.85,
  },
});
