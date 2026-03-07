import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
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
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="plantrip" component={PlannerScreen} />
      <Stack.Screen name="mticket" component={TicketScreen} />
      <Stack.Screen name="stops" component={StopsScreen} />
      <Stack.Screen name="My Tickets" component={MyTicketsScreen} />
      <Stack.Screen name="Fare-Chart" component={FareScreen} />
      <Stack.Screen name="Surat Map" component={MapScreen} />
    </Stack.Navigator>
  );
}
