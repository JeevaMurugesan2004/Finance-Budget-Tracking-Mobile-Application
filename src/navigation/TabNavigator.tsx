import React from 'react';
import { StyleSheet, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AdminRestrictedView } from '../components/AdminRestrictedView';
import { useAuth } from '../context/AuthContext';
import { AnalysisScreen } from '../screens/AnalysisScreen';
import { CategoriesScreen } from '../screens/CategoriesScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { TransactionsScreen } from '../screens/TransactionsScreen';
import { colors } from '../theme/colors';
import { MainTabParamList } from '../types';

const Tab = createBottomTabNavigator<MainTabParamList>();

import { isCustomerRole, normalizeRole } from '../utils/roleUtils';

const TransactionsTabScreen: React.FC = () => {
  const { role, user } = useAuth();
  const isCustomer = isCustomerRole(role || user?.role);
  if (!isCustomer) {
    return <AdminRestrictedView featureName="Month-wise Transactions" />;
  }
  return <TransactionsScreen />;
};

const CategoriesTabScreen: React.FC = () => {
  const { role, user } = useAuth();
  const isCustomer = isCustomerRole(role || user?.role);
  if (!isCustomer) {
    return <AdminRestrictedView featureName="Overall Categories" />;
  }
  return <CategoriesScreen />;
};

export const TabNavigator: React.FC = () => {
  const { role, user } = useAuth();
  const activeRole = normalizeRole(role || user?.role);

  const renderTabIcon = (
    focused: boolean,
    iconName: keyof typeof Ionicons.glyphMap
  ) => {
    return (
      <View style={[styles.iconContainer, focused && styles.iconContainerActive]}>
        <Ionicons
          name={iconName}
          size={22}
          color={focused ? colors.textWhite : colors.navInactive}
        />
      </View>
    );
  };

  return (
    <Tab.Navigator
      key={`main-tabs-${activeRole}`}
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false, // Clean outline icon presentation matching reference
        tabBarStyle: styles.tabBar,
      }}
    >
      {/* 1. Home */}
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ focused }) => renderTabIcon(focused, 'home-outline'),
        }}
      />

      {/* 2. Analysis */}
      <Tab.Screen
        name="AnalysisTab"
        component={AnalysisScreen}
        options={{
          tabBarIcon: ({ focused }) => renderTabIcon(focused, 'pie-chart-outline'),
        }}
      />

      {/* 3. Transactions */}
      <Tab.Screen
        name="TransactionsTab"
        component={TransactionsTabScreen}
        options={{
          tabBarIcon: ({ focused }) => renderTabIcon(focused, 'wallet-outline'),
        }}
      />

      {/* 4. Categories */}
      <Tab.Screen
        name="CategoriesTab"
        component={CategoriesTabScreen}
        options={{
          tabBarIcon: ({ focused }) => renderTabIcon(focused, 'grid-outline'),
        }}
      />

      {/* 5. Profile */}
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => renderTabIcon(focused, 'person-outline'),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#EDFCF2', // Pale mint-green from reference
    borderTopLeftRadius: 28,     // Rounded upper edge
    borderTopRightRadius: 28,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#CCEEDD',
    height: 70,
    paddingTop: 8,
    paddingBottom: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 8,
    shadowColor: '#062D2A',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  iconContainer: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 14,
  },
  iconContainerActive: {
    backgroundColor: colors.primary, // Bright teal #00CDA0 rounded square/pill
    elevation: 2,
    shadowColor: '#00CDA0',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});
