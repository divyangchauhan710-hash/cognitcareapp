import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Bell, ArrowLeft, Plus } from 'lucide-react-native';
import { HeaderBar } from '../../components/HeaderBar';
import { SectionHeader } from '../../components/SectionHeader';
import { SecondaryButton } from '../../components/SecondaryButton';
import { PrimaryButton } from '../../components/PrimaryButton';
import { ReminderCard } from '../../components/ReminderCard';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { useData } from '../../context/DataContext';

export const CaregiverRemindersScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { reminders, addReminder } = useData();

  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [description, setDescription] = useState('');

  const handleAddReminder = () => {
    if (!title.trim() || !scheduledTime.trim()) return;
    addReminder({
      patientId: 'patient-rita-72',
      title,
      scheduledTime,
      description: description || 'Daily scheduled reminder.',
      status: 'pending',
      repeatPattern: 'daily',
      createdBy: 'Demo Caregiver',
    });
    setTitle('');
    setScheduledTime('');
    setDescription('');
    setShowAddForm(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar />
      <ScrollView contentContainerStyle={styles.container}>
        <SecondaryButton
          title="Back to Caregiver Dashboard"
          icon={ArrowLeft}
          onPress={() => navigation.goBack()}
          style={{ marginBottom: 16 }}
        />

        <SectionHeader
          title="Reminder Management"
          subtitle="Schedule medication and daily reminders for Rita Devi"
          action={
            <PrimaryButton
              title={showAddForm ? 'Cancel' : 'New Reminder'}
              icon={Plus}
              variant="teal"
              onPress={() => setShowAddForm(!showAddForm)}
              style={{ minHeight: 44, paddingVertical: 8, paddingHorizontal: 14 }}
              textStyle={{ fontSize: 15 }}
            />
          }
        />

        {showAddForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Schedule New Reminder</Text>
            
            <Text style={styles.inputLabel}>Reminder Title</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Morning Medicine"
              placeholderTextColor={COLORS.textMuted}
              value={title}
              onChangeText={setTitle}
            />

            <Text style={styles.inputLabel}>Scheduled Time</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. 8:00 AM"
              placeholderTextColor={COLORS.textMuted}
              value={scheduledTime}
              onChangeText={setScheduledTime}
            />

            <Text style={styles.inputLabel}>Instructions / Notes</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Take 1 tablet after breakfast."
              placeholderTextColor={COLORS.textMuted}
              value={description}
              onChangeText={setDescription}
            />

            <PrimaryButton
              title="Save Reminder"
              icon={Plus}
              variant="success"
              onPress={handleAddReminder}
              style={{ marginTop: 12 }}
            />
          </View>
        )}

        {reminders.map((rem) => (
          <ReminderCard key={rem.id} reminder={rem} compact />
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
  formCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 18,
    borderWidth: 2,
    borderColor: COLORS.primaryTeal,
    marginBottom: 16,
  },
  formTitle: {
    ...TYPOGRAPHY.titleSmall,
    color: COLORS.primaryTeal,
    marginBottom: 12,
  },
  inputLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 8,
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
});
