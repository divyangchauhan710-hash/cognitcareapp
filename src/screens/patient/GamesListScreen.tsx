import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Brain, Activity, ArrowLeft } from 'lucide-react-native';
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
          title="Game 2: Attention Game"
          subtitle="Find target shapes and tap matching objects quickly"
          icon={Activity}
          variant="teal"
          badgeText="Adaptive"
          onPress={() => navigation.navigate('AttentionGame')}
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
