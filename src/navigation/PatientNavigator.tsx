import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PatientHomeScreen } from '../screens/patient/PatientHomeScreen';
import { GamesListScreen } from '../screens/patient/GamesListScreen';
import { MemoryRecallGameScreen } from '../screens/patient/MemoryRecallGameScreen';
import { AttentionGameScreen } from '../screens/patient/AttentionGameScreen';
import { GameResultsScreen } from '../screens/patient/GameResultsScreen';
import { MemoryBankScreen } from '../screens/patient/MemoryBankScreen';
import { PersonalizedMemoryActivityScreen } from '../screens/patient/PersonalizedMemoryActivityScreen';
import { RemindersScreen } from '../screens/patient/RemindersScreen';
import { ProgressScreen } from '../screens/patient/ProgressScreen';
import { ProfileScreen } from '../screens/shared/ProfileScreen';
import { ConnectionsScreen } from '../screens/shared/ConnectionsScreen';

const Stack = createNativeStackNavigator();

export const PatientNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PatientHome" component={PatientHomeScreen} />
      <Stack.Screen name="Games" component={GamesListScreen} />
      <Stack.Screen name="MemoryRecallGame" component={MemoryRecallGameScreen} />
      <Stack.Screen name="AttentionGame" component={AttentionGameScreen} />
      <Stack.Screen name="GameResults" component={GameResultsScreen} />
      <Stack.Screen name="MemoryBank" component={MemoryBankScreen} />
      <Stack.Screen name="PersonalizedMemoryActivity" component={PersonalizedMemoryActivityScreen} />
      <Stack.Screen name="Reminders" component={RemindersScreen} />
      <Stack.Screen name="Progress" component={ProgressScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Connections" component={ConnectionsScreen} />
    </Stack.Navigator>
  );
};
