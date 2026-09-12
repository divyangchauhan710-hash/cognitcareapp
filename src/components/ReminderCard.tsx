import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Pill, Clock, CheckCircle, AlertTriangle, Check } from 'lucide-react-native';
import { ReminderItem } from '../types';
import { COLORS } from '../constants/colors';
import { TYPOGRAPHY } from '../constants/typography';

interface ReminderCardProps {
  reminder: ReminderItem;
  onComplete?: (id: string) => void;
  onSnooze?: (id: string) => void;
  compact?: boolean;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({
  reminder,
  onComplete,
  onSnooze,
  compact = false,
}) => {
  const isCompleted = reminder.status === 'completed';
  const isMissed = reminder.status === 'missed';

  const getStatusBg = () => {
    if (isCompleted) return COLORS.successBg;
    if (isMissed) return COLORS.dangerBg;
    return COLORS.warningBg;
  };

  const getStatusBorder = () => {
    if (isCompleted) return COLORS.successBorder;
    if (isMissed) return COLORS.dangerBorder;
    return COLORS.warningBorder;
  };

  const getStatusIcon = () => {
    if (isCompleted) return <CheckCircle size={20} color={COLORS.success} />;
    if (isMissed) return <AlertTriangle size={20} color={COLORS.danger} />;
    return <Clock size={20} color={COLORS.warning} />;
  };

  const getStatusLabel = () => {
    if (isCompleted) return 'Completed';
    if (isMissed) return 'Missed Reminder';
    return 'Upcoming';
  };

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: getStatusBg(), borderColor: getStatusBorder() },
      ]}
    >
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={styles.pillIconBadge}>
            <Pill size={24} color={COLORS.primary} />
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{reminder.title}</Text>
            <View style={styles.timeRow}>
              <Clock size={16} color={COLORS.textSecondary} />
              <Text style={styles.timeText}>{reminder.scheduledTime}</Text>
            </View>
          </View>
        </View>

        <View
          style={[
            styles.statusBadge,
            { borderColor: getStatusBorder(), backgroundColor: COLORS.cardBg },
          ]}
        >
          {getStatusIcon()}
          <Text
            style={[
              styles.statusText,
              {
                color: isCompleted
                  ? COLORS.success
                  : isMissed
                  ? COLORS.danger
                  : COLORS.warning,
              },
            ]}
          >
            {getStatusLabel()}
          </Text>
        </View>
      </View>

      {reminder.description ? (
        <Text style={styles.description}>{reminder.description}</Text>
      ) : null}

      {!compact && !isCompleted && onComplete && (
        <View style={styles.actionRow}>
          <Pressable
            onPress={() => onComplete(reminder.id)}
            style={({ pressed }) => [
              styles.takenButton,
              pressed && styles.pressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Mark ${reminder.title} as taken`}
          >
            <Check size={22} color={COLORS.textLight} />
            <Text style={styles.takenButtonText}>Taken</Text>
          </Pressable>

          {onSnooze && (
            <Pressable
              onPress={() => onSnooze(reminder.id)}
              style={({ pressed }) => [
                styles.snoozeButton,
                pressed && styles.pressed,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`Snooze ${reminder.title}`}
            >
              <Clock size={20} color={COLORS.textPrimary} />
              <Text style={styles.snoozeButtonText}>Remind Me Later</Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 18,
    padding: 18,
    marginVertical: 6,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  pillIconBadge: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: COLORS.infoBg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    ...TYPOGRAPHY.titleSmall,
    color: COLORS.textPrimary,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  timeText: {
    ...TYPOGRAPHY.bodyBold,
    color: COLORS.textSecondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '700',
  },
  description: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    marginTop: 12,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 16,
  },
  takenButton: {
    flex: 1,
    height: 50,
    backgroundColor: COLORS.success,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  takenButtonText: {
    ...TYPOGRAPHY.buttonText,
    color: COLORS.textLight,
  },
  snoozeButton: {
    flex: 1,
    height: 50,
    backgroundColor: COLORS.cardBg,
    borderWidth: 2,
    borderColor: COLORS.cardBorder,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  snoozeButtonText: {
    ...TYPOGRAPHY.buttonText,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  pressed: {
    opacity: 0.85,
  },
});
