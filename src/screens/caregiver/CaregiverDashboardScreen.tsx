import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, ActivityIndicator, Modal, FlatList } from 'react-native';
import {
  Users,
  Brain,
  Bell,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ChevronRight,
  Activity,
  ChevronDown
} from 'lucide-react-native';
import { HeaderBar } from '../../components/HeaderBar';
import { StatCard } from '../../components/StatCard';
import { SectionHeader } from '../../components/SectionHeader';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

const API_URL = "https://aeterna-1.onrender.com";

interface CaregiverDashboardScreenProps {
  navigation: any;
}

export const CaregiverDashboardScreen: React.FC<CaregiverDashboardScreenProps> = ({ navigation }) => {
  const { currentUser } = useAuth();
  const { reminders, memories, gameSessions, analytics, activePatientId, setActivePatientId, fetchPatientData } = useData();
  const [myPatients, setMyPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  useEffect(() => {
    fetchConnectedPatients();
  }, [currentUser]);

  useEffect(() => {
    if (activePatientId) {
      fetchPatientData(activePatientId);
    }
  }, [activePatientId]);

  const fetchConnectedPatients = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/connections/my-patients/${currentUser.id}`);
      if (res.ok) {
        const data = await res.json();
        setMyPatients(data);
        if (data.length > 0 && !activePatientId) {
          setActivePatientId(data[0].id);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const selectedPatient = myPatients.find(p => p.id === activePatientId) || null;

  if (loading && myPatients.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <HeaderBar />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (myPatients.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <HeaderBar />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          <Text style={styles.alertTitle}>No Patients Connected</Text>
          <Text style={{ textAlign: 'center', marginTop: 10 }}>Go to the Connections screen to send a request to a patient.</Text>
          <Pressable style={{ marginTop: 20, padding: 10, backgroundColor: COLORS.primary, borderRadius: 8 }} onPress={() => navigation.navigate('Connections')}>
            <Text style={{ color: 'white', fontWeight: 'bold' }}>Manage Connections</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const completedReminders = reminders.filter((r) => r.status === 'completed').length;
  const missedReminders = reminders.filter((r) => r.status === 'missed').length;

  const avgAccuracy = analytics?.averageAccuracy || 0;
  const recentTrend = analytics?.recentTrend || "stable";
  const gamesDone = gameSessions.filter(s => {
    const today = new Date().toDateString();
    return new Date(s.timestamp).toDateString() === today;
  }).length;
  const durationMin = Math.round((analytics?.averageResponseTimeMs || 0) * (analytics?.totalSessions || 0) / 60000);

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar />
      <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
        
        {/* Patient Selection Dropdown Trigger */}
        <Pressable style={styles.patientSelector} onPress={() => setDropdownVisible(true)}>
          <Text style={styles.patientSelectorText}>Viewing: {selectedPatient?.email || "Unknown Patient"}</Text>
          <ChevronDown size={20} color={COLORS.textPrimary} />
        </Pressable>

        {/* Dropdown Modal */}
        <Modal visible={dropdownVisible} transparent animationType="fade">
          <Pressable style={styles.modalOverlay} onPress={() => setDropdownVisible(false)}>
            <View style={styles.dropdownContent}>
              <Text style={styles.dropdownTitle}>Select Patient</Text>
              <FlatList
                data={myPatients}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Pressable 
                    style={[styles.dropdownItem, item.id === activePatientId && styles.dropdownItemSelected]} 
                    onPress={() => {
                      setActivePatientId(item.id);
                      setDropdownVisible(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{item.email}</Text>
                    {item.id === activePatientId && <CheckCircle size={20} color={COLORS.primary} />}
                  </Pressable>
                )}
              />
            </View>
          </Pressable>
        </Modal>

        {/* Caregiver Header Card */}
        <View style={styles.caregiverHeaderCard}>
          <View style={styles.patientAvatarBadge}>
            <Users size={28} color={COLORS.caregiverPrimary} />
          </View>
          <View style={styles.patientHeaderInfo}>
            <Text style={styles.patientName}>{selectedPatient?.email}</Text>
            <Text style={styles.patientMeta}>
              ID: {selectedPatient?.id.substring(0, 8)} • Status: Active Training
            </Text>
          </View>
          <View style={[styles.trendBadge, recentTrend === 'stable' && {backgroundColor: COLORS.infoBg, borderColor: COLORS.infoBorder}]}>
            <TrendingUp size={16} color={recentTrend === 'improving' ? COLORS.success : COLORS.primary} />
            <Text style={[styles.trendBadgeText, recentTrend === 'stable' && {color: COLORS.primary}]}>{recentTrend}</Text>
          </View>
        </View>

        {/* Active Alert Notification */}
        <View style={styles.alertCard}>
          <AlertTriangle size={22} color={COLORS.warning} />
          <View style={styles.alertTextContainer}>
            <Text style={styles.alertTitle}>Activity Summary</Text>
            <Text style={styles.alertBody}>
              Patient completed {gamesDone} cognitive sessions today. {completedReminders} of {reminders.length} reminders completed.
            </Text>
          </View>
        </View>

        {/* Today's Activity Summary */}
        <SectionHeader
          title="Today's Activity"
          subtitle="Real-time session monitoring"
        />
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard
              label="Games Done Today"
              value={gamesDone.toString()}
              icon={CheckCircle}
              variant="caregiver"
            />
            <StatCard
              label="Total Duration"
              value={durationMin.toString()}
              unit="min"
              icon={Clock}
              variant="neutral"
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              label="Avg Accuracy"
              value={avgAccuracy.toString()}
              unit="%"
              icon={Activity}
              variant="teal"
            />
            <StatCard
              label="Reminders"
              value={`${completedReminders}/${reminders.length}`}
              icon={Bell}
              variant="primary"
            />
          </View>
        </View>

        {/* Caregiver Actions Navigation */}
        <SectionHeader title="Management & Tools" />
        
        <Pressable
          onPress={() => navigation.navigate('CaregiverMemoryBank')}
          style={({ pressed }) => [styles.actionLinkCard, pressed && styles.pressed]}
        >
          <View style={styles.actionIconBadge}>
            <Brain size={24} color={COLORS.caregiverPrimary} />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>
              Memory Bank Management ({memories.length} entries)
            </Text>
            <Text style={styles.actionSubtitle}>Add family members, stories & photos</Text>
          </View>
          <ChevronRight size={22} color={COLORS.textMuted} />
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('CaregiverReminders')}
          style={({ pressed }) => [styles.actionLinkCard, pressed && styles.pressed]}
        >
          <View style={styles.actionIconBadge}>
            <Bell size={24} color={COLORS.primaryTeal} />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>
              Reminder Management ({reminders.length} scheduled)
            </Text>
            <Text style={styles.actionSubtitle}>Schedule medicine, meals & appointments</Text>
          </View>
          <ChevronRight size={22} color={COLORS.textMuted} />
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate('PatientDetails')}
          style={({ pressed }) => [styles.actionLinkCard, pressed && styles.pressed]}
        >
          <View style={styles.actionIconBadge}>
            <Users size={24} color={COLORS.primary} />
          </View>
          <View style={styles.actionTextContainer}>
            <Text style={styles.actionTitle}>Detailed Patient Profile</Text>
            <Text style={styles.actionSubtitle}>View full session history & activity trends</Text>
          </View>
          <ChevronRight size={22} color={COLORS.textMuted} />
        </Pressable>
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
  patientSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.cardBg,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginBottom: 16,
  },
  patientSelectorText: {
    ...TYPOGRAPHY.titleSmall,
    color: COLORS.textPrimary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownContent: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  dropdownTitle: {
    ...TYPOGRAPHY.titleMedium,
    color: COLORS.textPrimary,
    marginBottom: 16,
    textAlign: 'center',
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  dropdownItemSelected: {
    backgroundColor: COLORS.infoBg,
  },
  dropdownItemText: {
    ...TYPOGRAPHY.bodyLarge,
    color: COLORS.textPrimary,
  },
  caregiverHeaderCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    padding: 18,
    borderWidth: 2,
    borderColor: COLORS.caregiverLight,
    gap: 12,
    marginVertical: 8,
  },
  patientAvatarBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: COLORS.caregiverLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  patientHeaderInfo: {
    flex: 1,
  },
  patientName: {
    ...TYPOGRAPHY.titleMedium,
    color: COLORS.textPrimary,
  },
  patientMeta: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.successBg,
    borderColor: COLORS.successBorder,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
  },
  trendBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.success,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: COLORS.warningBg,
    borderColor: COLORS.warningBorder,
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 16,
    gap: 12,
    marginVertical: 8,
  },
  alertTextContainer: {
    flex: 1,
  },
  alertTitle: {
    ...TYPOGRAPHY.titleSmall,
    color: COLORS.warning,
  },
  alertBody: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textPrimary,
    marginTop: 2,
  },
  statsGrid: {
    gap: 8,
  },
  statsRow: {
    flexDirection: 'row',
  },
  actionLinkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    marginVertical: 6,
    gap: 14,
  },
  actionIconBadge: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: COLORS.caregiverLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionTextContainer: {
    flex: 1,
  },
  actionTitle: {
    ...TYPOGRAPHY.titleSmall,
    color: COLORS.textPrimary,
  },
  actionSubtitle: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  pressed: {
    opacity: 0.88,
    backgroundColor: COLORS.cardHover,
  },
});
