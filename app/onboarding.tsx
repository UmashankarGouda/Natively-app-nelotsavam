
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Easing, Image } from 'react-native';
import { router } from 'expo-router';
import { Button } from '../components/button';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { voiceService } from '../services/voiceService';
import { useApp } from '../contexts/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { t } from '../utils/translations';

const onboardingSteps = [
  {
    titleKey: 'welcomeToNelotsavam',
    descriptionKey: 'welcomeToSustainableFarming',
    icon: '🌾',
    showLogo: true,
  },
  {
    titleKey: 'missions',
    descriptionKey: 'missionsDescription',
    icon: '🎯',
    showLogo: false,
  },
  {
    titleKey: 'communityForum',
    descriptionKey: 'communityDescription',
    icon: '👥',
    showLogo: false,
  },
  {
    titleKey: 'Audio Support Feature',
    descriptionKey: 'voiceCommandsDescription',
    icon: '🎤',
    showLogo: false,
  },
];

export default function OnboardingScreen() {
  const { state, dispatch } = useApp();
  const [currentStep, setCurrentStep] = useState(0);
  const [fadeAnim] = useState(new Animated.Value(1));
  const [slideAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Audio announcement always in Malayalam
    const step = onboardingSteps[currentStep];
    const description = t(step.descriptionKey, { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' });
    voiceService.speak(description, 'ml');
  }, [currentStep]);

  const animateTransition = (callback: () => void) => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]).start(() => {
      callback();
      slideAnim.setValue(100);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      animateTransition(() => setCurrentStep(currentStep + 1));
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      animateTransition(() => setCurrentStep(currentStep - 1));
    }
  };

  const handleComplete = async () => {
    try {
      await AsyncStorage.setItem('onboardingComplete', 'true');
      dispatch({ type: 'SET_ONBOARDING_COMPLETE', payload: true });
      // Audio always in Malayalam
      voiceService.speak('പ്രൊഫൈൽ സൃഷ്ടിക്കാൻ തുടങ്ങുക', 'ml');
      router.replace('/profile-creation');
    } catch (error) {
      console.error('Error saving onboarding completion:', error);
    }
  };

  const currentStepData = onboardingSteps[currentStep];

  return (
    <ScrollView style={commonStyles.wrapper} contentContainerStyle={styles.container}>
      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {currentStep + 1} / {onboardingSteps.length}
        </Text>
      </View>

      <Animated.View 
        style={[
          styles.contentContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        {currentStepData.showLogo ? (
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/images/5d1c9f0b-301e-42a9-95a7-b9fd3742e16e.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        ) : (
          <Text style={styles.icon}>{currentStepData.icon}</Text>
        )}
        
        {/* Only show title if it's not the first step or if titleKey is not empty */}
        {currentStepData.titleKey && currentStep !== 0 && (
          <Text style={[commonStyles.title, styles.title]}>
            {t(currentStepData.titleKey, state.language)}
          </Text>
        )}
        
        <Text style={[commonStyles.text, styles.description]}>
          {t(currentStepData.descriptionKey, state.language)}
        </Text>
      </Animated.View>

      <View style={styles.buttonContainer}>
        <View style={styles.navigationButtons}>
          {currentStep > 0 && (
            <Button
              onPress={handlePrevious}
              variant="secondary"
              style={[buttonStyles.secondaryButton, styles.navButton]}
            >
              <Text style={styles.buttonText}>{t('previous', state.language)}</Text>
            </Button>
          )}
          
          <Button
            onPress={handleNext}
            variant="primary"
            style={[buttonStyles.primaryButton, styles.navButton]}
          >
            <Text style={styles.buttonTextPrimary}>
              {currentStep === onboardingSteps.length - 1 ? t('start', state.language) : t('next', state.language)}
            </Text>
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: colors.grey + '30',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: colors.grey,
    fontWeight: '500',
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: -50,
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 250,
  },
  icon: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    marginBottom: 24,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
		fontSize : 20,
  },
  buttonContainer: {
    paddingTop: 40,
  },
  navigationButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  buttonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextPrimary: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
