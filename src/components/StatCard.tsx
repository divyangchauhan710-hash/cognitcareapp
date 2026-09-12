import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { TYPOGRAPHY } from '../constants/typography';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  unit?: string;
  variant?: 'primary' | 'teal' | 'caregiver' | 'neutral';
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  icon: Icon,
  unit,
  variant = 'neutral',
}) => {
  const getIconColor = () => {
    switch (variant) {
      case 'primary':
        return COLORS.primary;
      case 'teal':
        return COLORS.primaryTeal;
      case 'caregiver':
        return COLORS.caregiverPrimary;
      default:
        return COLORS.primary;
    }
  };

  const getBgColor = () => {
    switch (variant) {
      case 'primary':
        return COLORS.infoBg;
      case 'teal':
        return '#F0FDFA';
      case 'caregiver':
        return COLORS.caregiverLight;
      default:
        return COLORS.cardBg;
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: getBgColor() }]}>
      <View style={styles.headerRow}>
        <View style={styles.iconContainer}>
          <Icon size={24} color={getIconColor()} />
        </View>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={styles.valueRow}>
        <Text style={styles.value}>{value}</Text>
        {unit && <Text style={styles.unit}>{unit}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.cardBorder,
    marginHorizontal: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    flexShrink: 1,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  value: {
    ...TYPOGRAPHY.statValue,
    color: COLORS.textPrimary,
  },
  unit: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    fontWeight: '600',
  },
});
