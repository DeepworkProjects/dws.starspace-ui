import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Picker } from '@react-native-picker/picker';
import { RootStackParamList } from '../navigation/AppNavigator';
import { theme } from '../styles/theme';
import { MBTIType, EnneagramType } from '../types';
import api from '../services/api';
import DateInput from '../components/DateInput';

type ProfileSetupScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProfileSetup'>;

interface Props {
  navigation: ProfileSetupScreenNavigationProp;
}

const MBTI_TYPES: MBTIType[] = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

const ENNEAGRAM_TYPES: EnneagramType[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

export default function ProfileSetupScreen({ navigation }: Props) {
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date(2000, 0, 1));
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [timeOfBirth, setTimeOfBirth] = useState('');
  const [mbtiType, setMbtiType] = useState<MBTIType>('INTJ');
  const [enneagramType, setEnneagramType] = useState<EnneagramType>('1');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!fullName || !placeOfBirth || !timeOfBirth) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await api.createProfile({
        full_name: fullName,
        date_of_birth: dateOfBirth.toISOString(),
        place_of_birth: placeOfBirth,
        time_of_birth: timeOfBirth,
        mbti_type: mbtiType,
        enneagram_type: enneagramType,
      });
      
      navigation.replace('Dashboard');
    } catch (error) {
      Alert.alert('Error', 'Failed to create profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Let's get to know you</Text>
      <Text style={styles.subtitle}>We'll use this to calculate your compatibility</Text>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <DateInput
          label="Date of Birth"
          value={dateOfBirth}
          onChange={setDateOfBirth}
          maximumDate={new Date()}
        />

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Place of Birth</Text>
          <TextInput
            style={styles.input}
            placeholder="City, Country"
            value={placeOfBirth}
            onChangeText={setPlaceOfBirth}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Time of Birth</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 2:30 PM"
            value={timeOfBirth}
            onChangeText={setTimeOfBirth}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>MBTI Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={mbtiType}
              onValueChange={setMbtiType}
              style={styles.picker}
            >
              {MBTI_TYPES.map((type) => (
                <Picker.Item key={type} label={type} value={type} />
              ))}
            </Picker>
          </View>
          <TouchableOpacity>
            <Text style={styles.helpLink}>Don't know your MBTI? Take a free test →</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Enneagram Type</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={enneagramType}
              onValueChange={setEnneagramType}
              style={styles.picker}
            >
              {ENNEAGRAM_TYPES.map((type) => (
                <Picker.Item key={type} label={`Type ${type}`} value={type} />
              ))}
            </Picker>
          </View>
          <TouchableOpacity>
            <Text style={styles.helpLink}>Don't know your Enneagram? Take a free test →</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Creating Profile...' : 'Create Profile'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xl,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: theme.spacing.lg,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pickerContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  helpLink: {
    fontSize: 14,
    color: theme.colors.primary,
    marginTop: theme.spacing.xs,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});