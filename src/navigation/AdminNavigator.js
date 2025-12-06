import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import AdminDashboard from '../screens/admin/AdminDashboard';
import UserManagement from '../screens/admin/UserManagement';
import ScheduleManagement from '../screens/admin/ScheduleManagement';
import SystemSettings from '../screens/admin/SystemSettings';
import { colors } from '../styles';

const Stack = createStackNavigator();

const AdminNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="AdminDashboard"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: '600',
        },
        cardStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen 
        name="AdminDashboard" 
        component={AdminDashboard}
        options={{ title: 'Admin Dashboard' }}
      />
      <Stack.Screen 
        name="UserManagement" 
        component={UserManagement}
        options={{ title: 'User Management' }}
      />
      <Stack.Screen 
        name="ScheduleManagement" 
        component={ScheduleManagement}
        options={{ title: 'Schedule Management' }}
      />
      <Stack.Screen 
        name="SystemSettings" 
        component={SystemSettings}
        options={{ title: 'System Settings' }}
      />
    </Stack.Navigator>
  );
};

export default AdminNavigator;