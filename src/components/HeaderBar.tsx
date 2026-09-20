import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { User, Users } from 'lucide-react-native';
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
  pressed: {
    opacity: 0.8,
  },
});
