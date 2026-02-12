
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { commonStyles, colors, buttonStyles } from '../../styles/commonStyles';
import { useApp } from '../../contexts/AppContext';
import { voiceService } from '../../services/voiceService';
import { Button } from '../../components/button';
import { Mission } from '../../types';
import { t } from '../../utils/translations';

export default function MissionsScreen() {
  const { state, acceptMission, completeMission } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'General', 'Paddy', 'Coconut', 'Rubber', 'Tea', 'Coffee', 'Spices'];

  const filteredMissions = state.missions.filter(mission => {
    if (selectedCategory === 'All') return true;
    return mission.category === selectedCategory;
  });

  const handleAcceptMission = (mission: Mission) => {
    acceptMission(mission.id);
    // Audio announcement always in Malayalam
    voiceService.announceMissionAccepted(mission.titleMalayalam, 'ml');
  };

  const handleCompleteMission = (mission: Mission) => {
    Alert.alert(
      t('complete', state.language) + ' ' + t('missions', state.language),
      'Have you completed this mission?',
      [
        { text: t('cancel', state.language), style: 'cancel' },
        { 
          text: 'Yes', 
          onPress: () => {
            completeMission(mission.id);
            // Audio announcement always in Malayalam
            voiceService.announceMissionCompleted(mission.titleMalayalam, mission.points, 'ml');
          }
        },
      ]
    );
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return colors.success;
      case 'Medium': return colors.warning;
      case 'Hard': return colors.error;
      default: return colors.grey;
    }
  };

  const getDifficultyText = (difficulty: string) => {
    if (state.language.code === 'ml') {
      switch (difficulty) {
        case 'Easy': return 'എളുപ്പം';
        case 'Medium': return 'ഇടത്തരം';
        case 'Hard': return 'കഠിനം';
        default: return difficulty;
      }
    }
    return difficulty;
  };

  return (
    <View style={commonStyles.wrapper}>
      <View style={styles.header}>
        <Text style={[commonStyles.title, styles.title]}>{t('missions', state.language)}</Text>
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.activeCategoryButton,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.activeCategoryText,
              ]}
            >
              {category === 'All' ? (state.language.code === 'ml' ? 'എല്ലാം' : 'All') : category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Missions List */}
      <ScrollView style={styles.missionsContainer} showsVerticalScrollIndicator={false}>
        {filteredMissions.map((mission) => (
          <View key={mission.id} style={[
            commonStyles.missionCard,
            { borderLeftColor: getDifficultyColor(mission.difficulty) }
          ]}>
            <View style={styles.missionHeader}>
              <View style={styles.missionTitleContainer}>
                <Text style={styles.missionTitle}>
                  {state.language.code === 'ml' ? mission.titleMalayalam : mission.title}
                </Text>
              </View>
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(mission.difficulty) + '20' }]}>
                <Text style={[styles.difficultyText, { color: getDifficultyColor(mission.difficulty) }]}>
                  {getDifficultyText(mission.difficulty)}
                </Text>
              </View>
            </View>

            <Text style={styles.missionDescription}>
              {state.language.code === 'ml' ? mission.descriptionMalayalam : mission.description}
            </Text>

            <View style={styles.missionMeta}>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>{t('points', state.language)}:</Text>
                <Text style={styles.metaValue}>{mission.points}</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>{t('estimatedTime', state.language)}:</Text>
                <Text style={styles.metaValue}>{mission.estimatedDuration}</Text>
              </View>
              <View style={styles.metaItem}>
                <Text style={styles.metaLabel}>Category:</Text>
                <Text style={styles.metaValue}>{mission.category}</Text>
              </View>
            </View>

            <View style={styles.missionActions}>
              {!mission.isAccepted && !mission.isCompleted && (
                <Button
                  onPress={() => handleAcceptMission(mission)}
                  style={[buttonStyles.primaryButton, styles.actionButton]}
                >
                  <Text style={styles.buttonText}>{t('accept', state.language)}</Text>
                </Button>
              )}

              {mission.isAccepted && !mission.isCompleted && (
                <View style={styles.acceptedContainer}>
                  <Text style={styles.acceptedText}>✓ Accepted</Text>
                  <Button
                    onPress={() => handleCompleteMission(mission)}
                    style={[buttonStyles.accentButton, styles.actionButton]}
                  >
                    <Text style={styles.buttonTextDark}>{t('complete', state.language)}</Text>
                  </Button>
                </View>
              )}

              {mission.isCompleted && (
                <View style={styles.completedContainer}>
                  <Text style={styles.completedText}>🏆 {t('completed', state.language)}</Text>
                  <Text style={styles.pointsEarned}>+{mission.points} {t('points', state.language)}</Text>
                </View>
              )}
            </View>
          </View>
        ))}

        {filteredMissions.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🎯</Text>
            <Text style={styles.emptyText}>No missions in this category</Text>
            <Text style={styles.emptySubtext}>Check other categories</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    marginBottom: 4,
  },
  categoryContainer: {
    maxHeight: 60,
    marginBottom: 20,
  },
  categoryContent: {
    paddingHorizontal: 20,
  },
  categoryButton: {
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.grey + '30',
  },
  activeCategoryButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  activeCategoryText: {
    color: 'white',
  },
  missionsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  missionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  missionTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  difficultyBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  difficultyText: {
    fontSize: 12,
    fontWeight: '600',
  },
  missionDescription: {
    fontSize: 16,
    color: colors.text,
    lineHeight: 22,
    marginBottom: 16,
  },
  missionMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metaItem: {
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 12,
    color: colors.grey,
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  missionActions: {
    marginTop: 8,
  },
  actionButton: {
    paddingVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonTextDark: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  acceptedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  acceptedText: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '600',
  },
  completedContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.success + '10',
    borderRadius: 8,
    padding: 12,
  },
  completedText: {
    fontSize: 14,
    color: colors.success,
    fontWeight: '600',
  },
  pointsEarned: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.grey,
  },
});
