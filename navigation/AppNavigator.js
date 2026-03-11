// navigation/AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LanguageScreen from '../screens/LanguageScreen';
import HomeScreen from '../screens/HomeScreen';
import PlannerScreen from '../screens/PlannerScreen';
import TicketScreen from '../screens/TicketScreen';
import StopsScreen from '../screens/StopsScreen';
import MyTicketsScreen from '../screens/TicketScreen';
import FareScreen from '../screens/FareScreen';
import MapScreen from '../screens/MapScreen';


const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen 
        name="Welcome" 
        component={WelcomeScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="Language" 
        component={LanguageScreen} 
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen 
        name="plantrip" 
        component={PlannerScreen} 
        options={{ 
          title: 'Plan Your Trip',
          headerStyle: { backgroundColor: '#1565c0' },
          headerTintColor: '#fff'
        }}
      />
      <Stack.Screen 
        name="mticket" 
        component={TicketScreen} 
        options={{ 
          title: 'M-Ticket',
          headerStyle: { backgroundColor: '#1565c0' },
          headerTintColor: '#fff'
        }}
      />
      <Stack.Screen 
        name="stops" 
        component={StopsScreen} 
        options={{ 
          title: 'Bus Stops',
          headerStyle: { backgroundColor: '#1565c0' },
          headerTintColor: '#fff'
        }}
      />
      <Stack.Screen 
        name="My Tickets" 
        component={MyTicketsScreen} 
        options={{ 
          title: 'My Tickets',
          headerStyle: { backgroundColor: '#1565c0' },
          headerTintColor: '#fff'
        }}
      />
      <Stack.Screen 
        name="Fare-Chart" 
        component={FareScreen} 
        options={{ 
          title: 'Fare Chart',
          headerStyle: { backgroundColor: '#1565c0' },
          headerTintColor: '#fff'
        }}
      />
      <Stack.Screen 
        name="Surat Map" 
        component={MapScreen} 
        options={{ 
          title: 'Surat BRTS Map',
          headerStyle: { backgroundColor: '#1565c0' },
          headerTintColor: '#fff'
        }}
      />
    </Stack.Navigator>
  );
}