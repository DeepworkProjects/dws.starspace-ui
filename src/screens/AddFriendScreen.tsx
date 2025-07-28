import React, { useState, useEffect } from 'react';
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
import { RouteProp } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { RootStackParamList } from '../navigation/AppNavigator';
import { theme } from '../styles/theme';
import { MBTIType, EnneagramType, Friend } from '../types';
import api from '../services/api';
import DateInput from '../components/DateInput';

type AddFriendScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddFriend'>;
type AddFriendScreenRouteProp = RouteProp<RootStackParamList, 'AddFriend'>;

interface Props {
  navigation: AddFriendScreenNavigationProp;
  route: AddFriendScreenRouteProp;
}

const MBTI_TYPES: MBTIType[] = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

const ENNEAGRAM_TYPES: EnneagramType[] = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];

export default function AddFriendScreen({ navigation, route }: Props) {
  const [fullName, setFullName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date(2000, 0, 1));
  const [placeOfBirth, setPlaceOfBirth] = useState('');
  const [timeOfBirth, setTimeOfBirth] = useState('');
  const [mbtiType, setMbtiType] = useState<MBTIType>('INTJ');
  const [enneagramType, setEnneagramType] = useState<EnneagramType>('1');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [friend, setFriend] = useState<Friend | null>(null);

  const isEditing = !!route.params?.friendId;

  useEffect(() => {
    if (isEditing) {
      loadFriend();
    }
  }, []);

  const loadFriend = async () => {
    try {
      const friends = await api.getFriends();
      const foundFriend = friends.find((f: Friend) => f.id === route.params.friendId);
      if (foundFriend) {
        setFriend(foundFriend);
        setFullName(foundFriend.fullName);
        setDateOfBirth(new Date(foundFriend.dateOfBirth));
        setPlaceOfBirth(foundFriend.placeOfBirth);
        setTimeOfBirth(foundFriend.timeOfBirth);
        setMbtiType(foundFriend.mbtiType);
        setEnneagramType(foundFriend.enneagramType);
        setNotes(foundFriend.notes || '');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load friend data');
    }
  };

  const handleSubmit = async () => {
    if (!fullName || !placeOfBirth || !timeOfBirth) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const friendData = {
        full_name: fullName,
        date_of_birth: dateOfBirth.toISOString(),
        place_of_birth: placeOfBirth,
        time_of_birth: timeOfBirth,
        mbti_type: mbtiType,
        enneagram_type: enneagramType,
        notes: notes || undefined,
      };

      if (isEditing && friend) {
        await api.updateFriend(friend.id, friendData);
      } else {
        await api.createFriend(friendData);
      }
      
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save friend');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{isEditing ? 'Edit Friend' : 'Add a Friend'}</Text>
      <Text style={styles.subtitle}>Enter their details to see your compatibility</Text>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="Friend's full name"
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        <DateInput
          label="Date of Birth *"
          value={dateOfBirth}
          onChange={setDateOfBirth}
          maximumDate={new Date()}
        />

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Place of Birth *</Text>
          <TextInput
            style={styles.input}
            placeholder="City, Country"
            value={placeOfBirth}
            onChangeText={setPlaceOfBirth}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Time of Birth *</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g., 2:30 PM"
            value={timeOfBirth}
            onChangeText={setTimeOfBirth}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>MBTI Type *</Text>
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
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Enneagram Type *</Text>
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
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Notes (Optional)</Text>
          <TextInput
            style={[styles.input, styles.notesInput]}
            placeholder="Any additional notes..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Saving...' : (isEditing ? 'Update Friend' : 'Add Friend')}
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
  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
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