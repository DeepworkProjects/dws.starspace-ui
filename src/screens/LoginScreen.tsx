import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { theme } from '../styles/theme';
import api from '../services/api';
// Import Google Sign-In only for native platforms
let GoogleSignin: any = null;
let statusCodes: any = null;

if (Platform.OS !== 'web') {
  const GoogleSignInModule = require('@react-native-google-signin/google-signin');
  GoogleSignin = GoogleSignInModule.GoogleSignin;
  statusCodes = GoogleSignInModule.statusCodes;
}

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Configure Google Sign-In for native platforms
    if (Platform.OS !== 'web' && GoogleSignin) {
      GoogleSignin.configure({
        webClientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID,
        offlineAccess: true,
      });
    }
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await api.login(email, password);
      
      // Check if user has profile
      const profile = await api.getProfile();
      if (profile) {
        navigation.replace('Dashboard');
      } else {
        navigation.replace('ProfileSetup');
      }
    } catch (error) {
      Alert.alert('Error', 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (Platform.OS === 'web') {
      // For web, auto-fill demo credentials
      setEmail('test@starspace.com');
      setPassword('testpassword123');
      setMessage('Demo credentials filled. Click Sign In to continue.');
      
      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    // Native Google Sign-In
    try {
      setLoading(true);
      
      // Check if Google Play Services are available (for Android)
      await GoogleSignin.hasPlayServices();
      
      // Sign in with Google
      const userInfo = await GoogleSignin.signIn();
      
      // Send the Google ID token to our backend
      const response = await api.googleAuth({
        email: userInfo.user.email,
        googleId: userInfo.user.id,
        name: userInfo.user.name,
        photo: userInfo.user.photo,
        idToken: userInfo.idToken,
      });
      
      if (response.access_token) {
        await api.setToken(response.access_token);
        navigation.replace('Dashboard');
      }
    } catch (error: any) {
      setLoading(false);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // User cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // Operation is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        Alert.alert('Error', 'Google Play Services not available');
      } else {
        Alert.alert('Error', 'Failed to sign in with Google');
        console.error('Google Sign-In error:', error);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Starspace</Text>
        <Text style={styles.subtitle}>Discover your compatibility</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.buttonText}>{loading ? 'Signing in...' : 'Sign In'}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.googleButton]}
            onPress={handleGoogleLogin}
            disabled={loading}
          >
            <Text style={styles.googleButtonText}>Continue with Google</Text>
          </TouchableOpacity>

          {message ? (
            <Text style={styles.message}>{message}</Text>
          ) : null}

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.link}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  title: {
    fontSize: 48,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 18,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xxl,
  },
  form: {
    width: '100%',
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: 16,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  button: {
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  googleButton: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  googleButtonText: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: theme.spacing.lg,
  },
  footerText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  link: {
    color: theme.colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  message: {
    color: theme.colors.primary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    fontStyle: 'italic',
  },
});