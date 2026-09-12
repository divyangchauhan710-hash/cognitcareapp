import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { PatientNavigator } from './PatientNavigator';
import { CaregiverNavigator } from './CaregiverNavigator';

export const RootNavigator = () => {
  const { currentUser, role } = useAuth();

  if (!currentUser) {
    return (
      <NavigationContainer>
        <LoginScreen />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      {role === 'caregiver' ? <CaregiverNavigator /> : <PatientNavigator />}
    </NavigationContainer>
  );
};
