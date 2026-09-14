import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, ActivityIndicator, FlatList, Pressable } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { HeaderBar } from '../../components/HeaderBar';
import { PrimaryButton } from '../../components/PrimaryButton';
import { SecondaryButton } from '../../components/SecondaryButton';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { UserPlus, User, Check, X } from 'lucide-react-native';

const API_URL = "http://10.0.2.2:8000";

export const ConnectionsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { currentUser, role } = useAuth();
  const [patientEmail, setPatientEmail] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Data state
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [myPatients, setMyPatients] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, [role]);

  const fetchData = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      if (role === 'patient') {
        const res = await fetch(`${API_URL}/connections/pending/${currentUser.id}`);
        if (res.ok) setPendingRequests(await res.json());
      } else if (role === 'caregiver') {
        const res = await fetch(`${API_URL}/connections/my-patients/${currentUser.id}`);
        if (res.ok) setMyPatients(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestConnection = async () => {
    if (!patientEmail) return;
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/connections/request?caregiver_id=${currentUser.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patient_email: patientEmail })
      });
      if (res.ok) {
        Alert.alert("Success", "Connection request sent");
        setPatientEmail('');
      } else {
        const err = await res.json();
        Alert.alert("Error", err.detail || "Failed to send request");
      }
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (requestId: string, status: 'accepted' | 'rejected') => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/connections/respond/${requestId}?status=${status}`, {
        method: 'POST'
      });
      if (res.ok) {
        Alert.alert("Success", `Request ${status}`);
        fetchData();
      } else {
        const err = await res.json();
        Alert.alert("Error", err.detail || "Failed to respond");
      }
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar title="Connections" showBackButton onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.container}>
        
        {loading && <ActivityIndicator size="large" color={COLORS.primary} style={{ marginVertical: 12 }} />}

        {role === 'caregiver' ? (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Request New Patient</Text>
              <Text style={styles.description}>Enter the patient's email to request a connection. They will need to accept it from their account.</Text>
              
              <View style={styles.inputGroup}>
                <TextInput
                  style={styles.input}
                  placeholder="Patient's Email"
                  value={patientEmail}
                  onChangeText={setPatientEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <PrimaryButton title="Send Request" onPress={handleRequestConnection} variant="caregiver" icon={UserPlus} />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>My Patients</Text>
              {myPatients.length === 0 ? (
                <Text style={styles.emptyText}>You haven't connected with any patients yet.</Text>
              ) : (
                myPatients.map(p => (
                  <View key={p.id} style={styles.card}>
                    <User size={24} color={COLORS.caregiverPrimary} />
                    <View style={styles.cardInfo}>
                      <Text style={styles.cardTitle}>{p.name}</Text>
                      <Text style={styles.cardSubtitle}>{p.email}</Text>
                    </View>
                  </View>
                ))
              )}
            </View>
          </>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Pending Requests</Text>
              <Text style={styles.description}>Caregivers who want to connect with your account to help manage your memory training and reminders.</Text>
              
              {pendingRequests.length === 0 ? (
                <Text style={styles.emptyText}>No pending requests.</Text>
              ) : (
                pendingRequests.map(req => (
                  <View key={req.id} style={styles.card}>
                    <User size={24} color={COLORS.primary} />
                    <View style={styles.cardInfo}>
                      <Text style={styles.cardTitle}>Caregiver ID: {req.caregiver_id.substring(0,8)}...</Text>
                      <Text style={styles.cardSubtitle}>Wants to connect</Text>
                    </View>
                    <View style={styles.actionButtons}>
                      <Pressable style={[styles.actionBtn, styles.acceptBtn]} onPress={() => handleRespond(req.id, 'accepted')}>
                        <Check size={18} color="#FFF" />
                      </Pressable>
                      <Pressable style={[styles.actionBtn, styles.rejectBtn]} onPress={() => handleRespond(req.id, 'rejected')}>
                        <X size={18} color={COLORS.danger} />
                      </Pressable>
                    </View>
                  </View>
                ))
              )}
            </View>
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 20 },
  section: { marginBottom: 32 },
  sectionTitle: { ...TYPOGRAPHY.titleMedium, color: COLORS.textPrimary, marginBottom: 8 },
  description: { ...TYPOGRAPHY.bodyMedium, color: COLORS.textSecondary, marginBottom: 16 },
  inputGroup: { marginBottom: 16 },
  input: { backgroundColor: COLORS.cardBg, borderWidth: 1, borderColor: COLORS.cardBorder, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, ...TYPOGRAPHY.bodyLarge, color: COLORS.textPrimary },
  emptyText: { ...TYPOGRAPHY.bodyMedium, color: COLORS.textMuted, fontStyle: 'italic' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.cardBg, borderWidth: 1, borderColor: COLORS.cardBorder, borderRadius: 16, padding: 16, marginBottom: 12 },
  cardInfo: { flex: 1, marginLeft: 12 },
  cardTitle: { ...TYPOGRAPHY.titleSmall, color: COLORS.textPrimary },
  cardSubtitle: { ...TYPOGRAPHY.bodyMedium, color: COLORS.textSecondary, marginTop: 2 },
  actionButtons: { flexDirection: 'row', gap: 8 },
  actionBtn: { width: 36, height: 36, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  acceptBtn: { backgroundColor: COLORS.success },
  rejectBtn: { backgroundColor: '#FFF0F0', borderWidth: 1, borderColor: COLORS.danger },
});
