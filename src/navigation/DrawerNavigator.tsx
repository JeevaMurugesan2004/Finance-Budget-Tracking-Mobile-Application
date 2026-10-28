import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
} from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { EditProfileScreen } from '../screens/EditProfileScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { colors } from '../theme/colors';
import { borderRadius, shadows, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { MainDrawerParamList, RootStackParamList } from '../types';
import { TabNavigator } from './TabNavigator';

import {
  formatRoleDisplay,
  isAdminRole,
  isCustomerRole,
  normalizeRole,
} from '../utils/roleUtils';

const Drawer = createDrawerNavigator<MainDrawerParamList>();

const CustomDrawerContent: React.FC<DrawerContentComponentProps> = (props) => {
  const { user, role, switchRole, signOut } = useAuth();

  const rootNavigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const activeRole = normalizeRole(role || user?.role);
  const isCustomer = isCustomerRole(activeRole);

  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const handleConfirmLogout = async () => {
    if (isLoggingOut) return;

    try {
      setIsLoggingOut(true);

      props.navigation.closeDrawer();

      await signOut();

      setLogoutModalVisible(false);

      rootNavigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    } catch (error) {
      console.error('Logout failed:', error);
      setLogoutModalVisible(false);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleCancelLogout = () => {
    if (isLoggingOut) return;
    setLogoutModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.drawerSafeContainer}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.drawerScroll}
      >
        {/* User Profile Header */}
        <View style={styles.userHeaderCard}>
          <View style={styles.avatarRow}>
            {user?.avatar ? (
              <Image
                source={{ uri: user.avatar }}
                style={styles.drawerAvatar}
              />
            ) : (
              <View style={styles.drawerAvatarPlaceholder}>
                <Text style={styles.drawerAvatarInitial}>
                  {user?.name
                    ? user.name.charAt(0).toUpperCase()
                    : 'U'}
                </Text>
              </View>
            )}

            <View
              style={[
                styles.roleBadge,
                {
                  backgroundColor: isAdminRole(activeRole)
                    ? colors.accentNavy
                    : colors.primary,
                },
              ]}
            >
              <Text style={styles.roleBadgeText}>
                {formatRoleDisplay(activeRole)}
              </Text>
            </View>
          </View>

          <Text style={styles.drawerUserName} numberOfLines={1}>
            {user?.name || 'User'}
          </Text>

          <Text style={styles.drawerUserEmail} numberOfLines={1}>
            {user?.email || 'user@example.in'}
          </Text>
        </View>

        <View style={styles.drawerItemsContainer}>
          {/* Home */}
          <TouchableOpacity
            style={styles.drawerItem}
            activeOpacity={0.7}
            onPress={() => {
              props.navigation.navigate('MainTabs', {
                screen: 'HomeTab',
              });
            }}
          >
            <Ionicons
              name="home-outline"
              size={22}
              color={colors.primary}
              style={styles.itemIcon}
            />
            <Text style={styles.itemLabel}>Home Dashboard</Text>
          </TouchableOpacity>

          {/* Financial Analysis */}
          <TouchableOpacity
            style={styles.drawerItem}
            activeOpacity={0.7}
            onPress={() => {
              props.navigation.navigate('MainTabs', {
                screen: 'AnalysisTab',
              });
            }}
          >
            <Ionicons
              name="pie-chart-outline"
              size={22}
              color={colors.primary}
              style={styles.itemIcon}
            />
            <Text style={styles.itemLabel}>Financial Analysis</Text>
          </TouchableOpacity>

          {/* Customer-Only Links */}
          {isCustomer && (
            <>
              <View style={styles.drawerSectionDivider}>
                <Text style={styles.sectionDividerText}>
                  FINANCIAL MANAGEMENT
                </Text>
              </View>

              <TouchableOpacity
                style={styles.drawerItem}
                activeOpacity={0.7}
                onPress={() => {
                  props.navigation.navigate('MainTabs', {
                    screen: 'TransactionsTab',
                  });
                }}
              >
                <Ionicons
                  name="wallet-outline"
                  size={22}
                  color={colors.primary}
                  style={styles.itemIcon}
                />
                <Text style={styles.itemLabel}>
                  Month-wise Transactions
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerItem}
                activeOpacity={0.7}
                onPress={() => {
                  props.navigation.navigate('MainTabs', {
                    screen: 'CategoriesTab',
                  });
                }}
              >
                <Ionicons
                  name="grid-outline"
                  size={22}
                  color={colors.primary}
                  style={styles.itemIcon}
                />
                <Text style={styles.itemLabel}>
                  Overall Categories
                </Text>
              </TouchableOpacity>

              <View style={styles.drawerSectionDivider}>
                <Text style={styles.sectionDividerText}>
                  ACCOUNT & SETTINGS
                </Text>
              </View>

              <TouchableOpacity
                style={styles.drawerItem}
                activeOpacity={0.7}
                onPress={() => {
                  props.navigation.navigate('DrawerProfile');
                }}
              >
                <Ionicons
                  name="person-outline"
                  size={22}
                  color={colors.primary}
                  style={styles.itemIcon}
                />
                <Text style={styles.itemLabel}>My Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.drawerItem}
                activeOpacity={0.7}
                onPress={() => {
                  props.navigation.navigate('DrawerEditProfile');
                }}
              >
                <Ionicons
                  name="create-outline"
                  size={22}
                  color={colors.primary}
                  style={styles.itemIcon}
                />
                <Text style={styles.itemLabel}>Edit Profile</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Account Switching */}
          <View style={styles.drawerSectionDivider}>
            <Text style={styles.sectionDividerText}>
              ACCOUNT SWITCHING
            </Text>
          </View>

          <TouchableOpacity
            style={styles.drawerItem}
            activeOpacity={0.7}
            onPress={async () => {
              props.navigation.closeDrawer();
              await switchRole();
            }}
          >
            <Ionicons
              name="swap-horizontal-outline"
              size={22}
              color={colors.primary}
              style={styles.itemIcon}
            />
            <Text style={styles.itemLabel}>
              Switch to{' '}
              {isCustomer
                ? 'Admin (Priya Patel)'
                : 'Customer (Aarav Sharma)'}
            </Text>
          </TouchableOpacity>

          {/* Admin Notice */}
          {!isCustomer && (
            <View style={styles.adminDrawerNotice}>
              <Ionicons
                name="information-circle-outline"
                size={18}
                color={colors.textSecondary}
              />
              <Text style={styles.adminDrawerNoticeText}>
                Customer-only transactional and profile screens are
                restricted from Admin accounts.
              </Text>
            </View>
          )}
        </View>
      </DrawerContentScrollView>

      {/* Drawer Footer */}
      <View style={styles.drawerFooter}>
        <TouchableOpacity
          style={styles.logoutRow}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons
            name="log-out-outline"
            size={22}
            color={colors.expense}
          />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>
          Finance & Budget Tracker v1.0.0 (INR)
        </Text>
      </View>

      {/* Custom Logout Confirmation Modal */}
      <Modal
        visible={logoutModalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={handleCancelLogout}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIcon}>
              <Ionicons
                name="log-out-outline"
                size={30}
                color="#E5484D"
              />
            </View>

            <Text style={styles.modalTitle}>Confirm Logout</Text>

            <Text style={styles.modalMessage}>
              Are you sure you want to log out of your session?
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  isLoggingOut && styles.disabledButton,
                ]}
                onPress={handleCancelLogout}
                disabled={isLoggingOut}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  isLoggingOut && styles.disabledButton,
                ]}
                onPress={handleConfirmLogout}
                disabled={isLoggingOut}
                activeOpacity={0.8}
              >
                {isLoggingOut ? (
                  <ActivityIndicator
                    size="small"
                    color="#FFFFFF"
                  />
                ) : (
                  <Text style={styles.confirmButtonText}>
                    Log Out
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export const DrawerNavigator: React.FC = () => {
  const { role, user } = useAuth();
  const activeRole = normalizeRole(role || user?.role);

  return (
    <Drawer.Navigator
      key={`drawer-${activeRole}`}
      drawerContent={(props) => (
        <CustomDrawerContent {...props} />
      )}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: 290,
          backgroundColor: colors.surface,
        },
      }}
    >
      <Drawer.Screen
        name="MainTabs"
        component={TabNavigator}
      />
      <Drawer.Screen
        name="DrawerProfile"
        component={ProfileScreen}
      />
      <Drawer.Screen
        name="DrawerEditProfile"
        component={EditProfileScreen}
      />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerSafeContainer: {
    flex: 1,
    backgroundColor: colors.surface,
  },

  drawerScroll: {
    paddingTop: 0,
  },

  userHeaderCard: {
    backgroundColor: colors.primaryUltraLight,
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    marginBottom: spacing.sm,
  },

  avatarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },

  drawerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: colors.primary,
  },

  drawerAvatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  drawerAvatarInitial: {
    ...typography.h2,
    color: colors.textWhite,
  },

  roleBadge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: borderRadius.full,
  },

  roleBadgeText: {
    ...typography.caption,
    color: colors.textWhite,
    fontWeight: '700',
    fontSize: 11,
  },

  drawerUserName: {
    ...typography.subtitle1,
    color: colors.textPrimary,
    fontWeight: '700',
  },

  drawerUserEmail: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },

  drawerItemsContainer: {
    paddingHorizontal: spacing.md,
    paddingTop: spacing.xs,
  },

  drawerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.md - 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    marginBottom: 4,
  },

  itemIcon: {
    marginRight: spacing.md,
  },

  itemLabel: {
    ...typography.body1,
    color: colors.textPrimary,
    fontWeight: '600',
    flexShrink: 1,
  },

  drawerSectionDivider: {
    marginTop: spacing.md,
    marginBottom: spacing.xs,
    paddingHorizontal: spacing.md,
  },

  sectionDividerText: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '700',
    fontSize: 10,
    letterSpacing: 0.5,
  },

  adminDrawerNotice: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceVariant,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginTop: spacing.lg,
    gap: spacing.sm,
  },

  adminDrawerNoticeText: {
    ...typography.caption,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 16,
  },

  drawerFooter: {
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    padding: spacing.lg,
  },

  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.xs,
  },

  logoutText: {
    ...typography.subtitle2,
    color: colors.expense,
    fontWeight: '700',
  },

  versionText: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.md,
    fontSize: 11,
  },

  // Custom Logout Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.58)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },

  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
  },

  modalIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },

  modalTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },

  modalMessage: {
    ...typography.body2,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },

  modalActions: {
    flexDirection: 'row',
    width: '100%',
    gap: spacing.sm,
  },

  cancelButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelButtonText: {
    color: colors.textPrimary,
    fontWeight: '700',
  },

  confirmButton: {
    flex: 1,
    minHeight: 48,
    borderRadius: borderRadius.md,
    backgroundColor: '#E5484D',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },

  confirmButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  disabledButton: {
    opacity: 0.6,
  },
});