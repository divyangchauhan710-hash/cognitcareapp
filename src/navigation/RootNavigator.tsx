import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { LoginScreen } from '../screens/auth/LoginScreen';
import { RegisterScreen } from '../screens/auth/RegisterScreen';
import { PatientNavigator } from './PatientNavigator';
import { CaregiverNavigator } from './CaregiverNavigator';

const AuthStack = createNativeStackNavigator();

export const RootNavigator = () => {
  const { currentUser, role } = useAuth();

  if (!currentUser) {
    return (
      <NavigationContainer>
        <AuthStack.Navigator screenOptions={{ headerShown: false }}>
          <AuthStack.Screen name="Login" component={LoginScreen} />
          <AuthStack.Screen name="Register" component={RegisterScreen} />
        </AuthStack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      {role === 'caregiver' ? <CaregiverNavigator /> : <PatientNavigator />}
    </NavigationContainer>
  );
};
