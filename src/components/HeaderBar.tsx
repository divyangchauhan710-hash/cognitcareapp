import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { User, Users, ShieldAlert } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { OfflineBadge } from './OfflineBadge';
import { COLORS } from '../constants/colors';
import { TYPOGRAPHY } from '../constants/typography';
import { useNavigation } from '@react-navigation/native';

interface HeaderBarProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ title, showBackButton, onBackPress }) => {
  const { currentUser, role } = useAuth();
  const navigation = useNavigation();

  const handleRoleToggle = () => {
    // We are no longer using this for demo toggle. 
    // It could be used by a caregiver to view patient portal if we want, but for now we leave it intact or remove it.
  };

  return (
    <View style={styles.header}>
      <Pressable 
        style={styles.leftContainer}
        onPress={() => navigation.navigate('Profile' as never)}
      >
        <View
          style={[
            styles.avatar,
            { backgroundColor: role === 'caregiver' ? COLORS.caregiverLight : COLORS.infoBg },
          ]}
        >
          {currentUser?.pfp_url ? (
            <Image source={{ uri: currentUser.pfp_url }} style={styles.avatarImage} />
          ) : role === 'caregiver' ? (
            <Users size={24} color={COLORS.caregiverPrimary} />
          ) : (
            <User size={24} color={COLORS.primary} />
          )}
        </View>
        <View style={{ flex: 1, marginRight: 8 }}>
          <Text style={styles.greeting} numberOfLines={1}>
            {title || (role === 'caregiver' ? 'Caregiver Portal' : 'CogniCare Companion')}
          </Text>
          <Text style={styles.userName} numberOfLines={1}>
            {currentUser ? currentUser.name : 'Guest'}
          </Text>
        </View>
      </Pressable>

      <View style={styles.rightContainer}>
        <OfflineBadge />
        <Pressable
          onPress={handleRoleToggle}
          style={({ pressed }) => [
            styles.roleSwitchBtn,
            role === 'caregiver' ? styles.caregiverBtn : styles.patientBtn,
            pressed && styles.pressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel={`Switch role to ${
            role === 'patient' ? 'Caregiver' : 'Patient'
          }`}
        >
          <ShieldAlert size={16} color={role === 'caregiver' ? COLORS.primary : COLORS.caregiverPrimary} />
          <Text
            style={[
              styles.roleSwitchText,
              { color: role === 'caregiver' ? COLORS.primary : COLORS.caregiverPrimary },
            ]}
          >
            {role === 'patient' ? 'Caregiver' : 'Patient'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.cardBg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.cardBorder,
  },
  leftContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  greeting: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
  },
  userName: {
    ...TYPOGRAPHY.titleSmall,
    color: COLORS.textPrimary,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  roleSwitchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1.5,
  },
  patientBtn: {
    borderColor: COLORS.caregiverPrimary,
    backgroundColor: COLORS.caregiverLight,
  },
  caregiverBtn: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.infoBg,
  },
  roleSwitchText: {
    fontSize: 13,
    fontWeight: '700',
  },
  pressed: {
    opacity: 0.8,
  },
});
