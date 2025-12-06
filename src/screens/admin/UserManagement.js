import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StyleSheet
} from 'react-native';
// FIX: Import from specific service files
import { adminService } from '../../services/adminService';
import { colors, globalStyles, spacing, typography } from '../../styles';
import { Ionicons } from '@expo/vector-icons';
import { USER_ROLES } from '../../constants/userRoles';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadUsers = async () => {
    try {
      const data = await adminService.getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error('Error loading users:', error);
      Alert.alert('Error', 'Failed to load users');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminService.updateUserRole(userId, newRole);
      await loadUsers();
      Alert.alert('Success', 'User role updated successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to update user role');
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case USER_ROLES.ADMIN: return colors.primary;
      case USER_ROLES.BARBER: return colors.success;
      case USER_ROLES.CUSTOMER: return colors.info;
      default: return colors.textLight;
    }
  };

  const confirmRoleChange = (user, newRole) => {
    Alert.alert(
      'Change User Role',
      `Change ${user.name}'s role to ${newRole}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => handleRoleChange(user.id, newRole)
        }
      ]
    );
  };

  return (
    <View style={globalStyles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.header}>
          <Text style={typography.heading}>User Management</Text>
          <Text style={typography.subtitle}>
            Manage user roles and permissions
          </Text>
        </View>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>
              {users.filter(u => u.role === USER_ROLES.ADMIN).length}
            </Text>
            <Text style={styles.statLabel}>Admins</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>
              {users.filter(u => u.role === USER_ROLES.BARBER).length}
            </Text>
            <Text style={styles.statLabel}>Barbers</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statNumber}>
              {users.filter(u => u.role === USER_ROLES.CUSTOMER).length}
            </Text>
            <Text style={styles.statLabel}>Customers</Text>
          </View>
        </View>

        {users.map((user) => (
          <View key={user.id} style={styles.userCard}>
            <View style={styles.userInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </Text>
              </View>
              <View style={styles.userDetails}>
                <Text style={styles.userName}>{user.name || 'Unknown User'}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>
                <Text style={styles.userJoinDate}>
                  Joined: {new Date(user.created_at).toLocaleDateString()}
                </Text>
              </View>
            </View>

            <View style={styles.userActions}>
              <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user.role) }]}>
                <Text style={styles.roleText}>
                  {user.role.toUpperCase()}
                </Text>
              </View>

              <View style={styles.roleButtons}>
                {Object.values(USER_ROLES).map((role) => (
                  user.role !== role && (
                    <TouchableOpacity
                      key={role}
                      style={styles.roleButton}
                      onPress={() => confirmRoleChange(user, role)}
                    >
                      <Text style={styles.roleButtonText}>
                        Make {role}
                      </Text>
                    </TouchableOpacity>
                  )
                ))}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    padding: spacing.lg,
    backgroundColor: colors.background,
  },
  stats: {
    flexDirection: 'row',
    padding: spacing.lg,
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    ...typography.largeTitle,
    fontWeight: 'bold',
    color: colors.primary,
  },
  statLabel: {
    ...typography.small,
    color: colors.textLight,
    marginTop: spacing.xs,
  },
  userCard: {
    backgroundColor: colors.white,
    margin: spacing.md,
    padding: spacing.lg,
    borderRadius: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  avatarText: {
    ...typography.title,
    color: colors.white,
    fontWeight: 'bold',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    ...typography.body,
    fontWeight: 'bold',
  },
  userEmail: {
    ...typography.small,
    color: colors.textLight,
    marginVertical: 2,
  },
  userJoinDate: {
    ...typography.small,
    color: colors.textLight,
  },
  userActions: {
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: spacing.md,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: 16,
    marginBottom: spacing.md,
  },
  roleText: {
    ...typography.small,
    color: colors.white,
    fontWeight: 'bold',
  },
  roleButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  roleButton: {
    backgroundColor: colors.lightGray,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
  },
  roleButtonText: {
    ...typography.small,
    color: colors.text,
    fontWeight: 'bold',
  },
});

export default UserManagement;