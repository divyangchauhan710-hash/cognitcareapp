import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import { SyncProvider } from './src/context/SyncContext';
import { DataProvider } from './src/context/DataContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <SyncProvider>
          <DataProvider>
            <StatusBar style="auto" />
            <RootNavigator />
          </DataProvider>
        </SyncProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
