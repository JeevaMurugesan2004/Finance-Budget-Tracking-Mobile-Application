import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, UserRole } from '../types';
import {
  defaultAdminProfile,
  defaultCustomerProfile,
  loadStoredAuthSession,
  loadStoredProfile,
  saveStoredAuthSession,
  saveStoredProfile,
} from '../utils/storage';
import { normalizeRole } from '../utils/roleUtils';

interface AuthContextType {
  user: UserProfile | null;
  role: 'admin' | 'customer' | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string, selectedRole: UserRole) => Promise<{ success: boolean; error?: string }>;
  signUp: (name: string, email: string, phone: string, password: string, selectedRole: UserRole) => Promise<{ success: boolean; error?: string }>;
  updateProfile: (updatedData: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  switchRole: (targetRole?: UserRole) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<'admin' | 'customer' | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load persisted session on app launch
  useEffect(() => {
    const initAuth = async () => {
      try {
        const session = await loadStoredAuthSession();
        if (session.isAuthenticated && session.role) {
          const resolvedRole = normalizeRole(session.role);
          // Re-load fresh profile from disk for this role
          const freshProfile = await loadStoredProfile(resolvedRole);
          const cleanUser: UserProfile = {
            ...freshProfile,
            role: resolvedRole,
          };
          setUser(cleanUser);
          setRole(resolvedRole);
          setIsAuthenticated(true);
        }
      } catch (e) {
        console.error('Failed to restore session:', e);
      } finally {
        setIsLoading(false);
      }
    };
    initAuth();
  }, []);

  const signIn = async (
    email: string,
    _password: string,
    selectedRole: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      let determinedRole: 'admin' | 'customer' = normalizeRole(selectedRole);

      // Explicit demo email checks to ensure demo accounts always map to their expected role
      if (cleanEmail === 'admin@example.in') {
        determinedRole = 'admin';
      } else if (cleanEmail === 'customer@example.in') {
        determinedRole = 'customer';
      }

      const storedProfile = await loadStoredProfile(determinedRole);
      const effectiveUser: UserProfile = {
        ...storedProfile,
        email: email.trim() || storedProfile.email,
        role: determinedRole,
      };

      setUser(effectiveUser);
      setRole(determinedRole);
      setIsAuthenticated(true);

      await saveStoredAuthSession({
        isAuthenticated: true,
        role: determinedRole,
        user: effectiveUser,
      });

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Login failed' };
    }
  };

  const signUp = async (
    name: string,
    email: string,
    phone: string,
    _password: string,
    selectedRole: UserRole
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const resolvedRole = normalizeRole(selectedRole);
      const newProfile: UserProfile = {
        id: `usr-${Date.now()}`,
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        role: resolvedRole,
        avatar: resolvedRole === 'admin' ? defaultAdminProfile.avatar : defaultCustomerProfile.avatar,
        memberSince: new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' }),
      };

      await saveStoredProfile(newProfile);

      setUser(newProfile);
      setRole(resolvedRole);
      setIsAuthenticated(true);

      await saveStoredAuthSession({
        isAuthenticated: true,
        role: resolvedRole,
        user: newProfile,
      });

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Sign up failed' };
    }
  };

  const updateProfile = async (
    updatedData: Partial<UserProfile>
  ): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'User is not authenticated' };
    }

    try {
      const updated: UserProfile = {
        ...user,
        ...updatedData,
        id: user.id, // Immutable
        role: normalizeRole(user.role), // Normalized
      };

      await saveStoredProfile(updated);
      setUser(updated);

      await saveStoredAuthSession({
        isAuthenticated: true,
        role: normalizeRole(user.role),
        user: updated,
      });

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to save profile' };
    }
  };

  const switchRole = async (targetRole?: UserRole) => {
    try {
      const nextRole: 'admin' | 'customer' = targetRole
        ? normalizeRole(targetRole)
        : (normalizeRole(role) === 'admin' ? 'customer' : 'admin');

      const freshProfile = await loadStoredProfile(nextRole);
      const cleanUser: UserProfile = {
        ...freshProfile,
        role: nextRole,
      };

      setUser(cleanUser);
      setRole(nextRole);
      setIsAuthenticated(true);

      await saveStoredAuthSession({
        isAuthenticated: true,
        role: nextRole,
        user: cleanUser,
      });
    } catch (err) {
      console.error('Error switching role:', err);
    }
  };

  const signOut = async () => {
    setUser(null);
    setRole(null);
    setIsAuthenticated(false);
    await saveStoredAuthSession({
      isAuthenticated: false,
      role: null,
      user: null,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated,
        isLoading,
        signIn,
        signUp,
        updateProfile,
        switchRole,
        signOut,
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
