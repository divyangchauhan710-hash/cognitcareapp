import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { Bell, ArrowLeft } from 'lucide-react-native';
import { HeaderBar } from '../../components/HeaderBar';
import { ReminderCard } from '../../components/ReminderCard';
import { SectionHeader } from '../../components/SectionHeader';
import { SecondaryButton } from '../../components/SecondaryButton';
import { COLORS } from '../../constants/colors';
import { useData } from '../../context/DataContext';

export const RemindersScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { reminders, updateReminderStatus } = useData();

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
          title="Daily Reminders"
          subtitle="Your schedule and medication reminders for today"
        />

        {reminders.map((reminder) => (
          <ReminderCard
            key={reminder.id}
            reminder={reminder}
            onComplete={(id) => updateReminderStatus(id, 'completed')}
            onSnooze={(id) => updateReminderStatus(id, 'snoozed')}
          />
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
});
