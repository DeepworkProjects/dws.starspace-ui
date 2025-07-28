import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { theme } from '../styles/theme';
import { Friend, Compatibility } from '../types';
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

type DashboardScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Dashboard'>;

interface Props {
  navigation: DashboardScreenNavigationProp;
}

export default function DashboardScreen({ navigation }: Props) {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [compatibilities, setCompatibilities] = useState<Compatibility[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [friendsData, compatibilitiesData] = await Promise.all([
        api.getFriends(),
        api.getAllCompatibilities(),
      ]);
      setFriends(friendsData);
      setCompatibilities(compatibilitiesData);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    navigation.replace('Login');
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={loadData} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>Your Compatibility Circle</Text>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {friends.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No friends yet</Text>
          <Text style={styles.emptyText}>Add friends to see your compatibility</Text>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddFriend', {})}
          >
            <Text style={styles.addButtonText}>Add Your First Friend</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => navigation.navigate('AddFriend', {})}
          >
            <Text style={styles.addButtonText}>Add Friend</Text>
          </TouchableOpacity>

          {compatibilities.map((compatibility) => (
            <TouchableOpacity
              key={compatibility.friend.id}
              style={styles.friendCard}
              onPress={() => navigation.navigate('Compatibility', { friendId: compatibility.friend.id })}
            >
              <View style={styles.friendHeader}>
                <Text style={styles.friendName}>{compatibility.friend.fullName}</Text>
                <Text style={styles.overallScore}>{Math.round(compatibility.scores.overall)}%</Text>
              </View>
              
              <View style={styles.scoresContainer}>
                {Object.entries(compatibility.scores).map(([dimension, score]) => {
                  if (dimension === 'overall') return null;
                  return (
                    <View key={dimension} style={styles.scoreItem}>
                      <Text style={styles.dimensionLabel}>
                        {dimension.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Text>
                      <View style={styles.scoreBar}>
                        <View
                          style={[
                            styles.scoreBarFill,
                            {
                              width: `${score}%`,
                              backgroundColor: getDimensionColor(dimension),
                            },
                          ]}
                        />
                      </View>
                      <Text style={styles.scoreText}>{Math.round(score)}%</Text>
                    </View>
                  );
                })}
              </View>
            </TouchableOpacity>
          ))}
        </>
      )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.text,
  },
  logoutText: {
    fontSize: 14,
    color: theme.colors.primary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xxl,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  emptyText: {
    fontSize: 16,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  addButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  addButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  friendCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  friendHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  friendName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },
  overallScore: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  scoresContainer: {
    marginTop: theme.spacing.sm,
  },
  scoreItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  dimensionLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    width: 120,
  },
  scoreBar: {
    flex: 1,
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    marginHorizontal: theme.spacing.sm,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.text,
    width: 40,
    textAlign: 'right',
  },
});