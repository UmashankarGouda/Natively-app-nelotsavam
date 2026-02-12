
import React from 'react';
import { Tabs } from 'expo-router';
import { IconSymbol } from '../../components/IconSymbol';
import { colors } from '../../styles/commonStyles';
import { useApp } from '../../contexts/AppContext';
import { t } from '../../utils/translations';

export default function TabLayout() {
  const { state } = useApp();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.text,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopWidth: 1,
          borderTopColor: colors.grey + '30',
          paddingBottom: 8,
          paddingTop: 8,
          height: 70,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('home', state.language),
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="house" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="missions"
        options={{
          title: t('missions', state.language),
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="target" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile', state.language),
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="person" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="forum"
        options={{
          title: t('forum', state.language),
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="bubble.left.and.bubble.right" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: t('leaderboard', state.language),
          tabBarIcon: ({ color, size }) => (
            <IconSymbol name="trophy" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
