import React, { useState } from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { AppButton } from '../components/AppButton';
import { useAuth } from '../context/AuthContext';
import { useFinance } from '../context/FinanceContext';
import { colors } from '../theme/colors';
import { borderRadius, shadows, spacing } from '../theme/spacing';
import { typography } from '../theme/typography';
import { MainDrawerParamList, RootStackParamList } from '../types';
import {
  formatRoleDisplay,
  isAdminRole,
  isCustomerRole,
  normalizeRole,
} from '../utils/roleUtils';

type ModalType = 'logout' | 'reset';

export const ProfileScreen: React.FC = () => {
  const { user, role, switchRole, signOut } = useAuth();
  const { resetAllData } = useFinance();

  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const drawerNavigation =
    useNavigation<DrawerNavigationProp<MainDrawerParamList>>();

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<ModalType>('logout');
  const [isProcessing, setIsProcessing] = useState(false);

  const activeRole = normalizeRole(role || user?.role);
  const isCustomer = isCustomerRole(activeRole);

  const openConfirmationModal = (type: ModalType) => {
    setModalType(type);
    setModalVisible(true);
  };

  const closeConfirmationModal = () => {
    if (isProcessing) return;
    setModalVisible(false);
  };

  const handleLogout = () => {
    openConfirmationModal('logout');
  };

  const handleResetData = () => {
    openConfirmationModal('reset');
  };

  const handleConfirmAction = async () => {
    if (isProcessing) return;

    try {
      setIsProcessing(true);

      if (modalType === 'logout') {
        await signOut();
      } else {
        await resetAllData();
      }

      setModalVisible(false);
    } catch (error) {
      console.error(
        modalType === 'logout'
          ? 'Logout failed:'
          : 'Reset demo data failed:',
        error,
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const isLogoutModal = modalType === 'logout';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.drawerToggle}
            onPress={() => drawerNavigation.openDrawer()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="menu-outline"
              size={26}
              color={colors.textPrimary}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>My Profile</Text>

          <View style={{ width: 44 }} />
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrap}>
            {user?.avatar ? (
              <Image
                source={{ uri: user.avatar }}
                style={styles.avatarImg}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarInitial}>
                  {user?.name
                    ? user.name.charAt(0).toUpperCase()
                    : isCustomer
                      ? 'C'
                      : 'A'}
                </Text>
              </View>
            )}

            <View
              style={[
                styles.roleTag,
                {
                  backgroundColor: isAdminRole(activeRole)
                    ? colors.accentNavy
                    : colors.primary,
                },
              ]}
            >
              <Text style={styles.roleTagText}>
                {formatRoleDisplay(activeRole)}
              </Text>
            </View>
          </View>

          <Text style={styles.userName}>
            {user?.name || (isCustomer ? 'Aarav Sharma' : 'Priya Patel')}
          </Text>

          <Text style={styles.userEmail}>
            {user?.email ||
              (isCustomer
                ? 'customer@example.in'
                : 'admin@example.in')}
          </Text>

          {isCustomer ? (
            <AppButton
              title="Edit Profile"
              onPress={() => navigation.navigate('EditProfile')}
              variant="outline"
              size="sm"
              leftIcon="create-outline"
              style={styles.editBtn}
            />
          ) : (
            <View style={styles.adminBadgeNotice}>
              <Ionicons
                name="shield-checkmark"
                size={16}
                color={colors.primary}
              />
              <Text style={styles.adminBadgeNoticeText}>
                Administrator Account
              </Text>
            </View>
          )}
        </View>

        {/* Personal Information */}
        <View style={styles.infoGroupCard}>
          <Text style={styles.groupHeading}>Personal Information</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Ionicons
                name="person-outline"
                size={20}
                color={colors.primary}
              />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>
                {user?.name || 'Not provided'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Ionicons
                name="mail-outline"
                size={20}
                color={colors.primary}
              />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email Address</Text>
              <Text style={styles.infoValue}>
                {user?.email || 'Not provided'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Ionicons
                name="call-outline"
                size={20}
                color={colors.primary}
              />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Indian Mobile Number</Text>
              <Text style={styles.infoValue}>
                {user?.phone || '+91 98765 43210'}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color={colors.primary}
              />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Member Since</Text>
              <Text style={styles.infoValue}>
                {user?.memberSince || 'March 2026'}
              </Text>
            </View>
          </View>
        </View>

        {/* App Preferences */}
        <View style={styles.infoGroupCard}>
          <Text style={styles.groupHeading}>App Preferences</Text>

          <View style={styles.prefRow}>
            <View style={styles.prefLeft}>
              <Ionicons
                name="cash-outline"
                size={20}
                color={colors.textPrimary}
              />
              <Text style={styles.prefTitle}>Currency</Text>
            </View>

            <Text style={styles.prefValue}>Indian Rupee (₹ INR)</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.prefRow}>
            <View style={styles.prefLeft}>
              <Ionicons
                name="cloud-offline-outline"
                size={20}
                color={colors.textPrimary}
              />
              <Text style={styles.prefTitle}>Storage Mode</Text>
            </View>

            <Text style={styles.prefValue}>AsyncStorage (Local)</Text>
          </View>
        </View>

        {/* Reset & Logout Buttons */}
        <View style={styles.footerActions}>
          <AppButton
            title={`Switch to ${
              isCustomer
                ? 'Admin (Priya Patel)'
                : 'Customer (Aarav Sharma)'
            }`}
            onPress={async () => {
              await switchRole();
            }}
            variant="outline"
            leftIcon="swap-horizontal-outline"
            style={styles.switchRoleBtn}
          />

          <AppButton
            title="Reset Demo Data"
            onPress={handleResetData}
            variant="ghost"
            leftIcon="refresh-outline"
            style={styles.resetBtn}
          />

          <AppButton
            title="Log Out"
            onPress={handleLogout}
            variant="danger"
            size="lg"
            leftIcon="log-out-outline"
            style={styles.logoutBtn}
          />
        </View>
      </ScrollView>

      {/* Custom Confirmation Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeConfirmationModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {/* Modal Icon */}
            <View
              style={[
                styles.modalIcon,
                {
                  backgroundColor: isLogoutModal
                    ? '#FFF0F0'
                    : '#FFF4E5',
                },
              ]}
            >
              <Ionicons
                name={
                  isLogoutModal
                    ? 'log-out-outline'
                    : 'refresh-outline'
                }
                size={30}
                color={isLogoutModal ? '#E5484D' : '#D97706'}
              />
            </View>

            {/* Modal Title */}
            <Text style={styles.modalTitle}>
              {isLogoutModal ? 'Confirm Logout' : 'Reset Demo Data'}
            </Text>

            {/* Modal Message */}
            <Text style={styles.modalMessage}>
              {isLogoutModal
                ? 'Are you sure you want to log out of your account?'
                : 'This will reset all transactions, categories, and profile details to default sample values. Do you want to continue?'}
            </Text>

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[
                  styles.cancelButton,
                  isProcessing && styles.disabledButton,
                ]}
                onPress={closeConfirmationModal}
                disabled={isProcessing}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.confirmButton,
                  {
                    backgroundColor: isLogoutModal
                      ? '#E5484D'
                      : '#D97706',
                  },
                  isProcessing && styles.disabledButton,
                ]}
                onPress={handleConfirmAction}
                disabled={isProcessing}
                activeOpacity={0.8}
              >
                {isProcessing ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.confirmButtonText}>
                    {isLogoutModal ? 'Log Out' : 'Reset Data'}
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 110,
  },

  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },

  drawerToggle: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.subtle,
  },

  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },

  profileCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    padding: spacing.xl,
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.card,
  },

  avatarWrap: {
    position: 'relative',
    marginBottom: spacing.md,
  },

  avatarImg: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: colors.primary,
  },

  avatarPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarInitial: {
    ...typography.h1,
    color: colors.textWhite,
  },

  roleTag: {
    position: 'absolute',
    bottom: -6,
    alignSelf: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.full,
  },

  roleTagText: {
    ...typography.caption,
    color: colors.textWhite,
    fontWeight: '700',
    fontSize: 10,
  },

  userName: {
    ...typography.h2,
    color: colors.textPrimary,
    marginTop: 4,
  },

  userEmail: {
    ...typography.body2,
    color: colors.textSecondary,
    marginTop: 2,
  },

  editBtn: {
    marginTop: spacing.md,
    minWidth: 140,
  },

  infoGroupCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.card,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.borderLight,
    ...shadows.subtle,
  },

  groupHeading: {
    ...typography.subtitle2,
    color: colors.textPrimary,
    fontWeight: '700',
    marginBottom: spacing.md,
  },

  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  infoIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primaryUltraLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },

  infoValue: {
    ...typography.subtitle2,
    color: colors.textPrimary,
    fontWeight: '600',
    marginTop: 2,
  },

  prefRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },

  prefLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  prefTitle: {
    ...typography.body2,
    color: colors.textPrimary,
    fontWeight: '600',
  },

  prefValue: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginVertical: spacing.md - 2,
  },

  footerActions: {
    gap: spacing.md,
    marginTop: spacing.sm,
  },

  resetBtn: {
    width: '100%',
  },

  logoutBtn: {
    width: '100%',
  },

  switchRoleBtn: {
    width: '100%',
    borderColor: colors.primary,
  },

  adminBadgeNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.md,
    backgroundColor: colors.surfaceMint,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
  },

  adminBadgeNoticeText: {
    ...typography.caption,
    color: colors.textPrimary,
    fontWeight: '700',
  },

  // Custom Modal Styles
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