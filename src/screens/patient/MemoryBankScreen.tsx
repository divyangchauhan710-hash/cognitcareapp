import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Brain, ArrowLeft, User, MapPin, Play } from 'lucide-react-native';
import { HeaderBar } from '../../components/HeaderBar';
import { SectionHeader } from '../../components/SectionHeader';
import { SecondaryButton } from '../../components/SecondaryButton';
import { PrimaryButton } from '../../components/PrimaryButton';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { useData } from '../../context/DataContext';

export const MemoryBankScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { memories } = useData();

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
          title="Personal Memory Bank"
          subtitle="Your cherished family, friends, and special places"
        />

        <PrimaryButton
          title="Start Personalized Memory Quiz"
          subtitle="Test your memory of family & friends"
          icon={Play}
          variant="hero"
          onPress={() => navigation.navigate('PersonalizedMemoryActivity')}
          style={{ marginBottom: 20 }}
        />

        {memories.map((item) => (
          <View key={item.id} style={styles.memoryCard}>
            <View style={styles.iconBadge}>
              {item.category === 'place' ? (
                <MapPin size={24} color={COLORS.primaryTeal} />
              ) : (
                <User size={24} color={COLORS.primary} />
              )}
            </View>
            <View style={styles.memoryContent}>
              <View style={styles.titleRow}>
                <Text style={styles.memoryTitle}>{item.name}</Text>
                <View style={styles.relationBadge}>
                  <Text style={styles.relationText}>{item.relationship}</Text>
                </View>
              </View>
              <Text style={styles.memoryDescription}>{item.description}</Text>
            </View>
          </View>
        ))}
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
  memoryCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    marginBottom: 12,
    gap: 14,
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.infoBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memoryContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memoryTitle: {
    ...TYPOGRAPHY.titleSmall,
    color: COLORS.textPrimary,
  },
  relationBadge: {
    backgroundColor: COLORS.caregiverLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  relationText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.caregiverPrimary,
  },
  memoryDescription: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    marginTop: 6,
  },
});
