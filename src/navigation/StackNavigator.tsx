import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { AddTransactionScreen } from '../screens/AddTransactionScreen';
import { CategoryDetailsScreen } from '../screens/CategoryDetailsScreen';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { EditTransactionScreen } from '../screens/EditTransactionScreen';
import { SignInScreen } from '../screens/SignInScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { SplashScreen } from '../screens/SplashScreen';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { RootStackParamList } from '../types';
import { DrawerNavigator } from './DrawerNavigator';

import { isCustomerRole, normalizeRole } from '../utils/roleUtils';

let hasShownInitialSplash = false;

export const markSplashComplete = () => {
  hasShownInitialSplash = true;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const StackNavigator: React.FC = () => {
  const { isAuthenticated, role, user } = useAuth();
  const activeRole = normalizeRole(role || user?.role);
  const isCustomer = isCustomerRole(activeRole);

  const initialRoute = isAuthenticated
    ? 'MainDrawer'
    : (hasShownInitialSplash ? 'SignIn' : 'Splash');

  return (
    <Stack.Navigator
      key={`stack-${isAuthenticated ? activeRole : (hasShownInitialSplash ? 'signed-out' : 'initial')}`}
      initialRouteName={initialRoute}
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}
    >
      {!isAuthenticated ? (
        // Authentication Stack
        <>
          {!hasShownInitialSplash && (
            <Stack.Screen name="Splash" component={SplashScreen} />
          )}
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
        </>
      ) : (
        // Authenticated Stack
        <>
          <Stack.Screen name="MainDrawer" component={DrawerNavigator} />

          {/* Customer Only Modals & Detail Screens */}
          {isCustomer && (
            <>
              <Stack.Screen
                name="AddTransaction"
                component={AddTransactionScreen}
                options={{ presentation: 'card' }}
              />
              <Stack.Screen
                name="EditTransaction"
                component={EditTransactionScreen}
                options={{ presentation: 'card' }}
              />
              <Stack.Screen
                name="EditProfile"
                component={EditProfileScreen}
                options={{ presentation: 'card' }}
              />
              <Stack.Screen
                name="CategoryDetails"
                component={CategoryDetailsScreen}
                options={{ presentation: 'card' }}
              />
            </>
          )}
        </>
      )}
    </Stack.Navigator>
  );
};
