import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { theme } from '../styles/theme';

interface DateInputProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  placeholder?: string;
  maximumDate?: Date;
}

export default function DateInput({
  label,
  value,
  onChange,
  placeholder = 'Select date',
  maximumDate = new Date(),
}: DateInputProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [textValue, setTextValue] = useState(value.toISOString().split('T')[0]);

  const handleWebDateChange = (text: string) => {
    setTextValue(text);
    // Validate date format YYYY-MM-DD
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (dateRegex.test(text)) {
      const date = new Date(text + 'T00:00:00');
      if (!isNaN(date.getTime()) && date <= maximumDate) {
        onChange(date);
      }
    }
  };

  const formatDateForDisplay = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={styles.input}
          value={textValue}
          onChangeText={handleWebDateChange}
          placeholder="YYYY-MM-DD"
          maxLength={10}
        />
        <Text style={styles.helperText}>Format: YYYY-MM-DD</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowPicker(true)}
      >
        <Text style={styles.dateText}>{formatDateForDisplay(value)}</Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={value}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) {
              onChange(selectedDate);
              setTextValue(selectedDate.toISOString().split('T')[0]);
            }
          }}
          maximumDate={maximumDate}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  dateText: {
    fontSize: 16,
    color: theme.colors.text,
  },
  helperText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
});