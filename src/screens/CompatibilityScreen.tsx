import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { theme } from '../styles/theme';
import { Compatibility } from '../types';
import api from '../services/api';

type CompatibilityScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Compatibility'>;
type CompatibilityScreenRouteProp = RouteProp<RootStackParamList, 'Compatibility'>;

interface Props {
  navigation: CompatibilityScreenNavigationProp;
  route: CompatibilityScreenRouteProp;
}

export default function CompatibilityScreen({ navigation, route }: Props) {
  const [compatibility, setCompatibility] = useState<Compatibility | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompatibility();
  }, []);

  const loadCompatibility = async () => {
    try {
      const data = await api.getCompatibility(route.params.friendId);
      setCompatibility(data);
    } catch (error) {
      console.error('Failed to load compatibility:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDimensionColor = (dimension: string) => {
    const colors = {
      love: theme.colors.loveColor,
      physical_intimacy: theme.colors.intimacyColor,
      work: theme.colors.workColor,
      marriage: theme.colors.marriageColor,
      friendship: theme.colors.friendshipColor,
    };
    return colors[dimension as keyof typeof colors] || theme.colors.primary;
  };

  const getCompatibilityGrade = (score: number) => {
    if (score >= 90) return 'A+';
    if (score >= 85) return 'A';
    if (score >= 80) return 'B+';
    if (score >= 75) return 'B';
    if (score >= 70) return 'C+';
    if (score >= 65) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!compatibility) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Failed to load compatibility data</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          {compatibility.user.fullName} × {compatibility.friend.fullName}
        </Text>
        <Text style={styles.subtitle}>Compatibility Analysis</Text>
      </View>

      {/* Overall Score */}
      <View style={styles.overallScoreCard}>
        <Text style={styles.overallScoreLabel}>Overall Compatibility</Text>
        <View style={styles.overallScoreRow}>
          <Text style={styles.overallScoreValue}>
            {Math.round(compatibility.scores.overall)}%
          </Text>
          <Text style={styles.overallGrade}>
            Grade: {getCompatibilityGrade(compatibility.scores.overall)}
          </Text>
        </View>
        <Text style={styles.analysis}>{compatibility.analysis}</Text>
      </View>

      {/* Dimension Scores */}
      <View style={styles.dimensionsContainer}>
        <Text style={styles.sectionTitle}>Compatibility by Dimension</Text>
        
        {Object.entries(compatibility.scores).map(([dimension, score]) => {
          if (dimension === 'overall') return null;
          
          const dimensionName = dimension.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
          const color = getDimensionColor(dimension);
          
          return (
            <View key={dimension} style={styles.dimensionCard}>
              <View style={styles.dimensionHeader}>
                <Text style={styles.dimensionName}>{dimensionName}</Text>
                <Text style={[styles.dimensionScore, { color }]}>
                  {Math.round(score)}%
                </Text>
              </View>
              <View style={styles.scoreBarContainer}>
                <View
                  style={[
                    styles.scoreBarFill,
                    {
                      width: `${score}%`,
                      backgroundColor: color,
                    },
                  ]}
                />
              </View>
              <Text style={styles.dimensionGrade}>
                Grade: {getCompatibilityGrade(score)}
              </Text>
            </View>
          );
        })}
      </View>

      {/* Personality Types */}
      <View style={styles.personalityContainer}>
        <Text style={styles.sectionTitle}>Personality Profiles</Text>
        
        <View style={styles.personalityRow}>
          <View style={styles.personalityCard}>
            <Text style={styles.personName}>{compatibility.user.fullName}</Text>
            <View style={styles.typeRow}>
              <Text style={styles.typeLabel}>MBTI:</Text>
              <Text style={styles.typeValue}>{compatibility.user.mbtiType}</Text>
            </View>
            <View style={styles.typeRow}>
              <Text style={styles.typeLabel}>Enneagram:</Text>
              <Text style={styles.typeValue}>Type {compatibility.user.enneagramType}</Text>
            </View>
            <View style={styles.typeRow}>
              <Text style={styles.typeLabel}>Zodiac:</Text>
              <Text style={styles.typeValue}>{compatibility.user.westernZodiac}</Text>
            </View>
          </View>
          
          <View style={styles.personalityCard}>
            <Text style={styles.personName}>{compatibility.friend.fullName}</Text>
            <View style={styles.typeRow}>
              <Text style={styles.typeLabel}>MBTI:</Text>
              <Text style={styles.typeValue}>{compatibility.friend.mbtiType}</Text>
            </View>
            <View style={styles.typeRow}>
              <Text style={styles.typeLabel}>Enneagram:</Text>
              <Text style={styles.typeValue}>Type {compatibility.friend.enneagramType}</Text>
            </View>
            <View style={styles.typeRow}>
              <Text style={styles.typeLabel}>Zodiac:</Text>
              <Text style={styles.typeValue}>{compatibility.friend.westernZodiac}</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Edit Friend Button */}
      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('AddFriend', { friendId: compatibility.friend.id })}
      >
        <Text style={styles.editButtonText}>Edit Friend Details</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.error,
  },
  header: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary,
  },
  overallScoreCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },
  overallScoreLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  overallScoreRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: theme.spacing.md,
  },
  overallScoreValue: {
    fontSize: 48,
    fontWeight: '700',
    color: theme.colors.primary,
    marginRight: theme.spacing.md,
  },
  overallGrade: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
  },
  analysis: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
    lineHeight: 24,
  },
  dimensionsContainer: {
    marginBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  dimensionCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  dimensionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  dimensionName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
  },
  dimensionScore: {
    fontSize: 24,
    fontWeight: '700',
  },
  scoreBarContainer: {
    height: 12,
    backgroundColor: theme.colors.border,
    borderRadius: 6,
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 6,
  },
  dimensionGrade: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  personalityContainer: {
    marginBottom: theme.spacing.xl,
  },
  personalityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  personalityCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginHorizontal: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  personName: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  typeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.xs,
  },
  typeLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  typeValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
  },
  editButton: {
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});