import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert, Image, Pressable } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { HeaderBar } from '../../components/HeaderBar';
import { PrimaryButton } from '../../components/PrimaryButton';
import { SecondaryButton } from '../../components/SecondaryButton';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import * as ImagePicker from 'expo-image-picker';
import { User, Users, Camera, LogOut } from 'lucide-react-native';

export const ProfileScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { currentUser, role, logout } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(currentUser?.pfp_url || null);
  const [emergencyContact, setEmergencyContact] = useState(currentUser?.emergency_contact || '');

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
      base64: true,
    });

    if (!result.canceled && result.assets[0].base64) {
      const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
      setProfileImage(base64Image);
      // TODO: Send to backend to save
    }
  };

  const handleSave = async () => {
    // TODO: Send profileImage and emergencyContact to backend
    Alert.alert("Success", "Profile updated successfully");
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar title="Profile" showBackButton onBackPress={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.container}>
        
        <View style={styles.profileHeader}>
          <Pressable onPress={pickImage} style={styles.imageContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <User size={40} color={COLORS.textSecondary} />
              </View>
            )}
            <View style={styles.editBadge}>
              <Camera size={14} color="#FFF" />
            </View>
          </Pressable>
          <Text style={styles.userName}>{currentUser?.name}</Text>
          <Text style={styles.userEmail}>{currentUser?.email}</Text>
          <View style={[styles.roleBadge, { backgroundColor: role === 'caregiver' ? COLORS.caregiverLight : COLORS.infoBg }]}>
            <Text style={[styles.roleBadgeText, { color: role === 'caregiver' ? COLORS.caregiverPrimary : COLORS.primary }]}>
              {role?.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contact</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. +1 234 567 8900"
            value={emergencyContact}
            onChangeText={setEmergencyContact}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.section}>
          <SecondaryButton 
            title="Manage Connections" 
            onPress={() => navigation.navigate('Connections')} 
            icon={Users}
            style={{ marginBottom: 16 }}
          />
          <PrimaryButton title="Save Changes" onPress={handleSave} variant={role === 'caregiver' ? 'caregiver' : 'primary'} />
        </View>

        <View style={[styles.section, { marginTop: 24 }]}>
          <SecondaryButton 
            title="Log Out" 
            onPress={handleLogout} 
            icon={LogOut}
            style={styles.logoutButton}
            textStyle={styles.logoutText}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: COLORS.background },
  container: { padding: 20 },
  profileHeader: { alignItems: 'center', marginBottom: 24 },
  imageContainer: { position: 'relative', marginBottom: 16 },
  profileImage: { width: 100, height: 100, borderRadius: 50 },
  profileImagePlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: COLORS.cardBg, justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: COLORS.cardBorder },
  editBadge: { position: 'absolute', bottom: 0, right: 0, backgroundColor: COLORS.primary, width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: COLORS.background },
  userName: { ...TYPOGRAPHY.titleMedium, color: COLORS.textPrimary, marginBottom: 4 },
  userEmail: { ...TYPOGRAPHY.bodyMedium, color: COLORS.textSecondary, marginBottom: 8 },
  roleBadge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 12 },
  roleBadgeText: { ...TYPOGRAPHY.caption, fontWeight: '700' },
  section: { marginBottom: 20 },
  sectionTitle: { ...TYPOGRAPHY.titleSmall, color: COLORS.textPrimary, marginBottom: 12 },
  input: { backgroundColor: COLORS.cardBg, borderWidth: 1, borderColor: COLORS.cardBorder, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, ...TYPOGRAPHY.bodyLarge, color: COLORS.textPrimary },
  logoutButton: { borderColor: COLORS.danger, backgroundColor: '#FFF0F0' },
  logoutText: { color: COLORS.danger },
});
