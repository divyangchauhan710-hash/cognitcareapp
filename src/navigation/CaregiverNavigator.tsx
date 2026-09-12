import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CaregiverDashboardScreen } from '../screens/caregiver/CaregiverDashboardScreen';
import { PatientDetailScreen } from '../screens/caregiver/PatientDetailScreen';
import { CaregiverMemoryBankScreen } from '../screens/caregiver/CaregiverMemoryBankScreen';
import { CaregiverRemindersScreen } from '../screens/caregiver/CaregiverRemindersScreen';

const Stack = createNativeStackNavigator();

export const CaregiverNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CaregiverDashboard" component={CaregiverDashboardScreen} />
      <Stack.Screen name="PatientDetails" component={PatientDetailScreen} />
      <Stack.Screen name="CaregiverMemoryBank" component={CaregiverMemoryBankScreen} />
      <Stack.Screen name="CaregiverReminders" component={CaregiverRemindersScreen} />
    </Stack.Navigator>
  );
};
