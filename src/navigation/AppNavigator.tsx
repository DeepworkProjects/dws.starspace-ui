import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ProfileSetupScreen from '../screens/ProfileSetupScreen';
import DashboardScreen from '../screens/DashboardScreen';
import AddFriendScreen from '../screens/AddFriendScreen';
import CompatibilityScreen from '../screens/CompatibilityScreen';
import api from '../services/api';

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ProfileSetup: undefined;
  Dashboard: undefined;
  AddFriend: { friendId?: string };
  Compatibility: { friendId: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      await api.init();
      const token = await AsyncStorage.getItem('token');
      
      if (token) {
        const user = await api.getMe();
        setIsAuthenticated(true);
        
        const profile = await api.getProfile();
        setHasProfile(!!profile);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return null; // Or a loading screen
  }

  const getInitialRouteName = () => {
    if (!isAuthenticated) return 'Login';
    if (!hasProfile) return 'ProfileSetup';
    return 'Dashboard';
  };

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={getInitialRouteName()}
        screenOptions={{
          headerStyle: {
            backgroundColor: '#ffffff',
          },
          headerTintColor: '#37352f',
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Register" 
          component={RegisterScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="ProfileSetup" 
          component={ProfileSetupScreen} 
          options={{ 
            title: 'Create Your Profile',
            headerBackVisible: false 
          }}
        />
        <Stack.Screen 
          name="Dashboard" 
          component={DashboardScreen} 
          options={{ 
            title: 'Starspace',
            headerBackVisible: false 
          }}
        />
        <Stack.Screen 
          name="AddFriend" 
          component={AddFriendScreen} 
          options={{ title: 'Add Friend' }}
        />
        <Stack.Screen 
          name="Compatibility" 
          component={CompatibilityScreen} 
          options={{ title: 'Compatibility Analysis' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}