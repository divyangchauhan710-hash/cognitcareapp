import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { ArrowLeft, Check, Apple, Dog, Car, Coffee, Plane, Cat, Ban, Cherry, Bird, Train } from 'lucide-react-native';
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

const CATEGORIES = {
  animals: [
    { id: 'a1', icon: Dog, name: 'Dog' },
    { id: 'a2', icon: Cat, name: 'Cat' },
    { id: 'a3', icon: Bird, name: 'Bird' },
  ],
  food: [
    { id: 'f1', icon: Apple, name: 'Apple' },
    { id: 'f2', icon: Cherry, name: 'Cherry' },
    { id: 'f3', icon: Coffee, name: 'Coffee' },
  ],
  transport: [
    { id: 't1', icon: Car, name: 'Car' },
    { id: 't2', icon: Plane, name: 'Plane' },
    { id: 't3', icon: Train, name: 'Train' },
  ]
};

export const CategorySortingGameScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { currentUser } = useAuth();
  const { addGameSession, gameDifficulties } = useData();
  
  const savedDifficulty = gameDifficulties['category_sorting'] || 2;
  const [currentDifficulty, setCurrentDifficulty] = useState<number>(savedDifficulty);
  
  const [items, setItems] = useState<any[]>([]);
  const [oddOneId, setOddOneId] = useState<string>('');
  
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    startNewRound(savedDifficulty);
  }, []);

  const startNewRound = (diffLevel: number) => {
    setCurrentDifficulty(diffLevel);
    
    // Pick main category and odd category
    const cats = Object.keys(CATEGORIES);
    const mainCat = cats[Math.floor(Math.random() * cats.length)];
    let oddCat = cats[Math.floor(Math.random() * cats.length)];
    while(oddCat === mainCat) {
      oddCat = cats[Math.floor(Math.random() * cats.length)];
    }

    // Number of items based on difficulty (e.g. 3, 4, 5, 6)
    const itemCount = Math.min(6, 2 + diffLevel);
    
    const mainItems = [...CATEGORIES[mainCat as keyof typeof CATEGORIES]].sort(() => Math.random() - 0.5).slice(0, itemCount - 1);
    const oddItem = CATEGORIES[oddCat as keyof typeof CATEGORIES][Math.floor(Math.random() * 3)];
    
    setOddOneId(oddItem.id);
    
    const combined = [...mainItems, oddItem].sort(() => Math.random() - 0.5);
    setItems(combined);
    
    startTimeRef.current = Date.now();
    VoiceService.speak("Find the one that doesn't belong.");
  };

  const handleSelect = (id: string) => {
    const responseTimeMs = Math.max(1200, Date.now() - startTimeRef.current);
    
    const isCorrect = id === oddOneId;
    const accuracy = isCorrect ? 100 : 0;
    const mistakes = isCorrect ? 0 : 1;
    const score = accuracy;
    
    const adaptiveResult = AdaptiveCognitivePersonalizationEngine.calculateNextState({
      accuracy,
      responseTimeMs,
      mistakes,
      currentDifficulty,
      gameType: 'category_sorting',
    });

    const newSession: GameSession = {
      id: `gs-${Date.now()}`,
      patientId: currentUser?.id || 'unknown',
      gameType: 'category_sorting',
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
      gameType: 'category_sorting',
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
          title="Category Sorting"
          subtitle={`Difficulty Level ${currentDifficulty} • Find the odd one out`}
        />

        <View style={styles.gameCard}>
          <Text style={styles.instructionText}>
            Which item does NOT belong with the others?
          </Text>

          <View style={styles.grid}>
            {items.map((item) => {
              const Icon = item.icon;
              return (
                <Pressable
                  key={item.id}
                  style={styles.itemCard}
                  onPress={() => handleSelect(item.id)}
                >
                  <Icon size={48} color={COLORS.primary} />
                  <Text style={styles.itemName}>{item.name}</Text>
                </Pressable>
              );
            })}
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
  instructionText: {
    ...TYPOGRAPHY.titleMedium,
    color: COLORS.textPrimary,
    marginBottom: 32,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'center',
  },
  itemCard: {
    width: 130,
    height: 130,
    backgroundColor: COLORS.background,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
  },
  itemName: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textPrimary,
    marginTop: 12,
  },
});
