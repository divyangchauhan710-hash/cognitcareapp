import React from 'react';
import { Pressable, Text, StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import { COLORS } from '../constants/colors';
import { TYPOGRAPHY } from '../constants/typography';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  icon?: any;
  variant?: 'primary' | 'teal' | 'caregiver' | 'success' | 'danger' | 'hero';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  subtitle?: string;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  icon: Icon,
  variant = 'primary',
  disabled = false,
  style,
  textStyle,
  subtitle,
}) => {
  const getBackgroundColor = () => {
    if (disabled) return COLORS.buttonSecondaryBg;
    switch (variant) {
      case 'teal':
        return COLORS.primaryTeal;
      case 'caregiver':
        return COLORS.caregiverPrimary;
      case 'success':
        return COLORS.success;
      case 'danger':
        return COLORS.danger;
      default:
        return COLORS.buttonPrimaryBg;
    }
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: getBackgroundColor() },
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={styles.contentContainer}>
        {Icon && (
          <View style={styles.iconWrapper}>
            <Icon size={26} color={disabled ? COLORS.textMuted : COLORS.textLight} />
          </View>
        )}
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.text,
              disabled && styles.disabledText,
              textStyle,
            ]}
          >
            {title}
          </Text>
          {subtitle && (
            <Text style={[styles.subtitle, disabled && styles.disabledText]}>
              {subtitle}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 58,
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  iconWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    alignItems: 'center',
  },
  text: {
    ...TYPOGRAPHY.buttonText,
    color: COLORS.buttonPrimaryText,
    textAlign: 'center',
  },
  subtitle: {
    ...TYPOGRAPHY.caption,
    color: '#E2E8F0',
    marginTop: 2,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.99 }],
  },
  disabled: {
    elevation: 0,
    shadowOpacity: 0,
  },
  disabledText: {
    color: COLORS.textMuted,
  },
});
