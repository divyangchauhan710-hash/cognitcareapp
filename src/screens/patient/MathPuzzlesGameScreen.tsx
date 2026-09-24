import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { ArrowLeft, Calculator } from 'lucide-react-native';
import { HeaderBar } from '../../components/HeaderBar';
import { PrimaryButton } from '../../components/PrimaryButton';
import { SecondaryButton } from '../../components/SecondaryButton';
import { SectionHeader } from '../../components/SectionHeader';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { AdaptiveCognitivePersonalizationEngine } from '../../services/adaptiveEngine';
import { GameSession } from '../../types';
import { VoiceService } from '../../services/voiceService';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

export const MathPuzzlesGameScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { currentUser } = useAuth();
  const { addGameSession, gameDifficulties } = useData();
  
  const savedDifficulty = gameDifficulties['math_puzzles'] || 2;
  const [currentDifficulty, setCurrentDifficulty] = useState<number>(savedDifficulty);
  
  const [equation, setEquation] = useState<string>('');
  const [options, setOptions] = useState<number[]>([]);
  const [correctAnswer, setCorrectAnswer] = useState<number>(0);
  
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    startNewRound(savedDifficulty);
  }, []);

  const startNewRound = (diffLevel: number) => {
    setCurrentDifficulty(diffLevel);
    
    let a = 0;
    let b = 0;
    let isAddition = true;
    
    if (diffLevel === 1) {
      a = Math.floor(Math.random() * 10) + 1;
      b = Math.floor(Math.random() * 10) + 1;
    } else if (diffLevel === 2) {
      a = Math.floor(Math.random() * 20) + 10;
      b = Math.floor(Math.random() * 10) + 1;
    } else if (diffLevel === 3) {
      isAddition = Math.random() > 0.5;
      a = Math.floor(Math.random() * 30) + 15;
      b = Math.floor(Math.random() * 15) + 1;
    } else {
      isAddition = Math.random() > 0.5;
      a = Math.floor(Math.random() * 50) + 20;
      b = Math.floor(Math.random() * 30) + 10;
    }

    if (!isAddition && b > a) {
      const temp = a;
      a = b;
      b = temp;
    }

    const answer = isAddition ? a + b : a - b;
    setCorrectAnswer(answer);
    setEquation(`${a} ${isAddition ? '+' : '-'} ${b} = ?`);
    
    // Generate options
    let newOptions = [answer];
    while (newOptions.length < 4) {
      const wrong = answer + (Math.floor(Math.random() * 10) - 5);
      if (!newOptions.includes(wrong) && wrong > 0) {
        newOptions.push(wrong);
      }
    }
    
    setOptions(newOptions.sort(() => Math.random() - 0.5));
    
    startTimeRef.current = Date.now();
    VoiceService.speak("Solve the puzzle.");
  };

  const handleSelect = (selectedAnswer: number) => {
    const responseTimeMs = Math.max(1200, Date.now() - startTimeRef.current);
    
    const isCorrect = selectedAnswer === correctAnswer;
    const accuracy = isCorrect ? 100 : 0;
    const mistakes = isCorrect ? 0 : 1;
    const score = accuracy;
    
    const adaptiveResult = AdaptiveCognitivePersonalizationEngine.calculateNextState({
      accuracy,
      responseTimeMs,
      mistakes,
      currentDifficulty,
      gameType: 'math_puzzles',
    });

    const newSession: GameSession = {
      id: `gs-${Date.now()}`,
      patientId: currentUser?.id || 'unknown',
      gameType: 'math_puzzles',
      score,
      accuracy,
      responseTimeMs,
      correctAnswers: isCorrect ? 1 : 0,
      totalQuestions: 1,
      difficultyLevel: currentDifficulty,
      timestamp: new Date().toISOString(),
      syncStatus: 'synced',
    };

    addGameSession(newSession);

    navigation.navigate('GameResults', {
      gameType: 'math_puzzles',
      score,
      accuracy,
      responseTimeMs,
      correctAnswers: isCorrect ? 1 : 0,
      totalQuestions: 1,
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
          title="Math Puzzles"
          subtitle={`Difficulty Level ${currentDifficulty} • Solve the equation`}
        />

        <View style={styles.gameCard}>
          <View style={styles.equationContainer}>
            <Text style={styles.equationText}>{equation}</Text>
          </View>

          <View style={styles.grid}>
            {options.map((opt, index) => (
              <Pressable
                key={index}
                style={styles.optionCard}
                onPress={() => handleSelect(opt)}
              >
                <Text style={styles.optionText}>{opt}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 16, paddingBottom: 32 },
  gameCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 22,
    padding: 20,
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
    alignItems: 'center',
  },
  equationContainer: {
    backgroundColor: COLORS.infoBg,
    paddingVertical: 32,
    paddingHorizontal: 48,
    borderRadius: 20,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: COLORS.infoBorder,
  },
  equationText: {
    fontSize: 48,
    fontWeight: '800',
    color: COLORS.primary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  optionCard: {
    width: 120,
    height: 100,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
  },
  optionText: {
    fontSize: 32,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },
});
