// src/navigators/AppNavigator.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoadingScreen from '../screens/common/LoadingScreen';
import ErrorScreen from '../screens/common/ErrorScreen';
import CustomerDashboard from '../screens/customer/CustomerDashboard';
import AdminDashboard from '../screens/admin/AdminDashboard';
import BarberDashboard from '../screens/customer/BarberDashboard'; // Make sure path is correct

const Stack = createNativeStackNavigator();

// src/navigators/AppNavigator.js - IMPROVE INITIAL ROUTE
export default function AppNavigator({ userRole }) {
  console.log('AppNavigator userRole:', userRole);
  
  // Determine initial route safely
  const getInitialRoute = () => {
    if (!userRole) return 'CustomerDashboard';
    
    switch (userRole) {
      case 'admin':
        return 'AdminDashboard';
      case 'barber':
        return 'BarberDashboard';
      default:
        return 'CustomerDashboard';
    }
  };

  return (
    <Stack.Navigator 
      screenOptions={{ headerShown: false }}
      initialRouteName={getInitialRoute()}
    >
      <Stack.Screen name="CustomerDashboard" component={CustomerDashboard} />
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
      <Stack.Screen name="BarberDashboard" component={BarberDashboard} />
      <Stack.Screen name="Loading" component={LoadingScreen} />
      <Stack.Screen name="Error" component={ErrorScreen} />
    </Stack.Navigator>
  );
}
