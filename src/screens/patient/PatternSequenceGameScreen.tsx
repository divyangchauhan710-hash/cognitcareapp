import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { ArrowLeft, Check, Play, RefreshCcw } from 'lucide-react-native';
import { HeaderBar } from '../../components/HeaderBar';
import { PrimaryButton } from '../../components/PrimaryButton';
import { SecondaryButton } from '../../components/SecondaryButton';
import { SectionHeader } from '../../components/SectionHeader';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import {
  AdaptiveCognitivePersonalizationEngine,
} from '../../services/adaptiveEngine';
import { GameSession } from '../../types';
import { VoiceService } from '../../services/voiceService';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const COLORS_SEQ = [
  '#FF5252', // Red
  '#448AFF', // Blue
  '#4CAF50', // Green
  '#FFC107', // Yellow
];

export const PatternSequenceGameScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { currentUser } = useAuth();
  const { addGameSession, gameDifficulties } = useData();
  
  const savedDifficulty = gameDifficulties['pattern_sequence'] || 2;
  const [currentDifficulty, setCurrentDifficulty] = useState<number>(savedDifficulty);
  
  // 'watch' | 'play' | 'completed'
  const [phase, setPhase] = useState<'watch' | 'play' | 'completed'>('watch');
  const [sequence, setSequence] = useState<number[]>([]);
  const [playerSequence, setPlayerSequence] = useState<number[]>([]);
  const [activeBlock, setActiveBlock] = useState<number | null>(null);
  
  const startTimeRef = useRef<number>(Date.now());
  const playTimeoutRef = useRef<any>(null);

  useEffect(() => {
    startNewRound(savedDifficulty);
    return () => clearTimeout(playTimeoutRef.current);
  }, []);

  const startNewRound = (diffLevel: number) => {
    setCurrentDifficulty(diffLevel);
    setPhase('watch');
    setPlayerSequence([]);
    setActiveBlock(null);
    
    // Level 1: 3 blocks, Level 2: 4 blocks, Level 3: 5 blocks, Level 4: 6 blocks
    const seqLength = 2 + diffLevel;
    const newSeq = Array.from({ length: seqLength }, () => Math.floor(Math.random() * 4));
    setSequence(newSeq);
    
    VoiceService.speak("Watch the sequence carefully.");
    
    playSequence(newSeq, diffLevel);
  };

  const playSequence = (seq: number[], diffLevel: number) => {
    let step = 0;
    // Faster for higher difficulties
    const speed = Math.max(400, 1000 - (diffLevel * 150));
    
    const playNext = () => {
      if (step >= seq.length) {
        setActiveBlock(null);
        setPhase('play');
        startTimeRef.current = Date.now();
        VoiceService.speak("Your turn. Tap the blocks in the same order.");
        return;
      }
      
      setActiveBlock(seq[step]);
      playTimeoutRef.current = setTimeout(() => {
        setActiveBlock(null);
        playTimeoutRef.current = setTimeout(() => {
          step++;
          playNext();
        }, speed / 2);
      }, speed);
    };
    
    // Start after small delay
    playTimeoutRef.current = setTimeout(playNext, 1000);
  };

  const handleBlockPress = (index: number) => {
    if (phase !== 'play') return;
    
    const newPlayerSeq = [...playerSequence, index];
    setPlayerSequence(newPlayerSeq);
    
    // Light up block briefly
    setActiveBlock(index);
    setTimeout(() => setActiveBlock(null), 200);
    
    if (newPlayerSeq.length === sequence.length) {
      handleSubmit(newPlayerSeq);
    }
  };

  const handleSubmit = (finalSeq: number[]) => {
    const responseTimeMs = Math.max(1200, Date.now() - startTimeRef.current);
    
    let correctCount = 0;
    for (let i = 0; i < sequence.length; i++) {
      if (sequence[i] === finalSeq[i]) correctCount++;
    }
    
    const accuracy = Math.round((correctCount / sequence.length) * 100);
    const mistakes = sequence.length - correctCount;
    const score = accuracy;
    
    const adaptiveResult = AdaptiveCognitivePersonalizationEngine.calculateNextState({
      accuracy,
      responseTimeMs,
      mistakes,
      currentDifficulty,
      gameType: 'pattern_sequence',
    });

    const newSession: GameSession = {
      id: `gs-${Date.now()}`,
      patientId: currentUser?.id || 'unknown',
      gameType: 'pattern_sequence',
      score,
      accuracy,
      responseTimeMs,
      correctAnswers: correctCount,
      totalQuestions: sequence.length,
      difficultyLevel: currentDifficulty,
      timestamp: new Date().toISOString(),
      syncStatus: 'synced',
    };

    addGameSession(newSession);

    navigation.navigate('GameResults', {
      gameType: 'pattern_sequence',
      score,
      accuracy,
      responseTimeMs,
      correctAnswers: correctCount,
      totalQuestions: sequence.length,
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
          title="Pattern Sequence"
          subtitle={`Difficulty Level ${currentDifficulty} • Sequence of ${sequence.length}`}
        />

        <View style={styles.gameCard}>
          <Text style={styles.instructionText}>
            {phase === 'watch' ? 'Watch the sequence...' : 'Repeat the sequence!'}
          </Text>

          <View style={styles.grid}>
            {COLORS_SEQ.map((color, index) => (
              <Pressable
                key={index}
                style={[
                  styles.block,
                  { backgroundColor: activeBlock === index ? color : COLORS.cardBorder },
                  activeBlock === index && styles.activeBlock
                ]}
                onPress={() => handleBlockPress(index)}
                disabled={phase !== 'play'}
              />
            ))}
          </View>
          
          {phase === 'play' && (
            <View style={styles.progressContainer}>
              <Text style={styles.progressText}>
                {playerSequence.length} / {sequence.length} Tapped
              </Text>
            </View>
          )}

          <PrimaryButton
            title="Replay Sequence"
            icon={RefreshCcw}
            onPress={() => startNewRound(currentDifficulty)}
            style={{ marginTop: 24 }}
            disabled={phase === 'watch'}
          />
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
  instructionText: {
    ...TYPOGRAPHY.titleMedium,
    color: COLORS.textPrimary,
    marginBottom: 32,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 240,
    height: 240,
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  block: {
    width: 110,
    height: 110,
    borderRadius: 20,
  },
  activeBlock: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  progressContainer: {
    marginTop: 24,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: COLORS.infoBg,
    borderRadius: 20,
  },
  progressText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.primary,
  }
});
