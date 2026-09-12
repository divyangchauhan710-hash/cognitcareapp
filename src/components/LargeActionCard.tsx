import React from 'react';
import { Pressable, Text, StyleSheet, View, ViewStyle } from 'react-native';
import { LucideIcon, ChevronRight } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { TYPOGRAPHY } from '../constants/typography';

interface LargeActionCardProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  onPress: () => void;
  variant?: 'hero' | 'standard' | 'teal' | 'caregiver';
  badgeText?: string;
  style?: ViewStyle;
}

export const LargeActionCard: React.FC<LargeActionCardProps> = ({
  title,
  subtitle,
  icon: Icon,
  onPress,
  variant = 'standard',
  badgeText,
  style,
}) => {
  const isHero = variant === 'hero';
  const isTeal = variant === 'teal';
  const isCaregiver = variant === 'caregiver';

  const getBgColor = () => {
    if (isHero) return COLORS.primary;
    if (isTeal) return COLORS.primaryTeal;
    if (isCaregiver) return COLORS.caregiverPrimary;
    return COLORS.cardBg;
  };

  const getTextColor = () => {
    if (isHero || isTeal || isCaregiver) return COLORS.textLight;
    return COLORS.textPrimary;
  };

  const getSubtitleColor = () => {
    if (isHero || isTeal || isCaregiver) return '#E2E8F0';
    return COLORS.textSecondary;
  };

  const getIconColor = () => {
    if (isHero || isTeal || isCaregiver) return COLORS.textLight;
    return COLORS.primary;
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        { backgroundColor: getBgColor() },
        !isHero && !isTeal && !isCaregiver && styles.bordered,
        pressed && styles.pressed,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={`${title}. ${subtitle || ''}`}
    >
      <View style={styles.topRow}>
        <View
          style={[
            styles.iconBadge,
            {
              backgroundColor:
                isHero || isTeal || isCaregiver
                  ? 'rgba(255, 255, 255, 0.2)'
                  : COLORS.infoBg,
            },
          ]}
        >
          <Icon size={isHero ? 32 : 26} color={getIconColor()} />
        </View>
        {badgeText && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{badgeText}</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={[styles.title, { color: getTextColor() }, isHero && styles.heroTitle]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: getSubtitleColor() }]}>
            {subtitle}
          </Text>
        )}
      </View>

      <View style={styles.actionRow}>
        <Text style={[styles.actionText, { color: getSubtitleColor() }]}>
          {isHero ? "Tap to begin" : "Open"}
        </Text>
        <ChevronRight size={20} color={getSubtitleColor()} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 20,
    marginVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  bordered: {
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.985 }],
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconBadge: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeContainer: {
    backgroundColor: COLORS.warningBg,
    borderColor: COLORS.warningBorder,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.warning,
  },
  content: {
    marginVertical: 4,
  },
  title: {
    ...TYPOGRAPHY.titleMedium,
  },
  heroTitle: {
    ...TYPOGRAPHY.titleLarge,
    fontSize: 26,
  },
  subtitle: {
    ...TYPOGRAPHY.bodyMedium,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 4,
  },
  actionText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
