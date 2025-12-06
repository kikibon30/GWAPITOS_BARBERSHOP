import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import AdminNavigator from './AdminNavigator';
import CustomerNavigator from './CustomerNavigator';
import BarberNavigator from './BarberNavigator';
import LoadingScreen from '../screens/common/LoadingScreen';
import { colors } from '../styles';

const Stack = createStackNavigator();

const RootNavigator = () => {
  const { user, isLoading, userRole } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: colors.background },
      }}
    >
      {!user ? (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      ) : userRole === 'admin' ? (
        <Stack.Screen name="Admin" component={AdminNavigator} />
      ) : userRole === 'customer' ? (
        <Stack.Screen name="Customer" component={CustomerNavigator} />
      ) : userRole === 'barber' ? (
        <Stack.Screen name="Barber" component={BarberNavigator} />
      ) : (
        <Stack.Screen name="Auth" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;