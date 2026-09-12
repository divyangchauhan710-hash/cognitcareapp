import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { User, Users, ShieldAlert } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { OfflineBadge } from './OfflineBadge';
import { COLORS } from '../constants/colors';
import { TYPOGRAPHY } from '../constants/typography';

export const HeaderBar: React.FC = () => {
  const { currentUser, role, switchRole } = useAuth();

  const handleRoleToggle = () => {
    if (role === 'patient') {
      switchRole('caregiver');
    } else {
      switchRole('patient');
    }
  };

  return (
    <View style={styles.header}>
      <View style={styles.leftContainer}>
        <View
          style={[
            styles.avatar,
            {
              backgroundColor:
                role === 'caregiver'
                  ? COLORS.caregiverLight
                  : COLORS.infoBg,
            },
          ]}
        >
          {role === 'caregiver' ? (
            <Users size={24} color={COLORS.caregiverPrimary} />
          ) : (
            <User size={24} color={COLORS.primary} />
          )}
        </View>
        <View>
          <Text style={styles.greeting}>
            {role === 'caregiver' ? 'Caregiver Portal' : 'CogniCare Companion'}
          </Text>
          <Text style={styles.userName}>
            {currentUser ? currentUser.name : 'Guest'}
          </Text>
        </View>
      </View>

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
