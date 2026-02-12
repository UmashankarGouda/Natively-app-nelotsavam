
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { commonStyles, colors } from '../../styles/commonStyles';
import { useApp } from '../../contexts/AppContext';
import { voiceService } from '../../services/voiceService';
import { MOCK_LEADERBOARD } from '../../data/mockData';
import { KERALA_DISTRICTS } from '../../types';
import { t } from '../../utils/translations';

export default function LeaderboardScreen() {
  const { state } = useApp();
  const [selectedFilter, setSelectedFilter] = useState<string>('All');
  const [filterType, setFilterType] = useState<'district' | 'crop'>('district');

  const filters = filterType === 'district' 
    ? ['All', ...KERALA_DISTRICTS.slice(0, 5)] // Show first 5 districts for demo
    : ['All', 'Coconut', 'Paddy', 'Rubber', 'Tea', 'Coffee', 'Spices'];

  const filteredLeaderboard = MOCK_LEADERBOARD.filter(entry => {
    if (selectedFilter === 'All') return true;
    if (filterType === 'district') {
      return entry.district === selectedFilter;
    } else {
      return entry.crops.includes(selectedFilter);
    }
  });

  const currentUserRank = MOCK_LEADERBOARD.findIndex(entry => 
    entry.userName === state.user?.name
  ) + 1;

  const handleReadLeaderboard = () => {
    const topThree = filteredLeaderboard.slice(0, 3);
    // Audio announcement always in Malayalam
    const announcement = `ലീഡർബോർഡ്: ${topThree.map((entry, index) => 
      `${index + 1}. ${entry.userName} - ${entry.score} പോയിന്റുകൾ`
    ).join(', ')}`;
    voiceService.speak(announcement, 'ml');
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${rank}`;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1: return colors.accent;
      case 2: return '#C0C0C0';
      case 3: return '#CD7F32';
      default: return colors.text;
    }
  };

  return (
    <View style={commonStyles.wrapper}>
      <View style={styles.header}>
        <Text style={[commonStyles.title, styles.title]}>{t('leaderboard', state.language)}</Text>
        <TouchableOpacity style={styles.voiceButton} onPress={handleReadLeaderboard}>
          <Text style={styles.voiceIcon}>🔊</Text>
          <Text style={styles.voiceText}>{t('listenToLeaderboard', state.language)}</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Type Toggle */}
      <View style={styles.filterTypeContainer}>
        <TouchableOpacity
          style={[
            styles.filterTypeButton,
            filterType === 'district' && styles.activeFilterTypeButton,
          ]}
          onPress={() => {
            setFilterType('district');
            setSelectedFilter('All');
          }}
        >
          <Text
            style={[
              styles.filterTypeText,
              filterType === 'district' && styles.activeFilterTypeText,
            ]}
          >
            By {t('district', state.language)}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.filterTypeButton,
            filterType === 'crop' && styles.activeFilterTypeButton,
          ]}
          onPress={() => {
            setFilterType('crop');
            setSelectedFilter('All');
          }}
        >
          <Text
            style={[
              styles.filterTypeText,
              filterType === 'crop' && styles.activeFilterTypeText,
            ]}
          >
            By Crop
          </Text>
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterContainer}
        contentContainerStyle={styles.filterContent}
      >
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.activeFilterButton,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.activeFilterText,
              ]}
            >
              {filter === 'All' ? t('allDistricts', state.language) : filter}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Current User Rank */}
      {state.user && currentUserRank > 0 && (
        <View style={[commonStyles.card, styles.currentUserCard]}>
          <Text style={styles.currentUserTitle}>Your {t('rank', state.language)}</Text>
          <View style={styles.currentUserRank}>
            <Text style={styles.currentUserRankNumber}>#{currentUserRank}</Text>
            <View style={styles.currentUserInfo}>
              <Text style={styles.currentUserName}>{state.user.name}</Text>
              <Text style={styles.currentUserScore}>{state.user.score} {t('points', state.language)}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Top 3 Podium */}
      {filteredLeaderboard.length >= 3 && (
        <View style={[commonStyles.card, styles.podiumCard]}>
          <Text style={styles.podiumTitle}>Top Three</Text>
          <View style={styles.podium}>
            {/* Second Place */}
            <View style={[styles.podiumPosition, styles.secondPlace]}>
              <Text style={styles.podiumRank}>🥈</Text>
              <Text style={styles.podiumName}>{filteredLeaderboard[1].userName}</Text>
              <Text style={styles.podiumScore}>{filteredLeaderboard[1].score}</Text>
            </View>
            
            {/* First Place */}
            <View style={[styles.podiumPosition, styles.firstPlace]}>
              <Text style={styles.podiumRank}>🥇</Text>
              <Text style={styles.podiumName}>{filteredLeaderboard[0].userName}</Text>
              <Text style={styles.podiumScore}>{filteredLeaderboard[0].score}</Text>
            </View>
            
            {/* Third Place */}
            <View style={[styles.podiumPosition, styles.thirdPlace]}>
              <Text style={styles.podiumRank}>🥉</Text>
              <Text style={styles.podiumName}>{filteredLeaderboard[2].userName}</Text>
              <Text style={styles.podiumScore}>{filteredLeaderboard[2].score}</Text>
            </View>
          </View>
        </View>
      )}

      {/* Full Leaderboard */}
      <ScrollView style={styles.leaderboardContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionTitle}>Full {t('leaderboard', state.language)}</Text>
        
        {filteredLeaderboard.map((entry, index) => (
          <View 
            key={entry.userId} 
            style={[
              commonStyles.card, 
              styles.leaderboardItem,
              entry.userName === state.user?.name && styles.currentUserItem,
            ]}
          >
            <View style={styles.rankContainer}>
              <Text style={[styles.rankText, { color: getRankColor(entry.rank) }]}>
                {typeof getRankIcon(entry.rank) === 'string' && getRankIcon(entry.rank).length > 2 
                  ? getRankIcon(entry.rank) 
                  : `#${entry.rank}`}
              </Text>
            </View>
            
            <View style={styles.userContainer}>
              <Text style={styles.leaderboardUserName}>{entry.userName}</Text>
              <View style={styles.userDetails}>
                <Text style={styles.userLocation}>📍 {entry.district}</Text>
                <Text style={styles.userCrops}>🌾 {entry.crops.join(', ')}</Text>
              </View>
            </View>
            
            <View style={styles.scoreContainer}>
              <Text style={styles.leaderboardScore}>{entry.score}</Text>
              <Text style={styles.scoreLabel}>{t('points', state.language)}</Text>
            </View>
            
            <View style={styles.badgesContainer}>
              {entry.badges.slice(0, 3).map((badge) => (
                <Text key={badge.id} style={styles.badgeIcon}>{badge.icon}</Text>
              ))}
              {entry.badges.length > 3 && (
                <Text style={styles.moreBadges}>+{entry.badges.length - 3}</Text>
              )}
            </View>
          </View>
        ))}

        {filteredLeaderboard.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>🏆</Text>
            <Text style={styles.emptyText}>No data in this filter</Text>
            <Text style={styles.emptySubtext}>Check other filters</Text>
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
  filterTypeContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: colors.card,
    borderRadius: 25,
    padding: 4,
  },
  filterTypeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  activeFilterTypeButton: {
    backgroundColor: colors.primary,
  },
  filterTypeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  activeFilterTypeText: {
    color: 'white',
  },
  filterContainer: {
    maxHeight: 60,
    marginBottom: 20,
  },
  filterContent: {
    paddingHorizontal: 20,
  },
  filterButton: {
    backgroundColor: colors.card,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.grey + '30',
  },
  activeFilterButton: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
  },
  activeFilterText: {
    color: 'white',
  },
  currentUserCard: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: colors.primary + '10',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  currentUserTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  currentUserRank: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currentUserRankNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginRight: 16,
  },
  currentUserInfo: {
    flex: 1,
  },
  currentUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  currentUserScore: {
    fontSize: 14,
    color: colors.grey,
  },
  podiumCard: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  podiumTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  podium: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  podiumPosition: {
    alignItems: 'center',
    marginHorizontal: 8,
    padding: 16,
    borderRadius: 12,
    minWidth: 80,
  },
  firstPlace: {
    backgroundColor: colors.accent + '20',
    height: 120,
    justifyContent: 'flex-end',
  },
  secondPlace: {
    backgroundColor: '#C0C0C0' + '20',
    height: 100,
    justifyContent: 'flex-end',
  },
  thirdPlace: {
    backgroundColor: '#CD7F32' + '20',
    height: 80,
    justifyContent: 'flex-end',
  },
  podiumRank: {
    fontSize: 32,
    marginBottom: 8,
  },
  podiumName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  podiumScore: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  leaderboardContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  leaderboardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 16,
  },
  currentUserItem: {
    backgroundColor: colors.primary + '10',
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  rankContainer: {
    width: 50,
    alignItems: 'center',
  },
  rankText: {
    fontSize: 18,
    fontWeight: '700',
  },
  userContainer: {
    flex: 1,
    marginLeft: 12,
  },
  leaderboardUserName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  userDetails: {
    flexDirection: 'column',
  },
  userLocation: {
    fontSize: 12,
    color: colors.grey,
    marginBottom: 2,
  },
  userCrops: {
    fontSize: 12,
    color: colors.grey,
  },
  scoreContainer: {
    alignItems: 'center',
    marginRight: 12,
  },
  leaderboardScore: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  scoreLabel: {
    fontSize: 10,
    color: colors.grey,
  },
  badgesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeIcon: {
    fontSize: 16,
    marginLeft: 2,
  },
  moreBadges: {
    fontSize: 12,
    color: colors.grey,
    marginLeft: 4,
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
