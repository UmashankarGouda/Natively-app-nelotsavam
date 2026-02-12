
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../../styles/commonStyles';
import { useApp } from '../../contexts/AppContext';
import { voiceService } from '../../services/voiceService';
import { LanguageSelector } from '../../components/LanguageSelector';
import { Button } from '../../components/button';
import { t } from '../../utils/translations';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProfileScreen() {
  const { state, dispatch } = useApp();

  if (!state.user) {
    return (
      <View style={[commonStyles.container, styles.loadingContainer]}>
        <Text style={commonStyles.text}>{t('loading', state.language)}</Text>
      </View>
    );
  }

  const handleLogout = () => {
    Alert.alert(
      t('logout', state.language),
      t('logoutConfirm', state.language),
      [
        {
          text: t('cancel', state.language),
          style: 'cancel',
        },
        {
          text: t('logout', state.language),
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Starting logout process...');
              
              // Clear user data from AsyncStorage
              await AsyncStorage.multiRemove(['userData', 'onboardingComplete']);
              console.log('AsyncStorage cleared');
              
              // Reset app state using the LOGOUT action
              dispatch({ type: 'LOGOUT' });
              console.log('App state reset');
              
              // Audio feedback always in Malayalam
              voiceService.speak('വിജയകരമായി ലോഗൗട്ട് ചെയ്തു', 'ml');
              
              // Force navigation to onboarding with a small delay to ensure state is updated
              setTimeout(() => {
                console.log('Navigating to onboarding...');
                router.replace('/onboarding');
              }, 100);
              
            } catch (error) {
              console.error('Error during logout:', error);
              Alert.alert(t('error', state.language), 'Failed to logout. Please try again.');
            }
          },
        },
      ]
    );
  };

  const completedMissions = state.missions.filter(m => m.isCompleted).length;
  const totalMissions = state.missions.length;
  const progressPercentage = Math.round((completedMissions / totalMissions) * 100);

  const handleReadProfile = () => {
    // Audio is always in Malayalam as requested
    const profileText = `${state.user?.name}, ${state.user?.district} ജില്ലയിൽ നിന്ന്. ${state.user?.acres} ഏക്കർ കൃഷിഭൂമി. സ്കോർ: ${state.user?.score} പോയിന്റുകൾ. ${state.user?.badges.length} ബാഡ്ജുകൾ നേടി.`;
    voiceService.speak(profileText, 'ml');
  };

  const getDisplayText = (key: string, malayalamText: string) => {
    return state.language.code === 'ml' ? malayalamText : t(key, state.language);
  };

  const getCropNames = () => {
    if (state.language.code === 'ml') {
      // Return Malayalam crop names if available
      return state.user?.crops.join(', ') || '';
    }
    return state.user?.crops.join(', ') || '';
  };

  const getBadgeName = (badge: any) => {
    return state.language.code === 'ml' ? badge.nameMalayalam : badge.name;
  };

  const getBadgeDescription = (badge: any) => {
    return state.language.code === 'ml' ? badge.descriptionMalayalam : badge.description;
  };

  return (
    <ScrollView style={commonStyles.wrapper} contentContainerStyle={styles.container}>
      {/* Header Controls */}
      <View style={styles.headerControls}>
        <LanguageSelector />
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>{t('logout', state.language)}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <TouchableOpacity style={styles.profileImageContainer} onPress={handleReadProfile}>
          <Text style={styles.profileIcon}>👤</Text>
        </TouchableOpacity>
        <Text style={[commonStyles.title, styles.name]}>{state.user.name}</Text>
        <Text style={styles.location}>📍 {state.user.district}</Text>
        <TouchableOpacity style={styles.voiceButton} onPress={handleReadProfile}>
          <Text style={styles.voiceIcon}>🔊</Text>
          <Text style={styles.voiceText}>{t('listenToProfile', state.language)}</Text>
        </TouchableOpacity>
      </View>

      {/* Basic Info */}
      <View style={[commonStyles.card, styles.infoCard]}>
        <Text style={styles.cardTitle}>{t('basicInfo', state.language)}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t('farmland', state.language)}:</Text>
          <Text style={styles.infoValue}>{state.user.acres} {state.language.code === 'ml' ? 'ഏക്കർ' : 'acres'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t('crops', state.language)}:</Text>
          <Text style={styles.infoValue}>{getCropNames()}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t('membership', state.language)}:</Text>
          <Text style={styles.infoValue}>
            {new Date(state.user.createdAt).toLocaleDateString(state.language.code === 'ml' ? 'ml-IN' : 'en-US')}
          </Text>
        </View>
      </View>

      {/* Score Progress */}
      <View style={[commonStyles.card, styles.scoreCard]}>
        <Text style={styles.cardTitle}>{t('scoreProgress', state.language)}</Text>
        <View style={styles.scoreContainer}>
          <Text style={styles.currentScore}>{state.user.score}</Text>
          <Text style={styles.maxScore}>/ 1000</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${Math.min((state.user.score / 1000) * 100, 100)}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {Math.round((state.user.score / 1000) * 100)}% {t('completed', state.language)}
          </Text>
        </View>
      </View>

      {/* Mission Progress */}
      <View style={[commonStyles.card, styles.missionProgressCard]}>
        <Text style={styles.cardTitle}>{t('missionProgress', state.language)}</Text>
        <View style={styles.missionStats}>
          <View style={styles.missionStat}>
            <Text style={styles.missionStatNumber}>{completedMissions}</Text>
            <Text style={styles.missionStatLabel}>{t('completed', state.language)}</Text>
          </View>
          <View style={styles.missionStat}>
            <Text style={styles.missionStatNumber}>
              {state.missions.filter(m => m.isAccepted && !m.isCompleted).length}
            </Text>
            <Text style={styles.missionStatLabel}>{t('inProgress', state.language)}</Text>
          </View>
          <View style={styles.missionStat}>
            <Text style={styles.missionStatNumber}>
              {state.missions.filter(m => !m.isAccepted).length}
            </Text>
            <Text style={styles.missionStatLabel}>{t('available', state.language)}</Text>
          </View>
        </View>
        <View style={styles.progressBarContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { width: `${progressPercentage}%` }
              ]} 
            />
          </View>
          <Text style={styles.progressText}>
            {progressPercentage}% {state.language.code === 'ml' ? 'ദൗത്യങ്ങൾ പൂർത്തിയായി' : 'missions completed'}
          </Text>
        </View>
      </View>

      {/* Badges */}
      <View style={[commonStyles.card, styles.badgesCard]}>
        <Text style={styles.cardTitle}>{t('earnedBadges', state.language)}</Text>
        {state.user.badges.length > 0 ? (
          <View style={styles.badgesContainer}>
            {state.user.badges.map((badge) => (
              <View key={badge.id} style={styles.badgeItem}>
                <Text style={styles.badgeIcon}>{badge.icon}</Text>
                <Text style={styles.badgeName}>{getBadgeName(badge)}</Text>
                <Text style={styles.badgeDescription}>{getBadgeDescription(badge)}</Text>
                {badge.earnedAt && (
                  <Text style={styles.badgeDate}>
                    {new Date(badge.earnedAt).toLocaleDateString(state.language.code === 'ml' ? 'ml-IN' : 'en-US')}
                  </Text>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.noBadgesContainer}>
            <Text style={styles.noBadgesIcon}>🏆</Text>
            <Text style={styles.noBadgesText}>{t('noBadgesYet', state.language)}</Text>
            <Text style={styles.noBadgesSubtext}>{t('completeMissionsToEarn', state.language)}</Text>
          </View>
        )}
      </View>

      {/* Achievements Timeline */}
      <View style={[commonStyles.card, styles.timelineCard]}>
        <Text style={styles.cardTitle}>{t('achievementsTimeline', state.language)}</Text>
        <View style={styles.timeline}>
          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>{t('profileCreated', state.language)}</Text>
              <Text style={styles.timelineDate}>
                {new Date(state.user.createdAt).toLocaleDateString(state.language.code === 'ml' ? 'ml-IN' : 'en-US')}
              </Text>
            </View>
          </View>
          
          {state.user.badges.map((badge) => (
            <View key={badge.id} style={styles.timelineItem}>
              <View style={[styles.timelineDot, styles.badgeTimelineDot]} />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>
                  {badge.icon} {getBadgeName(badge)} {t('badgeEarned', state.language)}
                </Text>
                {badge.earnedAt && (
                  <Text style={styles.timelineDate}>
                    {new Date(badge.earnedAt).toLocaleDateString(state.language.code === 'ml' ? 'ml-IN' : 'en-US')}
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>
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
  headerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.grey + '20',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.grey + '40',
  },
  logoutIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  logoutText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  profileImageContainer: {
    backgroundColor: colors.primary + '20',
    borderRadius: 50,
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  profileIcon: {
    fontSize: 50,
  },
  name: {
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: colors.grey,
    marginBottom: 16,
  },
  voiceButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  voiceIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  voiceText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  infoCard: {
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 16,
    color: colors.grey,
    fontWeight: '600',
  },
  scoreCard: {
    backgroundColor: colors.primary + '10',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    marginBottom: 16,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginBottom: 16,
  },
  currentScore: {
    fontSize: 48,
    fontWeight: '800',
    color: colors.primary,
  },
  maxScore: {
    fontSize: 20,
    color: colors.grey,
    marginLeft: 8,
  },
  progressBarContainer: {
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
    fontSize: 14,
    color: colors.grey,
    textAlign: 'center',
  },
  missionProgressCard: {
    marginBottom: 16,
  },
  missionStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  missionStat: {
    alignItems: 'center',
  },
  missionStatNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  missionStatLabel: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
  },
  badgesCard: {
    marginBottom: 16,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeItem: {
    backgroundColor: colors.accent + '20',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    width: '48%',
    alignItems: 'center',
  },
  badgeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  badgeName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeDescription: {
    fontSize: 12,
    color: colors.grey,
    textAlign: 'center',
    marginBottom: 4,
  },
  badgeDate: {
    fontSize: 10,
    color: colors.grey,
    textAlign: 'center',
  },
  noBadgesContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noBadgesIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  noBadgesText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  noBadgesSubtext: {
    fontSize: 14,
    color: colors.grey,
    textAlign: 'center',
  },
  timelineCard: {
    marginBottom: 16,
  },
  timeline: {
    paddingLeft: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
    marginRight: 16,
    marginTop: 4,
  },
  badgeTimelineDot: {
    backgroundColor: colors.accent,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  timelineDate: {
    fontSize: 12,
    color: colors.grey,
  },
});
