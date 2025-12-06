import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CustomerDashboard from '../screens/customer/CustomerDashboard';
import BarberList from '../screens/customer/BarberList';
import Services from '../screens/customer/Services';
import BookAppointment from '../screens/customer/BookAppointment';
import MyAppointment from '../screens/customer/MyAppointment';
import BarberDashboard from '../screens/customer/BarberDashboard';
import { colors } from '../styles';

const Stack = createStackNavigator();

const CustomerNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="CustomerDashboard"
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
        name="CustomerDashboard" 
        component={CustomerDashboard}
        options={{ title: 'Dashboard' }}
      />
      <Stack.Screen 
        name="BarberList" 
        component={BarberList}
        options={{ title: 'Our Barbers' }}
      />
      <Stack.Screen 
        name="Services" 
        component={Services}
        options={{ title: 'Services' }}
      />
      <Stack.Screen 
        name="BookAppointment" 
        component={BookAppointment}
        options={{ title: 'Book Appointment' }}
      />
      <Stack.Screen 
        name="MyAppointment" 
        component={MyAppointment}
        options={{ title: 'My Appointments' }}
      />
      <Stack.Screen 
        name="BarberDashboard" 
        component={BarberDashboard}
        options={{ title: 'Barber Profile' }}
      />
    </Stack.Navigator>
  );
};

export default CustomerNavigator;