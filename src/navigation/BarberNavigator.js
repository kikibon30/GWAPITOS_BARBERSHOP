import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BarberDashboard from '../screens/barber/BarberDashboard';
import TodayAppointments from '../screens/barber/TodayAppointments';
import AppointmentDetails from '../screens/barber/AppointmentDetails';
import ServiceManagement from '../screens/barber/ServiceManagement';
import Earnings from '../screens/barber/Earnings';
import BarberProfile from '../screens/barber/BarberProfile';
import { colors } from '../styles';

const Stack = createStackNavigator();

const BarberNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="BarberDashboard"
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
        name="BarberDashboard" 
        component={BarberDashboard}
        options={{ 
          title: 'Barber Dashboard',
          headerShown: false
        }}
      />
      <Stack.Screen 
        name="TodayAppointments" 
        component={TodayAppointments}
        options={{ title: "Today's Appointments" }}
      />
      <Stack.Screen 
        name="AppointmentDetails" 
        component={AppointmentDetails}
        options={{ title: 'Appointment Details' }}
      />
      <Stack.Screen 
        name="ServiceManagement" 
        component={ServiceManagement}
        options={{ title: 'Manage Services' }}
      />
      <Stack.Screen 
        name="Earnings" 
        component={Earnings}
        options={{ title: 'Earnings & Analytics' }}
      />
      <Stack.Screen 
        name="BarberProfile" 
        component={BarberProfile}
        options={{ title: 'My Profile' }}
      />
    </Stack.Navigator>
  );
};

export default BarberNavigator;