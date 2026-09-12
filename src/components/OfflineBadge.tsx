import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { useSync } from '../context/SyncContext';

export const OfflineBadge: React.FC = () => {
  const { isOnline, pendingSyncCount, toggleNetwork } = useSync();

  return (
    <Pressable
      onPress={toggleNetwork}
      style={({ pressed }) => [
        styles.container,
        isOnline ? styles.onlineContainer : styles.offlineContainer,
        pressed && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Network mode: ${isOnline ? 'Online' : 'Offline'}. Tap to toggle.`}
    >
      {isOnline ? (
        <>
          <Wifi size={18} color={COLORS.success} />
          <Text style={styles.onlineText}>Online</Text>
        </>
      ) : (
        <>
          <WifiOff size={18} color={COLORS.warning} />
          <Text style={styles.offlineText}>
            Offline {pendingSyncCount > 0 ? `(${pendingSyncCount} pending)` : ''}
          </Text>
        </>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  onlineContainer: {
    backgroundColor: COLORS.successBg,
    borderColor: COLORS.successBorder,
  },
  offlineContainer: {
    backgroundColor: COLORS.warningBg,
    borderColor: COLORS.warningBorder,
  },
  onlineText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.success,
  },
  offlineText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.warning,
  },
  pressed: {
    opacity: 0.8,
  },
});
