
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated } from 'react-native';
import { router } from 'expo-router';
import { commonStyles, colors } from '../../styles/commonStyles';
import { useApp } from '../../contexts/AppContext';
import { voiceService } from '../../services/voiceService';
import { t } from '../../utils/translations';

export default function DashboardScreen() {
  const { state } = useApp();
  const [scoreAnimation] = useState(new Animated.Value(0));
  const [progressAnimation] = useState(new Animated.Value(0));

  useEffect(() => {
    if (state.user) {
      // Welcome announcement - always in Malayalam for audio
      voiceService.announceWelcome(state.user.name, state.user.score, 'ml');
      
      // Animate score
      Animated.timing(scoreAnimation, {
        toValue: state.user.score,
        duration: 2000,
        useNativeDriver: false,
      }).start();

      // Animate progress
      const progress = Math.min(state.user.score / 1000, 1);
      Animated.timing(progressAnimation, {
        toValue: progress,
        duration: 2000,
        useNativeDriver: false,
      }).start();
    }
  }, [state.user]);

  if (!state.user) {
    return (
      <View style={[commonStyles.container, styles.loadingContainer]}>
        <Text style={commonStyles.text}>{t('loading', state.language)}</Text>
      </View>
    );
  }

  const completedMissions = state.missions.filter(m => m.isCompleted).length;
  const acceptedMissions = state.missions.filter(m => m.isAccepted && !m.isCompleted).length;
  const availableMissions = state.missions.filter(m => !m.isAccepted).length;

  const animatedScore = scoreAnimation.interpolate({
    inputRange: [0, state.user.score],
    outputRange: [0, state.user.score],
    extrapolate: 'clamp',
  });

  const progressWidth = progressAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <ScrollView style={commonStyles.wrapper} contentContainerStyle={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeText}>{t('welcome', state.language)}!</Text>
          <Text style={styles.userName}>{state.user.name}</Text>
          <Text style={styles.location}>📍 {state.user.district}</Text>
        </View>
        <TouchableOpacity style={styles.voiceButton} onPress={() => {
          voiceService.speak('ദൗത്യങ്ങൾ കാണിക്കുക എന്ന് പറയുക', 'ml');
        }}>
          <Text style={styles.voiceIcon}>🎤</Text>
        </TouchableOpacity>
      </View>

      {/* Score Card */}
      <View style={[commonStyles.card, styles.scoreCard]}>
        <View style={styles.scoreHeader}>
          <Text style={styles.scoreTitle}>{t('score', state.language)}</Text>
        </View>
        <View style={styles.scoreContent}>
          <Animated.Text style={styles.scoreValue}>
            {animatedScore}
          </Animated.Text>
          <Text style={styles.scoreMax}>/ 1000</Text>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View 
              style={[
                styles.progressFill,
                { width: progressWidth }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round((state.user.score / 1000) * 100)}% {t('completed', state.language)}
          </Text>
        </View>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <View style={[commonStyles.card, styles.statCard]}>
          <Text style={styles.statNumber}>{completedMissions}</Text>
          <Text style={styles.statLabel}>{t('completed', state.language)} {t('missions', state.language)}</Text>
        </View>
        <View style={[commonStyles.card, styles.statCard]}>
          <Text style={styles.statNumber}>{state.user.badges.length}</Text>
          <Text style={styles.statLabel}>{t('earnedBadges', state.language)}</Text>
        </View>
        <View style={[commonStyles.card, styles.statCard]}>
          <Text style={styles.statNumber}>{state.user.crops.length}</Text>
          <Text style={styles.statLabel}>{t('crops', state.language)}</Text>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.actionsContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        
        <TouchableOpacity 
          style={[commonStyles.card, styles.actionCard]}
          onPress={() => router.push('/(tabs)/missions')}
        >
          <View style={styles.actionContent}>
            <Text style={styles.actionIcon}>🎯</Text>
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>{t('missions', state.language)}</Text>
              <Text style={styles.actionSubtitle}>
                {availableMissions} new {t('missions', state.language).toLowerCase()} {t('available', state.language).toLowerCase()}
              </Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[commonStyles.card, styles.actionCard]}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <View style={styles.actionContent}>
            <Text style={styles.actionIcon}>📊</Text>
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>{t('progressTracker', state.language)}</Text>
              <Text style={styles.actionSubtitle}>
                View your farming progress
              </Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[commonStyles.card, styles.actionCard]}
          onPress={() => router.push('/(tabs)/leaderboard')}
        >
          <View style={styles.actionContent}>
            <Text style={styles.actionIcon}>🏆</Text>
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>{t('leaderboard', state.language)}</Text>
              <Text style={styles.actionSubtitle}>
                Compare with other farmers
              </Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[commonStyles.card, styles.actionCard]}
          onPress={() => router.push('/(tabs)/forum')}
        >
          <View style={styles.actionContent}>
            <Text style={styles.actionIcon}>💬</Text>
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>{t('forum', state.language)}</Text>
              <Text style={styles.actionSubtitle}>
                Discuss with community
              </Text>
            </View>
            <Text style={styles.actionArrow}>›</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Recent Badges */}
      {state.user.badges.length > 0 && (
        <View style={styles.badgesContainer}>
          <Text style={styles.sectionTitle}>Recent Badges</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {state.user.badges.slice(-3).map((badge) => (
              <View key={badge.id} style={styles.badgeItem}>
                <Text style={styles.badgeIcon}>{badge.icon}</Text>
                <Text style={styles.badgeName}>
                  {state.language.code === 'ml' ? badge.nameMalayalam : badge.name}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 16,
    color: colors.grey,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: colors.grey,
  },
  voiceButton: {
    backgroundColor: colors.primary,
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  voiceIcon: {
    fontSize: 24,
  },
  scoreCard: {
    backgroundColor: colors.primary + '10',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    marginBottom: 20,
  },
  scoreHeader: {
    marginBottom: 16,
  },
  scoreTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  scoreContent: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  scoreValue: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.primary,
  },
  scoreMax: {
    fontSize: 18,
    color: colors.grey,
    marginLeft: 8,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.grey + '30',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: colors.grey,
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    paddingVertical: 20,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 16,
  },
  actionsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  actionCard: {
    marginBottom: 12,
    paddingVertical: 16,
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: colors.grey,
    lineHeight: 18,
  },
  actionArrow: {
    fontSize: 24,
    color: colors.grey,
  },
  badgesContainer: {
    marginBottom: 24,
  },
  badgeItem: {
    backgroundColor: colors.accent + '20',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    alignItems: 'center',
    minWidth: 100,
  },
  badgeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
});
