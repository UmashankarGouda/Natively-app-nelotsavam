
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, Mission, Badge, AppLanguage } from '../types';
import { MOCK_MISSIONS, AVAILABLE_BADGES } from '../data/mockData';

interface AppState {
  user: User | null;
  missions: Mission[];
  language: AppLanguage;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_MISSIONS'; payload: Mission[] }
  | { type: 'UPDATE_MISSION'; payload: Mission }
  | { type: 'SET_LANGUAGE'; payload: AppLanguage }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ONBOARDING_COMPLETE'; payload: boolean }
  | { type: 'ADD_POINTS'; payload: number }
  | { type: 'ADD_BADGE'; payload: Badge }
  | { type: 'LOGOUT' };

const initialState: AppState = {
  user: null,
  missions: MOCK_MISSIONS,
  language: { code: 'en', name: 'English', nativeName: 'English' }, // Default to English
  isLoading: false,
  hasCompletedOnboarding: false,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  saveUserData: (user: User) => Promise<void>;
  loadUserData: () => Promise<void>;
  acceptMission: (missionId: string) => void;
  completeMission: (missionId: string) => void;
  addPoints: (points: number) => void;
  checkAndAwardBadges: () => void;
  changeLanguage: (language: AppLanguage) => Promise<void>;
} | null>(null);

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_MISSIONS':
      return { ...state, missions: action.payload };
    case 'UPDATE_MISSION':
      return {
        ...state,
        missions: state.missions.map(mission =>
          mission.id === action.payload.id ? action.payload : mission
        ),
      };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ONBOARDING_COMPLETE':
      return { ...state, hasCompletedOnboarding: action.payload };
    case 'ADD_POINTS':
      return {
        ...state,
        user: state.user ? { ...state.user, score: state.user.score + action.payload } : null,
      };
    case 'ADD_BADGE':
      return {
        ...state,
        user: state.user
          ? { ...state.user, badges: [...state.user.badges, action.payload] }
          : null,
      };
    case 'LOGOUT':
      return {
        ...initialState,
        language: state.language, // Keep language preference
      };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const saveUserData = async (user: User) => {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(user));
      dispatch({ type: 'SET_USER', payload: user });
      console.log('User data saved successfully');
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const loadUserData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const userData = await AsyncStorage.getItem('userData');
      const onboardingComplete = await AsyncStorage.getItem('onboardingComplete');
      const savedLanguage = await AsyncStorage.getItem('appLanguage');
      
      if (userData) {
        const user = JSON.parse(userData);
        dispatch({ type: 'SET_USER', payload: user });
      }
      
      if (onboardingComplete) {
        dispatch({ type: 'SET_ONBOARDING_COMPLETE', payload: true });
      }

      if (savedLanguage) {
        const language = JSON.parse(savedLanguage);
        dispatch({ type: 'SET_LANGUAGE', payload: language });
      }
      
      console.log('User data loaded successfully');
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const changeLanguage = async (language: AppLanguage) => {
    try {
      await AsyncStorage.setItem('appLanguage', JSON.stringify(language));
      dispatch({ type: 'SET_LANGUAGE', payload: language });
      console.log(`Language changed to: ${language.name}`);
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  const acceptMission = (missionId: string) => {
    const mission = state.missions.find(m => m.id === missionId);
    if (mission) {
      const updatedMission = {
        ...mission,
        isAccepted: true,
        acceptedAt: new Date(),
      };
      dispatch({ type: 'UPDATE_MISSION', payload: updatedMission });
      console.log(`Mission ${missionId} accepted`);
    }
  };

  const completeMission = (missionId: string) => {
    const mission = state.missions.find(m => m.id === missionId);
    if (mission && mission.isAccepted) {
      const updatedMission = {
        ...mission,
        isCompleted: true,
        completedAt: new Date(),
        proofSubmitted: true,
      };
      dispatch({ type: 'UPDATE_MISSION', payload: updatedMission });
      addPoints(mission.points);
      console.log(`Mission ${missionId} completed, awarded ${mission.points} points`);
    }
  };

  const addPoints = (points: number) => {
    dispatch({ type: 'ADD_POINTS', payload: points });
    checkAndAwardBadges();
  };

  const checkAndAwardBadges = () => {
    if (!state.user) return;

    const currentScore = state.user.score;
    const currentBadgeIds = state.user.badges.map(b => b.id);

    AVAILABLE_BADGES.forEach(badge => {
      if (currentScore >= badge.pointsRequired && !currentBadgeIds.includes(badge.id)) {
        const earnedBadge = { ...badge, earnedAt: new Date() };
        dispatch({ type: 'ADD_BADGE', payload: earnedBadge });
        console.log(`Badge earned: ${badge.name}`);
      }
    });
  };

  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        saveUserData,
        loadUserData,
        acceptMission,
        completeMission,
        addPoints,
        checkAndAwardBadges,
        changeLanguage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
