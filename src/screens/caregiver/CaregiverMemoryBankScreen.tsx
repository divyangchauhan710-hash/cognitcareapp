import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Brain, ArrowLeft, Plus, User, MapPin, Trash2 } from 'lucide-react-native';
import { HeaderBar } from '../../components/HeaderBar';
import { SectionHeader } from '../../components/SectionHeader';
import { SecondaryButton } from '../../components/SecondaryButton';
import { PrimaryButton } from '../../components/PrimaryButton';
import { COLORS } from '../../constants/colors';
import { TYPOGRAPHY } from '../../constants/typography';
import { useData } from '../../context/DataContext';

export const CaregiverMemoryBankScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { memories, addMemory, deleteMemory } = useData();

  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [description, setDescription] = useState('');

  const handleAddMemory = () => {
    if (!name.trim() || !relationship.trim()) return;
    addMemory({
      patientId: 'patient-rita-72',
      name,
      relationship,
      description: description || `${name} is Rita's ${relationship}.`,
      category: 'family',
    });
    setName('');
    setRelationship('');
    setDescription('');
    setShowAddForm(false);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar />
      <ScrollView contentContainerStyle={styles.container}>
        <SecondaryButton
          title="Back to Caregiver Dashboard"
          icon={ArrowLeft}
          onPress={() => navigation.goBack()}
          style={{ marginBottom: 16 }}
        />

        <SectionHeader
          title="Caregiver Memory Bank Management"
          subtitle="Add and manage personalized memories for Rita Devi"
          action={
            <PrimaryButton
              title={showAddForm ? 'Cancel' : 'Add Memory'}
              icon={Plus}
              variant="caregiver"
              onPress={() => setShowAddForm(!showAddForm)}
              style={{ minHeight: 44, paddingVertical: 8, paddingHorizontal: 14 }}
              textStyle={{ fontSize: 15 }}
            />
          }
        />

        {showAddForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>New Memory Entry</Text>
            
            <Text style={styles.inputLabel}>Name / Subject</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Aarav"
              placeholderTextColor={COLORS.textMuted}
              value={name}
              onChangeText={setName}
            />

            <Text style={styles.inputLabel}>Relationship / Category</Text>
            <TextInput
              style={styles.textInput}
              placeholder="e.g. Grandson"
              placeholderTextColor={COLORS.textMuted}
              value={relationship}
              onChangeText={setRelationship}
            />

            <Text style={styles.inputLabel}>Description / Key Detail</Text>
            <TextInput
              style={[styles.textInput, styles.multilineInput]}
              placeholder="e.g. Enjoys playing chess and visits every Sunday."
              placeholderTextColor={COLORS.textMuted}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
            />

            <PrimaryButton
              title="Save Memory Entry"
              icon={Plus}
              variant="success"
              onPress={handleAddMemory}
              style={{ marginTop: 12 }}
            />
          </View>
        )}

        {memories.map((item) => (
          <View key={item.id} style={styles.memoryCard}>
            <View style={styles.iconBadge}>
              {item.category === 'place' ? (
                <MapPin size={24} color={COLORS.primaryTeal} />
              ) : (
                <User size={24} color={COLORS.caregiverPrimary} />
              )}
            </View>
            <View style={styles.memoryContent}>
              <View style={styles.titleRow}>
                <Text style={styles.memoryTitle}>{item.name}</Text>
                <View style={styles.relationBadge}>
                  <Text style={styles.relationText}>{item.relationship}</Text>
                </View>
              </View>
              <Text style={styles.memoryDescription}>{item.description}</Text>
            </View>
            <SecondaryButton
              title=""
              icon={Trash2}
              onPress={() => deleteMemory(item.id)}
              style={styles.deleteBtn}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    padding: 16,
  },
  formCard: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 18,
    borderWidth: 2,
    borderColor: COLORS.caregiverPrimary,
    marginBottom: 16,
  },
  formTitle: {
    ...TYPOGRAPHY.titleSmall,
    color: COLORS.caregiverPrimary,
    marginBottom: 12,
  },
  inputLabel: {
    ...TYPOGRAPHY.caption,
    color: COLORS.textSecondary,
    marginTop: 8,
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: COLORS.background,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  memoryCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    padding: 16,
    borderWidth: 1.5,
    borderColor: COLORS.cardBorder,
    marginBottom: 12,
    gap: 12,
    alignItems: 'center',
  },
  iconBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: COLORS.caregiverLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  memoryContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memoryTitle: {
    ...TYPOGRAPHY.titleSmall,
    color: COLORS.textPrimary,
  },
  relationBadge: {
    backgroundColor: COLORS.caregiverLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  relationText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.caregiverPrimary,
  },
  memoryDescription: {
    ...TYPOGRAPHY.bodyMedium,
    color: COLORS.textSecondary,
    marginTop: 6,
  },
  deleteBtn: {
    minHeight: 44,
    width: 44,
    paddingHorizontal: 0,
    borderColor: COLORS.dangerBorder,
  },
});
