import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Brain, Activity, ArrowLeft, Layers, Calculator } from 'lucide-react-native';
import { HeaderBar } from '../../components/HeaderBar';
import { LargeActionCard } from '../../components/LargeActionCard';
import { SectionHeader } from '../../components/SectionHeader';
import { SecondaryButton } from '../../components/SecondaryButton';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';

export const GamesListScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
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
          title="Cognitive Games"
          subtitle="Adaptive training activities personalized for you"
        />

        <LargeActionCard
          title="Game 1: Memory Recall"
          subtitle="Memorize objects and identify them from distractors"
          icon={Brain}
          variant="hero"
          badgeText="Adaptive"
          onPress={() => navigation.navigate('MemoryRecallGame')}
        />

        <LargeActionCard
          title="Game 2: Pattern Sequence"
          subtitle="Memorize and repeat the flashing block sequences"
          icon={Activity}
          variant="teal"
          badgeText="Adaptive"
          onPress={() => navigation.navigate('PatternSequenceGame')}
        />

        <LargeActionCard
          title="Game 3: Category Sorting"
          subtitle="Find the odd item out from the categories"
          icon={Layers}
          variant="hero"
          badgeText="Adaptive"
          onPress={() => navigation.navigate('CategorySortingGame')}
        />

        <LargeActionCard
          title="Game 4: Math Puzzles"
          subtitle="Solve simple arithmetic problems"
          icon={Calculator}
          variant="teal"
          badgeText="Adaptive"
          onPress={() => navigation.navigate('MathPuzzlesGame')}
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
  },
});
