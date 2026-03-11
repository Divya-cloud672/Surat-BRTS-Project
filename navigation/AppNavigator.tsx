// navigation/AppNavigator.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import LanguageScreen from '../screens/LanguageScreen';
import HomeScreen from '../screens/HomeScreen';
import PlannerScreen from '../screens/PlannerScreen';
import TicketScreen from '../screens/TicketScreen';
import StopsScreen from '../screens/StopsScreen';
import FareScreen from '../screens/FareScreen';
import MapScreen from '../screens/MapScreen';

// 1. Define type for your Stack Navigator routes
export type RootStackParamList = {
  Welcome: undefined;
  Language: undefined;
  Home: undefined;
  plantrip: undefined;
  mticket: undefined;
  stops: undefined;
  'Fare-Chart': undefined;
  'Surat Map': undefined;
};

// 2. Create stack navigator with typed routes
const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
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
};

export default AppNavigator;