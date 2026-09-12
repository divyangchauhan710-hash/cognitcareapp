import React, { createContext, useContext, useState } from 'react';
import { UserProfile, UserRole } from '../types';
import { DEMO_PATIENT, DEMO_CAREGIVER } from '../constants/demoData';

interface AuthContextType {
  currentUser: UserProfile | null;
  role: UserRole;
  loginAsPatient: () => void;
  loginAsCaregiver: () => void;
  switchRole: (newRole: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(DEMO_PATIENT);

  const role: UserRole = currentUser ? currentUser.role : 'patient';

  const loginAsPatient = () => {
    setCurrentUser(DEMO_PATIENT);
  };

  const loginAsCaregiver = () => {
    setCurrentUser(DEMO_CAREGIVER);
  };

  const switchRole = (newRole: UserRole) => {
    if (newRole === 'patient') {
      setCurrentUser(DEMO_PATIENT);
    } else {
      setCurrentUser(DEMO_CAREGIVER);
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        role,
        loginAsPatient,
        loginAsCaregiver,
        switchRole,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
