import React from 'react';
import { Pressable, Text, StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { COLORS } from '../constants/colors';
import { TYPOGRAPHY } from '../constants/typography';

interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  icon?: LucideIcon;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  title,
  onPress,
  icon: Icon,
  disabled = false,
  style,
  textStyle,
}) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        pressed && !disabled && styles.pressed,
        disabled && styles.disabled,
        style,
      ]}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      <View style={styles.contentContainer}>
        {Icon && (
          <Icon size={24} color={disabled ? COLORS.textMuted : COLORS.primary} />
        )}
        <Text style={[styles.text, disabled && styles.disabledText, textStyle]}>
          {title}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    minHeight: 54,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.cardBg,
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  text: {
    ...TYPOGRAPHY.buttonText,
    color: COLORS.primary,
  },
  pressed: {
    backgroundColor: COLORS.cardHover,
    borderColor: COLORS.primary,
  },
  disabled: {
    borderColor: COLORS.cardBorder,
    backgroundColor: COLORS.background,
  },
  disabledText: {
    color: COLORS.textMuted,
  },
});
