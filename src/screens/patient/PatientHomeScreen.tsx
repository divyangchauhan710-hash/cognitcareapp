import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
  Play,
  Gamepad2,
  Brain,
  Bell,
  TrendingUp,
  Clock,
  CheckCircle,
} from 'lucide-react-native';
import { HeaderBar } from '../../components/HeaderBar';
import { LargeActionCard } from '../../components/LargeActionCard';
import { StatCard } from '../../components/StatCard';
import { ReminderCard } from '../../components/ReminderCard';
import { SectionHeader } from '../../components/SectionHeader';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

interface PatientHomeScreenProps {
  navigation: any;
}

export const PatientHomeScreen: React.FC<PatientHomeScreenProps> = ({ navigation }) => {
  const { currentUser } = useAuth();
  const { reminders, updateReminderStatus, gameSessions, analytics, fetchPatientData, setActivePatientId } = useData();

  React.useEffect(() => {
    if (currentUser) {
      setActivePatientId(currentUser.id);
      fetchPatientData(currentUser.id);
    }
  }, [currentUser]);

  const upcomingReminder = reminders.find((r) => r.status === 'pending') || reminders[0];

  const gamesDone = gameSessions.filter(s => {
    const today = new Date().toDateString();
    return new Date(s.timestamp).toDateString() === today;
  }).length;
  
  const durationMin = Math.round((analytics?.averageResponseTimeMs || 0) * (analytics?.totalSessions || 0) / 60000);

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        {/* Welcome Header */}
        <View style={styles.greetingHeader}>
          <Text style={styles.greetingTitle}>Good Morning, {currentUser?.email?.split('@')[0]}</Text>
          <Text style={styles.greetingSubtitle}>Let's complete today's activities.</Text>
        </View>

        {/* HERO CTA: Start Today's Session */}
        <LargeActionCard
          title="Start Today's Session"
          subtitle="Memory Recall and Attention Training"
          icon={Play}
          variant="hero"
          badgeText="Recommended"
          onPress={() => navigation.navigate('Games')}
        />

        {/* Today's Progress Section */}
        <SectionHeader
          title="Today's Progress"
          subtitle="Activity completed so far today"
        />
        <View style={styles.statsRow}>
          <StatCard
            label="Games Completed"
            value={gamesDone.toString()}
            icon={CheckCircle}
            variant="primary"
          />
          <StatCard
            label="Session Time"
            value={durationMin.toString()}
            unit="min"
            icon={Clock}
            variant="teal"
          />
        </View>

        {/* Quick Actions Grid */}
        <SectionHeader title="Quick Actions" />
        <View style={styles.quickGrid}>
          <View style={styles.gridColumn}>
            <LargeActionCard
              title="Games"
              subtitle="Cognitive training"
              icon={Gamepad2}
              onPress={() => navigation.navigate('Games')}
            />
            <LargeActionCard
              title="Reminders"
              subtitle="Medicine & daily tasks"
              icon={Bell}
              onPress={() => navigation.navigate('Reminders')}
            />
          </View>
          <View style={styles.gridColumn}>
            <LargeActionCard
              title="Memory Bank"
              subtitle="Family & personal stories"
              icon={Brain}
              onPress={() => navigation.navigate('MemoryBank')}
            />
            <LargeActionCard
              title="Progress"
              subtitle="Performance history"
              icon={TrendingUp}
              onPress={() => navigation.navigate('Progress')}
            />
          </View>
        </View>

        {/* Upcoming Reminder Highlight */}
        <SectionHeader title="Upcoming Reminder" />
        {upcomingReminder && (
          <ReminderCard
            reminder={upcomingReminder}
            onComplete={(id) => updateReminderStatus(id, 'completed')}
            onSnooze={(id) => updateReminderStatus(id, 'snoozed')}
          />
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
    paddingBottom: 32,
  },
  greetingHeader: {
    marginVertical: 12,
  },
  greetingTitle: {
    ...TYPOGRAPHY.titleLarge,
    color: COLORS.textPrimary,
  },
  greetingSubtitle: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: -4,
  },
  quickGrid: {
    flexDirection: 'row',
    marginHorizontal: -6,
  },
  gridColumn: {
    flex: 1,
    paddingHorizontal: 6,
  },
});
