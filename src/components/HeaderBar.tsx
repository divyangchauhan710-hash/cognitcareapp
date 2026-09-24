import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { User, Users, Volume2, VolumeX } from 'lucide-react-native';
import { useAuth } from '../context/AuthContext';
import { OfflineBadge } from './OfflineBadge';
import { COLORS } from '../constants/colors';
import { TYPOGRAPHY } from '../constants/typography';
import { useNavigation } from '@react-navigation/native';
import { VoiceService } from '../services/voiceService';

interface HeaderBarProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ title, showBackButton, onBackPress }) => {
  const { currentUser, role } = useAuth();
  const navigation = useNavigation();
  const [voiceEnabled, setVoiceEnabled] = useState(VoiceService.isVoiceEnabled);

  const toggleVoice = () => {
    setVoiceEnabled(VoiceService.toggleVoice());
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
        <Pressable onPress={toggleVoice} style={styles.voiceToggle}>
          {voiceEnabled ? (
            <Volume2 size={22} color={COLORS.primary} />
          ) : (
            <VolumeX size={22} color={COLORS.textSecondary} />
          )}
        </Pressable>
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
    gap: 12,
  },
  voiceToggle: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: COLORS.infoBg,
  },
  pressed: {
    opacity: 0.8,
  },
});
